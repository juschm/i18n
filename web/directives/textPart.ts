import * as G from '../globals';

export function icTextPart() {
  return {
    restrict: "A",
    scope: {
      part: "=icTextPart"
    },
    template: `
      <div class="TextPart">{{part.value}}</div>
    `
  };
}

G.directives.push(["icTextPart", icTextPart]);
