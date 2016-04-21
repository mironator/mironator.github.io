(function(){
	'use strict';

	angular
		.module('app.map')
		.controller('SearchForm', SearchForm);

	SearchForm.$inject = ['$rootScope', 'dataservice', 'logger'];

	function SearchForm($rootScope, dataservice, logger){
		/*jshint validthis: true */
		var vm = this;
		vm.enumeration = {
			currencies : [],
			experiencies : [],
			employments : [],
			schedules : []
		};
		vm.filter = {};
		vm.label = {
			text : "",
			experience : "",
			employment : "",
			schedule : "",
			currency : "",
			salary : ""
		};
		vm.title = 'Search Form';
		vm.update = update;

		activate();

		function activate(){
			//return searchRecords();
			getLabels();
			logger.info("Searchform", "Searchform loaded");
		}

		function getSearchFields(){
			return vm.filter;
		}

		function setLabels(response){
			vm.label.text = "Text";
			vm.label.experience = response.data.vacancy_cluster[5].name;
			vm.label.employment = response.data.vacancy_cluster[9].name;
			vm.label.schedule = response.data.vacancy_cluster[2].name;
			vm.label.currency = "Currency";
			vm.label.salary = response.data.vacancy_cluster[7].name;
			vm.enumeration.currencies = response.data.currency;
			vm.enumeration.experiencies = response.data.experience;
			vm.enumeration.employments = response.data.employment;
			vm.enumeration.schedules = response.data.schedule;
		}

		function getLabels(){
			return dataservice.getLabels().then(setLabels);
		}

		function update(){
			dataservice.setFilter(vm.filter);
			$rootScope.$broadcast('updateMap');
		}
	}
})();