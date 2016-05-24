import {Component} from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'about',
  template: require('app/components/about/about.html'),
  styles: [require('app/components/about/about.css')],
  providers: [],
  directives: [],
  pipes: []
})

export class About {

  constructor(http: Http) {

  }

  ngOnInit() {

  }
}
