﻿import { RouterModule } from '@angular/router';
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
import { AuthGuardService, AdminAuthGuardService, EmployeeAuthGuardService } from './auth-guard.service';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { OfficesComponent } from './offices/offices.component';
import { AdminComponent } from './admin/admin.component';
import { PaginationPipe } from './pagination.pipe';
import { SearchPipe } from './search.pipe';
import { StatsComponent } from './stats/stats.component';

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
    },
    {
        path: 'ticket-offices',
        component: OfficesComponent
    },
    {
        path: 'admin',
        canActivate: [AdminAuthGuardService],
        component: AdminComponent
    },
    {
        path: 'stats',
        canActivate: [EmployeeAuthGuardService],
        component: StatsComponent
    },
    {
        path: '**',
        redirectTo: 'profile'
    }      
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EventsComponent,
    ProfileComponent,
    SingleEventComponent,
    OfficesComponent,
    AdminComponent,
    PaginationPipe,
    SearchPipe,
    StatsComponent
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
  providers: [ApiService, AuthGuardService, AdminAuthGuardService, EmployeeAuthGuardService],
  bootstrap: [AppComponent]
})

export class AppModule { }
