import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    isLoggedIn: boolean;
    _loggedIn: any;
    constructor(private apiService: ApiService) {
        this.isLoggedIn = apiService.isLoggedIn();
        this._loggedIn = apiService.loggedIn.subscribe((value) => {
            this.isLoggedIn = value;
        });
    }
    title = 'Mukaan!';

    ngOnDestroy() {
        this._loggedIn.unsubscribe();
    }
}
