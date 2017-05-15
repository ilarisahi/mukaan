import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
    stats: any[] = [];
    last_e_id: number = 0;
    last_index: number = 0;
    private _success = new Subject<string>();
    successMessage: string;
    private _error = new Subject<string>();
    errorMessage: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
      this._success.subscribe((message) => this.successMessage = message);
      this._success.debounceTime(5000).subscribe(() => this.successMessage = null);
      this.apiService.getStats()
          .subscribe(data => {
              for (let j = 0; j < data.length; j++) {
                  if (data[j].e_id === this.last_e_id) {
                      this.stats[this.last_index].events.push(
                          {
                              venue: data[j].venue,
                              capacity_1: data[j].capacity_1,
                              capacity_2: data[j].capacity_2,
                              capacity_3: data[j].capacity_3,
                              fee: data[j].fee,
                              starts: data[j].starts,
                              ends: data[j].ends,
                              class_1: data[j].class_1,
                              class_2: data[j].class_2,
                              class_3: data[j].class_3
                          }
                      );
                      this.stats[this.last_index].profit += data[j].class_1 * data[j].fee * 2.5 + data[j].class_2 * data[j].fee * 1.5 + data[j].class_1 * data[j].fee;
                      this.stats[this.last_index].potential += data[j].capacity_1 * data[j].fee * 2.5 + data[j].capacity_2 * data[j].fee * 1.5 + data[j].capacity_1 * data[j].fee;
                  } else {
                      this.last_index = this.stats.push({
                          e_id: data[j].e_id,
                          name: data[j].name,
                          description: data[j].description,
                          artists: (data[j].artists != null) ? data[j].artists.replace(/,/g, ", "): "",
                          cost: data[j].cost,
                          profit: data[j].class_1 * data[j].fee * 2.5 + data[j].class_2 * data[j].fee * 1.5 + data[j].class_1 * data[j].fee,
                          potential: data[j].capacity_1 * data[j].fee * 2.5 + data[j].capacity_2 * data[j].fee * 1.5 + data[j].capacity_1 * data[j].fee,
                          events: [
                              {
                                  venue: data[j].venue,
                                  capacity_1: data[j].capacity_1,
                                  capacity_2: data[j].capacity_2,
                                  capacity_3: data[j].capacity_3,
                                  fee: data[j].fee,
                                  starts: data[j].starts,
                                  ends: data[j].ends,
                                  class_1: data[j].class_1,
                                  class_2: data[j].class_2,
                                  class_3: data[j].class_3
                              }
                          ]
                      }) - 1;
                      this.last_e_id = data[j].e_id;
                  }
              }
              console.log(this.stats);
              console.log(data);
              this._success.next('Success');

          }, err => {
              this._error.next('Failed');
              console.log(err);
          });
  }

}
