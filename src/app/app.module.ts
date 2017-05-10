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
import { AuthGuardService, AdminAuthGuardService, EmployeeAuthGuardService } from './auth-guard.service';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { OfficesComponent } from './offices/offices.component';
import { AdminComponent } from './admin/admin.component';
import { PaginationPipe } from './pagination.pipe';

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
    PaginationPipe
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
