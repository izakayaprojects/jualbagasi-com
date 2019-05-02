import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserAuthService } from './user-auth.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
	
	constructor(
		private auth: UserAuthService,
		private router: Router,
		private localStorage: LocalStorageService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.auth.check_token().pipe(map(result => {
			if (!result) {
				// Remove token
				this.router.navigate(["/login"]);
			}
			return result;
		}))
	}
}

