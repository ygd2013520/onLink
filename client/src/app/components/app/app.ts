import {Component} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {Config} from 'app/config';
import {TreeView} from '../tree-view/tree-view';
import {Home} from '../home/home';
import {Beef} from '../beef/beef';
import {Pork} from '../pork/pork';
import {Angular2Table} from '../angular2-table/angular2-table';
import {BootstrapComp} from '../bootstrap-comp/bootstrap-comp';

@Component({
  selector: 'app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES, TreeView],
  template: require('./app.html'),
  styles: [require('./app.css')]
})

@RouteConfig([
  {path: '/', component: Home, name: 'Home'},
  {path: '/beef', component: Beef, name: 'Beef'},
  {path: '/pork', component: Pork, name: 'Pork'},
  {path: '/angular2Table', component: Angular2Table, name: 'Angular2Table'},
  {path: '/bootstrapComp', component: BootstrapComp, name: 'BootstrapComp'}
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
