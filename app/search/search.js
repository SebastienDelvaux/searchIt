'use strict';

angular.module('myApp.search',
    ['ngRoute',
    'ui.bootstrap',
    'uiGmapgoogle-maps'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl'
  });
}])

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})

.controller('SearchCtrl', ['$scope', '$http', 'maxResults', 'defaultZoom', function($scope, $http, maxResults, defaultZoom) {
    $scope.map = { zoom: defaultZoom };
    $scope.getCountries = function getCountries(val) {
        return $http.get('https://restcountries.eu/rest/v1/name/' + val).then(
            function(response){
                var countries = response.data.filter(function(country) {
                    return country.name.search(new RegExp(val, "i")) === 0;
                });
                $scope.serverError = false;
                if(countries.length > maxResults) {
                    countries.length = maxResults;
                }
                return countries.map(function(country){
                    return {
                        name: country.name,
                        coordinates: {
                            //object to work with angular-google-maps
                            latitude: country.latlng[0],
                            longitude: country.latlng[1]
                        }};
                });
            },
            function(error) {
                console.log("Error while fetching countries");
                $scope.serverError = true;
            });
    };

    $scope.countrySelected = function countrySelected($item, $model, $label, $event) {
        console.log("country selected", $item);
        $scope.map.center = $item.coordinates;
        console.log("Google Maps coordinates", $scope.map);
    };
}]);
