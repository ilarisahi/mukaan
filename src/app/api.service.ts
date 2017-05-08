import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { NewUser } from './new-user.type';
import 'rxjs/add/operator/map';

//declare var atob: any;
//import '../base64.js';

@Injectable()
export class ApiService {
    localStorage: CoolLocalStorage;

    constructor(localStorage: CoolLocalStorage, private http: Http) {
        this.localStorage = localStorage;
    }

    saveToken(token: string) {
        console.log(token);
        localStorage.setItem('user-token', token);
    }

    getToken(): string {
        return localStorage.getItem('user-token');
    }

    logout() {
        localStorage.removeItem('user-token');
    }

    register(newUser: NewUser) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/register', newUser, options)
            .map(res => this.saveToken(res.json().token))
            .catch(this.handleError);
    }

    login(username, password) {
        console.log('logging in... ' + username + ' : ' + password);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/login', { username: username, password: password }, options)
            .map(res => this.saveToken(res.json().token))
            .catch(this.handleError);
    }

    isLoggedIn(): boolean {
        let token = this.getToken();
        let payload;

        if (token) {
            payload = token.split('.')[1];
            payload = atob(payload);
            console.log(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    currentUser(): Object {
        if (this.isLoggedIn()) {
            let token = this.getToken();
            let payload;
            payload = token.split('.')[1];
            payload = atob(payload);
            payload = JSON.parse(payload);

            return ({
                username: payload.username
            });
        } else {
            return null;
        }
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }

    getEvents() {
        console.log('getting events');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/events', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

}
