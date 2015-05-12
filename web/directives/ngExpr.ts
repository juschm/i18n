import * as G from '../globals';

export function icNgExpr() {
  return {
    restrict: "A",
    scope: {
      part: "=icNgExpr"
    },
    template: `
    <div class="NgExpr">
      {{part.text}}
      <div class="details">
        <div ng-if="part.text">Original expression: <pre>{{part.text}}</pre></div>
        <div ng-if="part.comment"><i>{{part.comment}}</i></div>
        <div ng-if="part.examples">
          Examples
          <ul>
            <li ng-repeat="example in part.examples">
              {{example}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    `
  };
}

G.directives.push(["icNgExpr", icNgExpr]);
