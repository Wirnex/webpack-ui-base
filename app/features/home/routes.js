routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: require('./index.html'),
      controller: 'HomeController',
      controllerAs: 'home'
    });
}
