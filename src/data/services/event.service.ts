import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import { Event } from 'src/data/Model/Event';
import {EventWithUserObj} from 'src/data/Model/EventWithUserObj'
import { Location } from 'src/data/Model/Location'
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { EventRegistrationWithUser } from 'src/data/Model/EventRegistrationWithUser';



@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEventById(id: number) : Observable<Event>{
    return this.http.get<Event>(environment.apiUrl + '/api/event/' + id);
  }
  getAllEvents(getAll: boolean):Observable<EventWithUserObj[]>{
    return this.http.get<EventWithUserObj[]>(environment.apiUrl + '/api/events/'+getAll);
  }
  updateEventById(id: number, event: Event): Observable<any> {
    return this.http.put<Event>(environment.apiUrl + '/api/event/' + id, event);
  }

  getLocationByEventId(eventId: number): Observable<Location> {
    return this.http.get<Location>(environment.apiUrl + '/api/location/' + eventId);
  }

  updateLocationById(eventId: number, location: Location): Observable<any> {
    return this.http.put<Location>(environment.apiUrl + '/api/location/' + eventId, location);
  }

  getRegistrationsWithUsersByEventId(eventId: number): Observable<EventRegistrationWithUser[]> {
    return this.http.get<EventRegistrationWithUser[]>(environment.apiUrl + '/api/event/' + eventId + '/registrationData');
  }

  getRegistration(eventId: number, userId: string): Observable<EventRegistration> {
    return this.http.get<EventRegistration>(environment.apiUrl + '/api/event/' + eventId + '/registration/' + userId);
  }

  getRegistrationCount(eventId: number): Observable<number> {
    return this.http.get<number>(environment.apiUrl + '/api/event/' + eventId + '/registrationCount');
  }

  registerUserForEvent(eventId: number, userId: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/event/' + eventId + '/registerUser/' + userId, {});
  }

  removeRegisteredUser(eventId: number, userId: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/api/event/' + eventId + '/user/' + userId);
  }

  cancelRegistration(eventId: number, userId: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/api/event/' + eventId + '/cancelRegistration/' + userId)
  }

  getAllEventsByUser(userId: number) : Observable<EventWithUserObj[]>
  {
    return this.http.get<EventWithUserObj[]>(environment.apiUrl + '/api/events/createdEvents/' + userId);
  }

  getAllEventsWithUser():Observable<EventWithUserObj[]>{
    return this.http.get<EventWithUserObj[]>(environment.apiUrl + '/api/eventsUser');
  }

  getEventsAttendedByUser(userId: number) : Observable<Event[]>
  {
    return this.http.get<Event[]>(environment.apiUrl + '/api/events/attendedByUser/' + userId);
  }
  
 

  uploadImage(filename: string):Observable<any>
  { 
    return this.http.post<any>(environment.apiUrl + '/api/upload/',filename);
  }
}
