/// <reference path="../typings/angularjs/angular.d.ts" />
import * as G from '../globals';
import './messagePart';

export function icMessageParts() {
  return {
    restrict: "A",
    scope: {
      parts: "=icMessageParts"
    },
    template: `
      <div ng-repeat="part in parts track by $index" class="inline">
        <div ic-message-part="part" class="inline">ckck</div>
      </div>
        `
  };
}

G.directives.push(["icMessageParts", icMessageParts]);
