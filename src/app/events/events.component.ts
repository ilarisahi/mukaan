import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MEvent } from '../mevent.type';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    eventsArray: MEvent[] = [];

    ngOnInit() {
        this.apiService.getEvents()
            .subscribe(data => this.eventsArray = data, error => console.log(error));
    }

}
