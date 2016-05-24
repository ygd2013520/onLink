import {Component} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {Config} from './config';
import {TreeView} from './components/tree-view/tree-view';
import {Home} from './components/home/home';
import {Beef} from './components/beef/beef';
import {Pork} from './components/pork/pork';

@Component({
  selector: 'app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES, TreeView],
  template: require('./app.html'),
})

@RouteConfig([
  {path: '/', component: Home, name: 'Home', useAsDefault: true},
  {path: '/beef', component: Beef, name: 'Beef'},
  {path: '/pork', component: Pork, name: 'Pork'}
])

export class App {
  private node:Object;
  config:Config = new Config();

  constructor(private router:Router) {
  }

  ngOnInit() {
    this.node = this.config.pluginTree();
  }

}
