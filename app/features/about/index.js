import './style.scss';

import angular from 'angular';
import uirouter from '@uirouter/angularjs';

import routing from './routes';
import AboutController from './about.controller';

export default angular.module('app.about', [uirouter])
  .config(routing)
  .controller('AboutController', AboutController)
  .name;
