/// <reference path="typings/angularjs/angular.d.ts" />

export interface DirectiveNameAndFunction extends Array<string|ng.IDirectiveFactory> {
  0: string;
  1: ng.IDirectiveFactory;
}

export var directives: Array<DirectiveNameAndFunction> = [];
