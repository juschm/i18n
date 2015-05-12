import * as G from '../globals';

export function icHtmlTagPair() {
  return {
    restrict: "A",
    scope: {
      part: "=icHtmlTagPair"
    },
    template: `
      <div class="Placeholder">{{part.beginPlaceholderRef.name}}</div>
      &lt;TODO&gt;
      <!--
         - <div ng-if="part.parts && part.parts.length > 0" class="inline">
         -   <div ic-message-parts="part.parts" class="inline"></div>
         - </div>
         -->
      <div class="Placeholder">{{part.endPlaceholderRef.name}}</div>
    `
  };
}

G.directives.push(["icHtmlTagPair", icHtmlTagPair]);
