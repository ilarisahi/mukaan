import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { ApiService } from './api.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    isLoggedIn: boolean;
    _loggedIn: any;

    constructor(private apiService: ApiService, private router: Router) {
        this.isLoggedIn = apiService.isLoggedIn();
        this._loggedIn = apiService.loggedIn.subscribe((value) => {
            this.isLoggedIn = value;
        });
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      console.log(route, state);
      if (this.isLoggedIn) {
          return true;
      };
      this.router.navigate(['/login']);
      return false;
  }

  ngOnDestroy() {
      this._loggedIn.unsubscribe();
  }
}

@Injectable()
export class AdminAuthGuardService implements CanActivate {
    isAdmin: boolean;
    _admin: any;

    constructor(private apiService: ApiService, private router: Router) {
        this.isAdmin = apiService.getUserGroup() === 'admin';
        this._admin = apiService.isGroup.subscribe((value) => {
            this.isAdmin = value === 'admin';
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.isAdmin) return true;
        this.router.navigate(['/login']);
        return false;
    }

    ngOnDestroy() {
        this._admin.unsubscribe();
    }
}

@Injectable()
export class EmployeeAuthGuardService implements CanActivate {
    isEmployee: boolean;
    _employee: any;

    constructor(private apiService: ApiService, private router: Router) {
        this.isEmployee = (apiService.getUserGroup() === 'admin' || apiService.getUserGroup() === 'employee') ? true :false;
        this._employee = apiService.isGroup.subscribe((value) => {
            this.isEmployee = (value === 'admin' || value === 'employee')?true:false;
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.isEmployee) return true;
        this.router.navigate(['/login']);
        return false;
    }

    ngOnDestroy() {
        this._employee.unsubscribe();
    }
}
