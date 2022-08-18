import { UserLoginResponse } from './../../models/userLoginResponse';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/storage/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { UserForLogin } from '../../models/userForLogin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiControllerUrl: string = `${environment.apiUrl}/auth`;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelperService: JwtHelperService,
    private router:Router
  ) {}


  login(userForLoginModel: UserForLogin): Observable<UserLoginResponse> {
    //# EventEmitter: child componnetten parent'e event göndermek için kullanılır.

    //# Subject
    const subject = new Subject <UserLoginResponse>();
    //subject ile subscribe olunduktan sonra eventleri yakalayabiliriz.

    this.httpClient.post<UserLoginResponse>(
      this.apiControllerUrl + '/login',
      userForLoginModel
    ).subscribe(response =>{
      if(!response.success) return;
      this.saveToken(response);
      subject.next(response); // bu noktada haberdar olmak istiyorum. O anki değere ihtiyacım yok, bu yüzden Subject daha uygundur.
    });
    return subject.asObservable();
  }

  saveToken(userLoginResponse: UserLoginResponse) {
    this.localStorageService.set('token', userLoginResponse.access_token);
  }

  get isAuthenticated(): boolean{
    if(this.jwtHelperService.isTokenExpired()) return false;

    return true;
  }

  logOut(){
    this.localStorageService.remove('token');
    this.router.navigateByUrl('/login');
  }
}
