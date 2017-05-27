import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import config from './app.config';
import home from './features/home';
import about from './features/about';

angular.module('exchange-ui-base', [uirouter, home, about])
    .config(config);

require('./components/navbar');
