(function(){
    'use strict';

	angular
		.module('app.map')
		.controller('Display', Display);

    Display.$inject = ['$scope', 'dataservice', 'logger'];

	function Display($scope, dataservice, logger){
        L.Icon.Default.imagePath = 'img'
		var vm = this;
        vm.map = undefined;
        vm.markers = undefined;
        vm.title = 'Job Markers';
        vm.vacancies = [];
        vm.moveEnd = moveEnd;
        vm.vacanciesRequest = null;

        activate();

        $scope.$on('updateMap', function(event) {
            vm.moveEnd();
        });

        function activate(){
            configure();
            logger.info("Map:", "Map activated");
            moveEnd();
        }

        function configure(){
            /*jshint validthis: true */
            vm.map = L.map('map').setView([53.907574,27.563224], 15);
            L.Icon.Default.imagePath = '/img';

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWxleGFuZGVybWlyb25jaGVua28iLCJhIjoiY2luNjM5aXI5MDB3dHY5bHlrdTF1MHE0diJ9.bLRGkovuIUa1BQgH3GwtCQ', 
                {
                    maxZoom: 18,
                    id: 'mapbox.streets'
                }
            ).addTo(vm.map);

            vm.markers = new L.MarkerClusterGroup();
            vm.map.addLayer(vm.markers);
            vm.map.on('moveend', moveEnd);
        }

        function moveEnd(){
            dataservice.setBounds(getBounds());
            getMarkers().then(displayMarkers);
        }

        function getMarkers(){
            // abort pending request
            vm.vacanciesRequest && vm.vacanciesRequest.abort();

            // start a new request
        	return (vm.vacanciesRequest = dataservice.getMarkers()).then(
                function(response) {
                    if(response.data)
                        return (response.data.items);
                    else
                        return null;
                },
                function(error) {
                    logger.warning("getMarkers" , "Get markers error");
                }
            );
        }

        function getBounds(){
            if(typeof vm.map != 'undefined' && vm.map != null){
                return vm.map.getBounds();
            }
        }

        function displayMarkers(items){
            vm.markers.clearLayers();
            if(items){
                vm.vacancies = items;
                
                for (var i = 0; i < vm.vacancies.length; i++){
                    var lat = vm.vacancies[i].address.lat;
                    var lng = vm.vacancies[i].address.lng;
                    var title = "<b>" + vm.vacancies[i].employer.name + 
                        "</b><br />" + vm.vacancies[i].name;
                    if(lat != null && lng != null){
                        var marker = L.marker(new L.LatLng(lat, lng), {
                            title: 
                                vm.vacancies[i].employer.name + 
                                " | " + vm.vacancies[i].name
                        });
                        marker.bindPopup(title);
                        vm.markers.addLayer(marker);
                    }
                }
            }
        }

	}
})();