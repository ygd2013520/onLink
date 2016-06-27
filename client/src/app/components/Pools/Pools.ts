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
        console.log('test http get');
        http.get('http://localhost:3000/api/pools/scan')
            .map(res => res.json())
            .subscribe(
                data => this.data = data,
            () => console.log('Complete')
        );
    }

    private sortByWordLength = (a:any) => {
        return a.name.length;
    }

}