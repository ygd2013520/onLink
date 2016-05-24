import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Common {
    constructor(private http: Http) {
    }

    getUserInfo() {
        return this.http.get('/api/user').map(response => response.json());
    }
}
