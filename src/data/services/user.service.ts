import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { User } from 'src/data/Model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: string) : Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/users/' + id);
  }

  getUserTokenById(id: string) : Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/userToken/' + id);
  }

  findUserByUsername(userN: string)
  {
    return this.http.get<User>(environment.apiUrl + '/api/users/' + userN);
  }

  updateUserInfo(us : User) : Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/updateUser/' + us.userId, us);
  }

  updatePassword(us: User, password: string, password2: string, oldPass: string) : Observable<any> {
    let body = {
      curPass: oldPass,
      currentUser: us,
      password: password,
      password2: password2
    };
    return this.http.put<any>(environment.apiUrl + '/api/updatePassword/' + us.userId, body);
  }

  deleteUser(user: User) : Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/deleteUser/' + user.userId, user);
  }

}
