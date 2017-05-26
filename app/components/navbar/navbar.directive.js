import angular from 'angular';

function navbar() {
    return {
        restrict: 'E',
        scope: {
            name: '='
        },
        template: require('./navbar.html'),
        controller: ['$state', '$scope', ($state, $scope) => {
            $scope.$state = $state;
        }],
    }
}

export default angular.module('exchange-ui-base')
    .directive('navbar', navbar)
    .name;
