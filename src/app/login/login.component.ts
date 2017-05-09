import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NewUser } from '../new-user.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    login = {
        username: '',
        password: ''
    }

    register: NewUser = {
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: ''
    };

    onLoginSubmit() {
        console.log('logging in ' + this.login);
        this.apiService.login(this.login.username, this.login.password); 
    }

    onRegisterSubmit() {
        console.log('registering new user');
        this.apiService.register(this.register);
    }

}
