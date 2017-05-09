import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MEvent } from '../mevent.type';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent implements OnInit {
    event: MEvent = {
        id: null,
        name: '',
        description: '',
        fee: '',
        artist: '',
        venue: '',
        starts: null,
        ends: null
    }

    tickets: any = {
        event_id: null,
        class_1: 0,
        class_2: 0,
        class_3: 0
    }

    eventID: any;

    constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {
        
    }

    ngOnInit() {
        this.eventID = this.route.snapshot.params['id'];
        this.getEvent(this.eventID);
    }

    getEvent(id: any) {
        this.apiService.getEvent(id)
            .subscribe(
            (data) => {
                console.log('event-data:' + data);
                this.event = data;
                this.tickets.event_id = data.id;
            },
            (err) => {
                console.log('error: ' + err);
            });
    }

    onTicketsSubmit() {
        this.apiService.buyTickets(this.tickets);
    }
}
