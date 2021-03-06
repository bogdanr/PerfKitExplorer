/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Tests for QueryFilterDirective, which encapsulates the global config
 * settings.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderFilterConfigDirective');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetModel');

describe('QueryFilterDirective', function() {
  var scope, $compile, $httpBackend, $timeout, uiConfig;
  var configSvc, dashboardSvc;

  const explorer = p3rf.perfkit.explorer;
  const ChartWidgetModel = explorer.models.ChartWidgetModel;

  const TEMPLATE_DATEPICKER = 'template/datepicker/datepicker.html';
  const TEMPLATE_TIMEPICKER = 'template/timepicker/timepicker.html';

  beforeEach(module('explorer'));
  beforeEach(module('p3rf.perfkit.explorer.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_,
       _$timeout_, _configService_, _dashboardService_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;

    configSvc = _configService_;
    dashboardSvc = _dashboardService_;
    dashboardSvc.newDashboard();

    scope.$digest();
  }));

  describe('compilation', function() {

    it('should succeed as a standalone element.', function() {
      function compile() {
        $httpBackend.expectGET(TEMPLATE_DATEPICKER).respond(200);
        $httpBackend.expectGET(TEMPLATE_TIMEPICKER).respond(200);

        scope.providedWidgetModel = new ChartWidgetModel();

        var actualElement = angular.element(
            '<query-builder-filter-config ng-model="providedWidgetModel" />');

        $compile(actualElement)(scope);
        scope.$digest();
      }
      expect(compile).not.toThrow();
    });
  });

  describe('should contain a element for', function() {

    var actualElement;

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_DATEPICKER).respond(200);
      $httpBackend.expectGET(TEMPLATE_TIMEPICKER).respond(200);

      scope.widgetModel = new ChartWidgetModel();

      actualElement = angular.element(
        '<query-builder-filter-config ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('the start_date filter', function() {
      var startDateElement = actualElement.find(
        'input.widget-filter-start-date');
      expect(startDateElement.length).toBe(1);
    });

    it('showing the end_date filter', function() {
      var addEndDateElement = actualElement.find(
        'a.widget-filter-end-date-add');
      expect(addEndDateElement.length).toBe(1);
    });

    it('the end date filter', function() {
      var endDateElement = actualElement.find(
        'input.widget-filter-end-date');
      expect(endDateElement.length).toBe(1);
    });

    it('removing end date filter', function() {
      var removeEndDateElement = actualElement.find(
        'span.widget-filter-end-date-remove');
      expect(removeEndDateElement.length).toBe(1);
    });

    it('adding the official filter', function() {
      var addOfficialElement = actualElement.find(
        'a.widget-filter-official-add');
      expect(addOfficialElement.length).toBe(1);
    });

    it('the official filter', function() {
      var officialElement = actualElement.find(
        'input.widget-filter-official');
      expect(officialElement.length).toBe(1);
    });

    it('removing the official filter', function() {
      var removeOfficialElement = actualElement.find(
        'span.widget-filter-official-remove');
      expect(removeOfficialElement.length).toBe(1);
    });

    it('the product name filter', function() {
      var productElement = actualElement.find(
        'input.widget-filter-product-name');
      expect(productElement.length).toBe(1);
    });

    it('the test name filter', function() {
      var testElement = actualElement.find(
        'input.widget-filter-test-name');
      expect(testElement.length).toBe(1);
    });

    it('the metric name filter', function() {
      var metricElement = actualElement.find(
        'input.widget-filter-metric-name');
      expect(metricElement.length).toBe(1);
    });

    it('the test runner filter', function() {
      var runbyElement = actualElement.find(
        'input.widget-filter-runby');
      expect(runbyElement.length).toBe(1);
    });

    it('the metadata filters', function() {
      var metadataElement = actualElement.find(
        'span.widget-filter-metadata');
      expect(metadataElement.length).toBe(1);
    });
  });

  describe('should reflect the ngModel state for', function() {
    var filters;

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_DATEPICKER).respond(200);
      $httpBackend.expectGET(TEMPLATE_TIMEPICKER).respond(200);

      scope.widgetModel = dashboardSvc.selectedWidget.model;

      filters = scope.widgetModel.datasource.config.filters;

      actualElement = angular.element(
        '<query-builder-filter-config ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('the start date filter', function() {
      filters.start_date.text = 'last 3 months';

      scope.$digest();

      var startDateElement = actualElement.find(
        'input.widget-filter-start-date')[0];
      expect(startDateElement.value).toBe('last 3 months');
    });

    it('the end date filter', function() {
      filters.end_date = {
        type: 'DAY',
        value: 2,
        text: 'last 2 days'
      };

      scope.$digest();

      var endDateElement = actualElement.find(
        'input.widget-filter-end-date')[0];
      expect(endDateElement.value).toBe('last 2 days');
    });

    it('the official filter', function() {
      var officialElement = actualElement.find(
        'input.widget-filter-official')[0];

      expect(officialElement.checked).toBe(true);

      filters.official = false;
      scope.$digest();

      expect(officialElement.checked).toBe(false);
    });

    it('the product name filter', function() {
      var productElement = actualElement.find(
        'input.widget-filter-product-name')[0];

      expect(productElement.value).toBe('');

      filters.product_name = 'new_product';
      scope.$digest();

      expect(productElement.value).toBe('new_product');
    });

    it('the test name filter', function() {
      var testElement = actualElement.find(
        'input.widget-filter-test-name')[0];

      expect(testElement.value).toBe('');

      filters.test = 'new_test';
      scope.$digest();

      expect(testElement.value).toBe('new_test');
    });

    it('the metric name filter', function() {
      var metricElement = actualElement.find(
        'input.widget-filter-metric-name')[0];

      expect(metricElement.value).toBe('');

      filters.metric = 'new_metric';
      scope.$digest();

      expect(metricElement.value).toBe('new_metric');
    });

    it('the runby filter', function() {
      var runbyElement = actualElement.find(
        'input.widget-filter-runby')[0];

      expect(runbyElement.value).toBe('');

      filters.runby = 'new_runby';
      scope.$digest();

      expect(runbyElement.value).toBe('new_runby');
    });

    it('the metadata filters', function() {
      var metadataElement = actualElement.find(
          'span.widget-filter-metadata')[0];

      expect(metadataElement.children.length).toBe(1);

      filters.metadata.push({
        label: 'color',
        value: 'blue',
        text: 'color:blue'
      });
      scope.$digest();

      expect(metadataElement.children.length).toBe(2);
      expect(metadataElement.children[0].children[0].value)
          .toBe('color:blue');
    });
  });

  describe('should toggle visibility for', function() {
    var filters;

    beforeEach(inject(function() {
      $httpBackend.expectGET(TEMPLATE_DATEPICKER).respond(200);
      $httpBackend.expectGET(TEMPLATE_TIMEPICKER).respond(200);

      scope.widgetModel = dashboardSvc.selectedWidget.model;

      filters = scope.widgetModel.datasource.config.filters;

      actualElement = angular.element(
        '<query-builder-filter-config ng-model="widgetModel" />');

      $compile(actualElement)(scope);
      scope.$digest();
    }));

    it('the end date filter', function() {
      var addEndDateElement = actualElement.find(
        'a.widget-filter-end-date-add')[0];
      var removeEndDateElement = actualElement.find(
        'span.widget-filter-end-date-remove')[0];
      var endDateElement = actualElement.find(
        'input.widget-filter-end-date')[0];
      var endDateElementContainer = angular.element(
        endDateElement.parentElement.parentElement);

      expect(filters.end_date).toBeNull();
      expect(endDateElementContainer
          .hasClass('ng-hide')).toBe(true);

      addEndDateElement.click();

      expect(filters.end_date).not.toBeNull();
      expect(endDateElementContainer
          .hasClass('ng-hide')).toBe(false);

      removeEndDateElement.click();

      expect(filters.end_date).toBeNull();
      expect(endDateElementContainer
          .hasClass('ng-hide')).toBe(true);
    });

    it('the official filter', function() {
      var addOfficialElement = actualElement.find(
        'a.widget-filter-official-add')[0];
      var removeOfficialElement = actualElement.find(
        'span.widget-filter-official-remove')[0];
      var officialElement = actualElement.find(
        'input.widget-filter-official')[0];
      var officialElementContainer = angular.element(
        officialElement.parentElement.parentElement);

      expect(filters.official).toBe(true);
      expect(officialElementContainer
          .hasClass('ng-hide')).toBe(false);

      removeOfficialElement.click();

      expect(filters.official).toBeNull();
      expect(officialElementContainer
          .hasClass('ng-hide')).toBe(true);

      addOfficialElement.click();

      expect(filters.official).toBe(true);
      expect(officialElementContainer
          .hasClass('ng-hide')).toBe(false);
    });
  });
});
