import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CoolStorageModule } from 'angular2-cool-storage';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ApiService} from './api.service';
import { EventsComponent } from './events/events.component';

const ROUTES = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'events',
        component: EventsComponent
    }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    CoolStorageModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})

export class AppModule { }
