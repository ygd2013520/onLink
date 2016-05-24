import {Component} from '@angular/core';
import {Common} from '../../services/common'
import {Basic} from '../basic/basic'

@Component({
  selector: 'home',
  template: require('./home.html'),
  styles: [require('./home.css')],
  providers: [Common],
  directives: [Basic],
  pipes: []
})
export class Home {

  private user:Object;
  private value2:string = 'temp';

  constructor(private _common:Common) {
    this.user = {
      firstName: 'Guest'
    };
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this._common.getUserInfo()
      .subscribe(
        data => this.user = data,
        error => console.log(error)
      );
  }

}
