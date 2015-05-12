import * as G from '../globals';
import * as M from '../../lib/message_types';
import './ngExpr';
import './textPart';
import './htmlTagPair';

export interface Scope extends ng.IScope {
  part: M.ConcreteMessagePart;
  getStableTypeName: typeof M.getStableTypeName;
}

export function icMessagePart() {
  return {
    restrict: "A",
    scope: {
      part: "=icMessagePart"
    },
    controller: ['$scope', function($scope: Scope) {
      $scope.getStableTypeName = M.getStableTypeName;
    }],
    template: `
      <div ng-switch="getStableTypeName(part)" class="inline">
        <div ng-switch-when="TextPart"    ic-text-part    ="part"></div>
        <div ng-switch-when="NgExpr"      ic-ng-expr      ="part"></div>
        <div ng-switch-when="HtmlTagPair" ic-html-tag-pair="part"></div>
        <div ng-switch-default>Unknown message part</div>
      </div>
      `
  };
}

G.directives.push(["icMessagePart", icMessagePart]);
