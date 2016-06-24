import {Component} from '@angular/core';
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {DataTableDirectives} from 'angular2-datatable/datatable';
import {TAB_DIRECTIVES} from 'ng2-bootstrap';

@Component({
    selector: 'my-app',
    template: require('./Disks.html'),
    providers: [HTTP_PROVIDERS,TAB_DIRECTIVES],
    directives: [DataTableDirectives],
})
export class Disks {

    private data = {};

    constructor(private http:Http) {
        this.data = JSON.parse(require('./data.json'));
    }

    private sortByWordLength = (a:any) => {
        return a.name.length;
    }

}