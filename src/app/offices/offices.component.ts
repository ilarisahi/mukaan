import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-offices',
    templateUrl: './offices.component.html',
    styleUrls: ['./offices.component.css']
})
export class OfficesComponent implements OnInit {
    officesArray: {}[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
      this.apiService.getTicketOffices()
          .subscribe(data => this.officesArray = data, err => console.log(err));
  }

}
