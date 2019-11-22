import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { User } from 'src/data/Model/User';
import { EventWithUserObj } from '../Model/EventWithUserObj';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }


  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/api/users');
  }

  updUserAccStatus(us : User) : Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/updateAccountStatus/' + us.userId, us);
  }

  approveEvent(id: number, event: EventWithUserObj): Observable<any> {
   //console.log("id ="+id+"\nevent: "+event);
    return this.http.put<any>(environment.apiUrl + '/api/updateEventStatus/' + id, event);
  }

  getAllUsersByParty(partyName: string): Observable<User[]> {
    console.log(partyName);
    return this.http.get<User[]>(environment.apiUrl + '/api/usersByParty/'+partyName);
  }

  updUserAffStatus(us : User) : Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/updateAffiliationStatus/' + us.userId, us);
  }

}
