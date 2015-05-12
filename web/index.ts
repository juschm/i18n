/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/lodash/lodash.d.ts" />

var app = angular.module('i18nConsole', []);

import * as G from './globals';
import './directives/message';
import * as M from '../lib/message_types';
import {newSerializer as newJsonSerializer} from '../lib/serializers/json';

export interface Scope extends ng.IScope {
  messages: M.Message[];
  errors: string[];
  M: typeof M;
}

app.controller('rootCtrl', function rootCtrl($scope: Scope, $http: ng.IHttpService) {
  $scope.messages = [];
  $scope.errors = [];
  $scope.M = M;

  $http.get('../i18nData/messages.json').
    success(function(messagePojos: any[], status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
      var serializer = newJsonSerializer();
      var messages: M.Message[] = $scope.messages = [];
      messagePojos.forEach(function(pojo) {
        $scope.messages.push(<M.Message>serializer.parse(JSON.stringify(pojo)));
      });
    }).
    error(function(response, status, headers, config) {
      $scope.errors.push("Error loading messages.json");
    });
});


// Register all directives.
_.forEach(G.directives, function(nameAndFunction: G.DirectiveNameAndFunction) {
  app.directive(nameAndFunction[0], nameAndFunction[1]);
});

