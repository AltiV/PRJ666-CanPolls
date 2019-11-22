import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import { EventService } from 'src/data/services/event.service';
import { Event } from 'src/data/Model/Event';
import { Location } from 'src/data/Model/Location'
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { EventRegistrationWithUser } from 'src/data/Model/EventRegistrationWithUser';
import { User } from 'src/data/Model/User';
import { ValidationError } from 'src/data/Model/ValidationError';
import {HttpClient} from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

class ImageSnippet{
  constructor(public src: String, public file: File){}
}
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  private token: any;
  userCanEdit: boolean;
  loading: boolean = true;
  eventId: number;
  event: Event = new Event();
  location: Location;
  registrations: EventRegistrationWithUser[];
  filteredRegistrations: EventRegistrationWithUser[];
  registeredCount: number;
  paramSubscription: any;
  getEventSubscription: any;
  updateEventSubscription: any;
  getLocationSubscription: any;
  updateLocationSubscription: any;
  getRegistrationsSubscription: any;
  removeUserSubscription: any;
  validationErrors: ValidationError[];
  successMessage: string;
  warning: string;
  removeUserSuccess: string;
  removeUserWarning: string;

  userFilters = [
    {key: 'partyAffiliation', value: 'Unaffiliated', filtering: false},
    {key: 'partyAffiliation', value: 'Liberal', filtering: false},
    {key: 'partyAffiliation', value: 'Conservative', filtering: false},
    {key: 'partyAffiliation', value: 'NDP', filtering: false},
    {key: 'partyAffiliation', value: 'Green', filtering: false},
    {key: 'partyAffiliation', value: 'Bloc Quebecois', filtering: false}
  ];
  registrationFilters = [
    {key: 'status', value: 'registered', filtering: true},
    {key: 'status', value: 'cancelled', filtering: false},
    {key: 'status', value: 'removed', filtering: false}
  ]

  selectedFile: ImageSnippet;
  sfile : File = null;

  imageToShow:any;

  selectedF: File =null;
  fd =new FormData();

  fullImageName :string="";


  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private eventService: EventService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.token = this.auth.readToken();
    this.paramSubscription = this.route.params.subscribe((params) => {
      this.eventId = params['id'];
    }, (err) => {
      console.log('Unable to get route parameters', err);
    });
    this.getEventSubscription = this.eventService.getEventById(this.eventId).subscribe((result) => {
      let now = new Date();
      let eventStartTime = new Date(result.date_from);
      this.userCanEdit = (this.token.userId == result.UserUserId && now < eventStartTime);
      this.event = result;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log('Unable to get event', err);
    });
    this.getLocationSubscription = this.eventService.getLocationByEventId(this.eventId).subscribe((result) => {
      this.location = result;
    }, (err) => {
      console.log('Unable to get location', err);
    });
    this.getRegistrationsSubscription = this.eventService.getRegistrationsWithUsersByEventId(this.eventId).subscribe((results) => {
      this.registrations = results;
      this.filteredRegistrations = this.registrations.filter((reg) => reg.status == 'registered');
      this.registeredCount = this.filteredRegistrations.length;
    }, (err) => {
      console.log('Unable to get registrations', err);
    });
  }

  getFilterCount(filterKey: string, filtervalue: any, onUser: boolean): number {
    if (onUser) {
      return this.registrations.filter((reg) => reg.User[filterKey] == filtervalue).length;
    }
    return this.registrations.filter((reg) => reg[filterKey] == filtervalue).length;
  }

  applyFilters(): void {
    this.filteredRegistrations = this.registrations.filter((reg) => {
      let atLeast1Filter: boolean = false;
      for (let filter of this.userFilters) {
        if (filter.filtering) {
          atLeast1Filter = true;
          if (reg.User[filter.key] == filter.value) {
            return true;
          }
        }
      }
      if (!atLeast1Filter) {
        return true;
      }
      return false;
    }).filter((reg) => {
      let atLeast1Filter: boolean = false;
      for (let filter of this.registrationFilters) {
        if (filter.filtering) {
          atLeast1Filter = true;
          if (reg[filter.key] == filter.value) {
            return true;
          }
        }
      }
      if (!atLeast1Filter) {
        return true;
      }
      return false;
    });
  }

  onEventSubmit(f: NgForm): void {
    this.validationErrors = [];
    this.http.post(environment.apiUrl + "/api/upload", this.fd)
    .subscribe( result => {
   // console.log(result)
    });
    this.event.photo = this.fullImageName;
    this.updateEventSubscription = this.eventService.updateEventById(this.eventId, this.event).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to update event', err);
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
    });
  }

  onLocationSubmit(f: NgForm): void {
    this.validationErrors = [];
    this.updateLocationSubscription = this.eventService.updateLocationById(this.eventId, this.location).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to update event', err);
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
    });
  }

  removeRegisteredUser(userId: number, idx: number): void {
    this.removeUserSubscription = this.eventService.removeRegisteredUser(this.eventId, userId).subscribe((success) => {
      let reg = this.registrations[idx];
      reg.status = 'removed';
      this.registrations[idx] = reg;
      this.removeUserSuccess = success.message;
      setTimeout(() => this.removeUserSuccess = null, 4000);
    }, (err) => {
      console.log('Unable to remove user', err);
      this.removeUserWarning = err.message;
    });
  }

   //SENDING THE IMAGE TO THE API
   onImageAdd(event)
   {
     const file: File = <File>event.target.files[0];
     this.sfile = file;
     const reader = new FileReader();
     reader.addEventListener('load', (event:any) =>{
       this.selectedFile = new ImageSnippet(event.target.result, file);
     });
     reader.readAsDataURL(file);
     
     this.selectedF = <File>event.target.files[0];
     var fileName = this.selectedF.name;
     fileName = fileName.substring(fileName.lastIndexOf('.'));
     this.fullImageName = "Event"+this.token.userId+fileName;
     this.fd.append('file', this.selectedF, this.fullImageName);
   }


  ngOnDestroy() {
    if (this.paramSubscription)
      this.paramSubscription.unsubscribe();
    if (this.getEventSubscription)
      this.getEventSubscription.unsubscribe();
    if (this.updateEventSubscription)
      this.updateEventSubscription.unsubscribe();
    if (this.getLocationSubscription)
      this.getLocationSubscription.unsubscribe();
    if (this.updateLocationSubscription)
      this.updateLocationSubscription.unsubscribe();
    if (this.getRegistrationsSubscription)
      this.getRegistrationsSubscription.unsubscribe();
    if (this.removeUserSubscription)
      this.removeUserSubscription.unsubscribe();
  }
}
