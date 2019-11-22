import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../Model/Feedback';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from 'src/data/Model/User';
import { UserToRegister } from '../Model/UserToRegister';
import {EventToCreate} from '../Model/EventToCreate';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  public getToken(): string {
    return localStorage.getItem('access_token');
  }

  public readToken(): any {
    const token = localStorage.getItem('access_token');
    return this.jwtHelper.decodeToken(token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('token exists');
      return true;
    }
    else {
      console.log('no token');
      return false;
    }
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/login', user);
  }

  register(user: UserToRegister): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/register', user);
  }

  resendVerificationEmail(user: User): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/resendVerificationEmail', user);
  }

  verifyUser(id: string, token: string): Observable<any> {
    let apiUrl: string = environment.apiUrl + '/api/verifyEmail/' + id + '/' + token;
    return this.http.post<any>(apiUrl, {});
  }

  logout(): void {
    localStorage.clear();
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/forgotPassword', { email: email });
  }

  resetPassword(id: string, token: string, password: string, password2: string): Observable<any> {
    let body = {
      password: password,
      password2: password2
    };
    let apiUrl: string = environment.apiUrl + '/api/resetPassword/' + id + '/' + token;
    return this.http.post<any>(apiUrl, body);
  }

  createEvent(eventToCreate: EventToCreate): Observable<any>{
    return this.http.post<any>(environment.apiUrl + '/api/createEvent', eventToCreate);
  }

  sendRespondEmail(id: number, userId: string, isApproved: boolean): Observable<any>{
    let body = {
      userId: userId,
      isApproved: isApproved
    };
    let apiUrl: string = environment.apiUrl + '/api/event/' + id;
    return this.http.post<any>(apiUrl, body);
  }
  createFeedback(feedback: Feedback):Observable<any>{
    return this.http.post<any>(environment.apiUrl + '/api/createFeedback', feedback);
  }
}
