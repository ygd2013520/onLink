import {Component} from '@angular/core';
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {DataTableDirectives} from 'angular2-datatable/datatable';

@Component({
    selector: 'my-app',
    template: require('./Pools.html'),
    providers: [HTTP_PROVIDERS],
    directives: [DataTableDirectives],
})
export class Pools {

    private data = {};

    constructor(private http:Http) {
        this.data = JSON.parse(require('./data.json'));
    }

    private sortByWordLength = (a:any) => {
        return a.name.length;
    }

}