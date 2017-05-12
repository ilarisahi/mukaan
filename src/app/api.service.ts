import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { NewUser } from './new-user.type';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {Router} from '@angular/router'

//declare var atob: any;
//import '../base64.js';

@Injectable()
export class ApiService {
    localStorage: CoolLocalStorage;
    loggedIn: Subject<boolean> = new Subject<boolean>();
    isGroup: Subject<string> = new Subject<string>();
    events: any;

    constructor(localStorage: CoolLocalStorage, private http: Http, private router: Router) {
        this.localStorage = localStorage;
        this.loggedIn.next(this.isLoggedIn());
        this.isGroup.next(this.getUserGroup());
    }

    saveToken(token: string) {
        console.log(token);
        localStorage.setItem('user-token', token);
        this.isGroup.next(this.getUserGroup());
        this.loggedIn.next(true);        
    }

    getToken(): string {
        return localStorage.getItem('user-token');
    }

    logout() {
        localStorage.removeItem('user-token');
        this.loggedIn.next(false);
        this.isGroup.next(null);
        this.router.navigate(['/login']);
    }

    getUserGroup() {
        let user: any;
        user = this.currentUser();
        if (user != null) {
            return user.group;
        }
    }

    register(newUser: NewUser) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/register', newUser, options)
            .map(res => res.json())
            .subscribe(
            (data) => {
                this.saveToken(data.token);
                this.router.navigate(['/profile']);
            },
            (err) => console.log('login error: ' + err));
    }

    login(username, password) {
        console.log('logging in... ' + username + ' : ' + password);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/login', { username: username, password: password }, options)
            .map(res => res.json())
            .subscribe(
                (data) => {
                    this.saveToken(data.token);
                    this.router.navigate(['/profile']);
                },
                (err) => console.log('login error: ' + err));
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
                user_id: payload.id,
                first_name: payload.first_name,
                last_name: payload.last_name,
                phone: payload.phone,
                group: payload.group
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

    postEvents(obj: any) {
        console.log('posting event');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/events', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putEvents(obj: any) {
        console.log('putting event');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/events', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteEvents(id: any) {
        console.log('deleting event');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/events/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getEventsAdmin() {
        console.log('getting events for admin');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/events-admin', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getTickets() {
        console.log('getting tickets');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/tickets', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postTickets(obj: any) {
        console.log('posting ticket');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/tickets', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putTickets(obj: any) {
        console.log('putting ticket');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/tickets', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteTickets(id: any) {
        console.log('deleting ticket');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/tickets/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getArtists() {

        console.log('getting artists');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/artists', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postArtists(obj: any) {
        console.log('posting artist');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/artists', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putArtists(obj: any) {
        console.log('putting artist');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/artists', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteArtists(id: any) {
        console.log('deleting artist');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/artists/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getClients() {

        console.log('getting clients');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/clients', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postClients(obj: any) {
        console.log('posting client');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/clients', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putClients(obj: any) {
        console.log('putting client');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/clients', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteClients(id: any) {
        console.log('deleting client');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/clients/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getOrganisers() {

        console.log('getting organisers');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/organisers', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postOrganisers(obj: any) {
        console.log('posting organiser');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/organisers', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putOrganisers(obj: any) {
        console.log('putting organiser');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/organisers', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteOrganisers(id: any) {
        console.log('deleting organiser');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/organisers/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getTicketOffices() {
        console.log('getting ticket offices');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/ticket-offices', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postTicketOffices(obj: any) {
        console.log('posting ticket office');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/ticket-offices', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putTicketOffices(obj: any) {
        console.log('putting ticket office');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/ticket-offices', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteTicketOffices(id: any) {
        console.log('deleting ticket office');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/ticket-offices/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getVenues() {
        console.log('getting venues');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/venues', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postVenues(obj: any) {
        console.log('posting venue:');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/venues', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putVenues(obj: any) {
        console.log('putting venues');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/venues', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteVenues(id: any) {
        console.log('deleting venues');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/venues/'+id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getEventsMain() {
        console.log('getting main events');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/events-main', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    postEventsMain(obj: any) {
        console.log('posting venue:');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/events-main', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    putEventsMain(obj: any) {
        console.log('putting venues');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('/api/events-main', obj, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteEventsMain(id: any) {
        console.log('deleting venues');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('/api/events-main/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getEvent(id: any) {
        console.log('getting event ' + id);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/events/' + id, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getProfile() {
        console.log('getting profile');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('/api/profile', options)
            .map(res => res.json());
    }

    getClientEvents() {
        console.log('getting client events');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('api/profile/events', options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    updateProfile(profile: any) {
        console.log('updating profile');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        this.http.put('/api/profile', profile, options)
            .map(res => res.json())
            .subscribe(
            (data) => {
                  this.saveToken(data.token);
                  this.router.navigate(['/profile']);
              },
              (err) => console.log('login error: ' + err));
    }

    buyTickets(transaction: any) {
        console.log('buying tickets');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        this.http.post('/api/events/' + transaction.event_id, transaction, options)
            .map(res => res.json())
            .subscribe(
            (data) => {
                console.log('success: ' + data);
            },
            (err) => console.log('login error: ' + err));
    }

    getStats() {
        console.log('getting stats');
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('api/stats', options)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
