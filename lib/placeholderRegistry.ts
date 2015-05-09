import * as M from './message_types';
import LoadingCache from './LoadingCache';
import Counter from './Counter';
import {getNameHintForPlaceholder} from './placeholderRegistryHints';

function toBool(x: any): boolean {
  return x ? true : false;
}

export type ConcretePlaceholderOrTagPair = M.ConcretePlaceholder|M.ConcreteTagPair;

export default class PlaceholderRegistry {
  private _namesSeen = new Set<string>();
  // We require an ordered Map.  ES6 Map's iterate in insertion order (Map.forEach)
  // so we can simply use Map.
  // Refer section 23.1.3.5 of the draft spec.
  // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-map.prototype.foreach
  private _byFingerprint = new Map<string, ConcretePlaceholderOrTagPair>();
  private _countsByPrefix = new LoadingCache<string, Counter>(key => new Counter(1));
  private _counter = new Counter(1);

  toMap(): M.PlaceHoldersMap {
    var self = this;
    this._byFingerprint.forEach((placeholderOrTag) => self._ensureName(placeholderOrTag));
    var result: M.PlaceHoldersMap = new Map<string, M.ConcretePlaceholder>();
    var internalError = false;
    this._byFingerprint.forEach(function (placeholderOrTag) {
      if (placeholderOrTag instanceof M.PlaceholderBase) {
        result.set(placeholderOrTag.name, placeholderOrTag);
      } else if (placeholderOrTag instanceof M.TagPair) {
        var tag_pair = <M.TagPair>placeholderOrTag;
        result.set(tag_pair.beginPlaceholderRef.name, tag_pair.beginPlaceholderRef);
        result.set(tag_pair.endPlaceholderRef.name, tag_pair.endPlaceholderRef);
      } else {
        internalError = true;
      }
    });
    if (internalError) {
      throw Error('Internal Error');
    }
    return result;
  }

  _ensureNamesForTag(placeholder: M.ConcreteTagPair): void {
    if (placeholder.beginPlaceholderRef.name) {
      return;
    }
    var nameHint = getNameHintForPlaceholder(placeholder);
    var beginBasename = nameHint + '_BEGIN',
        endBasename   = nameHint + '_END',
        phBeginName   = beginBasename,
        phEndName     = endBasename,
        counter       = this._countsByPrefix.get(beginBasename);
    while (this._namesSeen.has(phBeginName) || this._namesSeen.has(phEndName)) {
      var count = counter.next();
      phBeginName = `${beginBasename}_${count}`;
      phEndName = `${endBasename}_${count}`;
    }
    this._namesSeen.add(phBeginName);
    this._namesSeen.add(phEndName);
    placeholder.beginPlaceholderRef.name = phBeginName;
    placeholder.endPlaceholderRef.name = phEndName;
  }

  ensureNameForPlaceholder(placeholder: M.ConcretePlaceholder): void {
    if (placeholder.name) {
      return;
    }
    var basename = getNameHintForPlaceholder(placeholder),
        name     = basename;
    var counter = this._countsByPrefix.get(basename);
    while (this._namesSeen.has(name)) {
      name = `${basename}_${counter.next()}`;
    }
    this._namesSeen.add(name);
    placeholder.name = name;
  }

  _ensureName(placeholder: ConcretePlaceholderOrTagPair) {
    if (placeholder instanceof M.TagPair) {
      this._ensureNamesForTag(<M.ConcreteTagPair>placeholder);
    } else {
      this.ensureNameForPlaceholder(<M.ConcretePlaceholder>placeholder);
    }
  }

  reserveNewTag(tagName: string): string {
    var canonicalKey = `TAG_${tagName}_${this._counter.next()}`;
    this._byFingerprint.set(canonicalKey, null);
    return canonicalKey;
  }

  updatePlaceholder(placeholder: M.ConcretePlaceholder): M.ConcretePlaceholder;
  updatePlaceholder(placeholder: M.ConcreteTagPair): M.ConcreteTagPair;
  updatePlaceholder(placeholder: ConcretePlaceholderOrTagPair): /* ConcretePlaceholderOrTagPair */ any {
    if (placeholder instanceof M.TagPair) {
      return this._updateTagPlaceholder(<M.ConcreteTagPair>placeholder);
    } else {
      return this._updateSimplePlaceholder(<M.ConcretePlaceholder>placeholder);
    }
  }

  _updateTagPlaceholder(placeholder: M.ConcreteTagPair): M.ConcreteTagPair {
    var canonicalKey = placeholder.toLongFingerprint();
    this._byFingerprint.set(canonicalKey, placeholder);
    return placeholder;
  }

  _updateSimplePlaceholder(placeholder: M.ConcretePlaceholder): M.ConcretePlaceholder {
    var canonicalKey = placeholder.toLongFingerprint();
    var existingPlaceholder = (<M.ConcretePlaceholder>this._byFingerprint.get(canonicalKey));
    if (existingPlaceholder !== void 0) {
      var numNames: number = <any>toBool(placeholder.name) + <any>toBool(existingPlaceholder.name);
      if (numNames === 2) {
        if (placeholder.name != existingPlaceholder.name) {
          throw Error('The same placeholder occurs more than once with a different placeholder name.');
        }
      } else if (numNames == 1) {
        if (placeholder.name == null) {
          placeholder.name = existingPlaceholder.name;
        } else {
          existingPlaceholder.name = placeholder.name;
        }
      }
    } else {
      this._byFingerprint.set(canonicalKey, placeholder);
    }
    return placeholder;
  }
}
