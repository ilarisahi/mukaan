import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    profile: any = {
        user_id: null,
        username: null,
        first_name: null,
        last_name: null,
        phone: null,
        group: null
    }

  constructor(private apiService: ApiService) { }

  ngOnInit() {
      this.apiService.getProfile()
          .subscribe(
          (data) => {
              console.log('user-data:' + data);
              this.profile = data;
          },
          (err) => {
              console.log('authorization error: ' + err);
          });
  }

  logout() {
      this.apiService.logout();
  }

  onProfileSubmit() {
      console.log(this.profile);
      this.apiService.updateProfile(this.profile);
  }
}
