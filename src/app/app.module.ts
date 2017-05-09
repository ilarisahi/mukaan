import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CoolStorageModule } from 'angular2-cool-storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgLoadingBarModule } from 'ng-loading-bar';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ApiService } from './api.service';
import { AuthGuardService } from './auth-guard.service';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';
import { SingleEventComponent } from './single-event/single-event.component';

const ROUTES = [
    {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'events/:id',
        canActivate: [AuthGuardService],
        component: SingleEventComponent
    },
    {
        path: 'profile',
        canActivate: [AuthGuardService],
        component: ProfileComponent
    }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EventsComponent,
    ProfileComponent,
    SingleEventComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
      CoolStorageModule,
      NgbModule.forRoot(),
      NgLoadingBarModule.forRoot()
  ],
  providers: [ApiService, AuthGuardService],
  bootstrap: [AppComponent]
})

export class AppModule { }
