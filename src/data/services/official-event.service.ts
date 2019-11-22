import { Injectable } from '@angular/core';
import {OfficialEvent} from '../Model/OfficialEvent'
import {HttpClient,HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import {Observable, of, throwError} from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators';
import { provideRoutes } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class OfficialEventService {

  ofEvent : OfficialEvent[] 

  private apiURL = "http://myvmlab.senecacollege.ca:6738/api/officialEvent/";

  httpOptions = {
    headers: new HttpHeaders(
      {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*'
      }
    )
  }

  private handleError(error:HttpErrorResponse)
  {
    if(error.error instanceof ErrorEvent)
    {
      console.error('An error occuurred:', error.error.message);
    }else
    {
      console.error(
        `Backend returned code ${error.status},`+
        `body was: ${error.error}`
      );
    }
    return throwError(
      'something bad happened; please try again later.'
    );
  }
  getOfficialEvents():Observable<OfficialEvent[]>
  {
    
    return this.http.get<OfficialEvent[]>(this.apiURL).pipe(
      catchError(this.handleError)
    );
      
    
  }

  constructor(private http:HttpClient) { }
 

}

