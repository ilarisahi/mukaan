import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MEvent } from '../mevent.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
    isLoggedIn: boolean;
    _loggedIn: any;
    constructor(private apiService: ApiService, private router: Router) { }

    eventsArray: MEvent[] = [];

    ngOnInit() {
        this.isLoggedIn = this.apiService.isLoggedIn();
        this._loggedIn = this.apiService.loggedIn.subscribe((value) => {
            this.isLoggedIn = value;
        });

        this.apiService.getEvents()
            .subscribe(data => this.eventsArray = data, error => console.log(error));
    }

    selectEvent(id: any) {
        this.router.navigate(['/events/' + id]);
    }

    ngOnDestroy() {
        this._loggedIn.unsubscribe();
    }
}
