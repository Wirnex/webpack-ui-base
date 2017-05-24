routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('about', {
      url: '/about',
      template: require('./index.html'),
      controller: 'AboutController',
      controllerAs: 'about'
    });
}
