(function(){
	'use strict';

	angular
		.module("app.services")
		.factory("dataservice", dataservice);

	dataservice.$inject = ['$http', '$q', 'logger'];

	function dataservice($http, $q, logger){
		var filter = {};
		var bounds;
		
		var service = {
			getMarkers : getMarkers,
			getLabels : getLabels,
			getFilter : getFilter,
			setFilter : setFilter,
			getBounds : getBounds,
			setBounds : setBounds
		}

		return service;

		function getMarkers(){
			var deferredAbort = $q.defer();

			var schedule = "";
			if(filter.schedule != undefined)
			for (var i = filter.schedule.length - 1; i >= 0; i--) {
				schedule += "&schedule=" + filter.schedule[i];
			};
			var employment = "";
			if(filter.employment != undefined)
			for (var i = filter.employment.length - 1; i >= 0; i--) {
				employment += "&employment=" + filter.employment[i];
			};

			var request = $http(
				{
					method : "GET",
					url : "https://api.hh.ru/vacancies?" +
						"per_page=500" + 
						"&enable_snippets=true" + 
						"&label=with_address" + 
						"&isMap=true" + 
						(bounds ? "&top_lat=" + bounds.getNorth() : "") + 
						(bounds ? "&bottom_lat=" + bounds.getSouth() : "") + 
						(bounds ? "&left_lng=" + bounds.getWest() : "") + 
						(bounds ? "&right_lng=" + bounds.getEast() : "") + 
						(filter.text && filter.text.length > 0 ? "&text=" + filter.text : "") + 
						(filter.salary && filter.salary > 0 ? "&salary=" + filter.salary + "&only_with_salary=true" : "") + 
						(filter.currency && filter.currency.length > 0 ? "&currency=" + filter.currency : "") + 
						(filter.experience && filter.experience.length > 0 ? "&experience=" + filter.experience : "") + 
						 //(filter.employment != undefined && filter.employment.length > 0 ? "&employment=" + filter.employment : "") + 
						 //(filter.schedule != undefined && filter.schedule.length > 0 ? "&schedule=" + filter.schedule : "")
						schedule + 
						employment,
					timeout : deferredAbort.promise
				}
			);

			var promise = request.then(
                getMarkersComplete,
                getMarkersError
            );

            promise.abort = abort;
			
			return promise;

            function getMarkersComplete(response) {
                return response;
            }

            function getMarkersError(response) {
				return response;
			}

			function abort(){
				deferredAbort.resolve();
			}
		}

		function getLabels(){
			return $http.get("https://api.hh.ru/dictionaries").then(
				getLabelsComplete,
				getLabelsError
			);

			function getLabelsComplete(response) {
                return response;
            }

            function getLabelsError(response) {
				return response;
			}
		}

		function getFilter(){
			return filter;
		}

		function setFilter(newFilter){
			filter = newFilter;
			//logger.info("Filter", JSON.stringify(filter));
		}

		function getBounds(){
			return bounds;
		}

		function setBounds(newBounds){
			bounds = newBounds;
			//logger.info("Bounds", JSON.stringify(bounds));
		}
	}

})();