/// <reference path="../typings/angularjs/angular.d.ts" />
import * as G from '../globals';
import './messageParts';

export function icMessage() {
  return {
    restrict: "A",
    replace: true,
    scope: {
      message: "=icMessage"
    },
    template: `
        <div>
          <div><small>ID: {{message.id}}</small></div>
          <div ic-message-parts="message.parts"></div>
          <div ng-if="message.comment">Comment: <i>{{message.comment}}</i></div>
        </div>
        `
  };
}

G.directives.push(["icMessage", icMessage]);
