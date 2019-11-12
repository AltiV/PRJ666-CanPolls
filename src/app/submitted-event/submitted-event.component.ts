import { Component, OnInit, EventEmitter } from '@angular/core';
import {Event} from '../../data/Model/Event';
import {User} from '../../data/Model/User';
import {Location} from '../../data/Model/Location';
import {EventService} from '../../data/services/event.service';
import {AuthService} from '../../data/services/auth.service';
import {UserService} from '../../data/services/user.service';
import {ActivatedRoute} from '@angular/router';
import { EventRegistration } from 'src/data/Model/EventRegistration';

@Component({
  selector: 'app-submitted-event',
  templateUrl: './submitted-event.component.html',
  styleUrls: ['./submitted-event.component.css']
})
export class SubmittedEventComponent implements OnInit {
  private paramSubscription: any;
  private eventSubscription: any;
  private userSubscription: any;
  private locationSubscription: any;
  private eventId: number;
  currentTime: Date;
  registration: EventRegistration;
  getRegistrationSubscription: any;
  getRegistrationCountSubscription: any;
  userCanRegister: boolean = false;
  registerUserSubscription: any;
  registrationSuccess: boolean = false;
  registrationFailure: string;
  currentEvent: Event;
  currentUser: User;
  currentLocation: Location;
  eventRegistrationCount: number;
  successMessage = false;  
  private token: any;
  constructor(
    private auth: AuthService,
    private eService: EventService,
    private uService: UserService,
    private route:ActivatedRoute
    ) { }

  ngOnInit() {
    this.token = this.auth.readToken();
    this.currentTime = new Date();
    this.paramSubscription = this.route.params.subscribe((param)=>{
      this.eventId = param['id'];
    });
    this.locationSubscription= this.eService.getLocationByEventId(this.eventId).subscribe((data)=>{
      this.currentLocation = data;
    }, (err)=>{
      console.log(err);
    });
    this.eventSubscription = this.eService.getEventById(this.eventId).subscribe((data)=>{
      this.currentEvent=data;
      if (this.auth.isAuthenticated()) {
        this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((data)=>{
          this.currentUser=data;
        });
        this.getRegistrationSubscription = this.eService.getRegistration(this.eventId, this.token.userId).subscribe((result) => {
          this.registration = result;
          this.getRegistrationCountSubscription = this.eService.getRegistrationCount(this.eventId).subscribe((result) => {
            this.eventRegistrationCount = result;
            let registrationDeadline: Date = new Date(this.currentEvent.date_from);
            registrationDeadline.setHours(registrationDeadline.getHours() - 12);
            this.userCanRegister = this.token.userId != this.currentEvent.UserUserId
              && this.currentTime < registrationDeadline
              && !this.registration;
            if (this.userCanRegister && this.currentEvent.attendee_limit != 0) {
              this.userCanRegister = this.eventRegistrationCount < this.currentEvent.attendee_limit;
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  registerUser(): void {
    this.registerUserSubscription = this.eService.registerUserForEvent(this.eventId, this.token.userId).subscribe((success) => {
      this.registrationSuccess = true;
      this.userCanRegister = false;
      setTimeout(() => this.registrationSuccess = false, 4000);
    }, (err) => {
      console.log(err);
      this.registrationFailure = err.message;
    })
  }

  approve(){
    this.auth.sendRespondEmail(this.currentEvent.event_id, this.currentUser.userId, true).subscribe((success)=>{
      this.successMessage = true;
    }, (err)=>{
      console.log(err);
    })
  }
  decline(){
    this.auth.sendRespondEmail(this.currentEvent.event_id, this.currentUser.userId, false).subscribe((success)=>{
      this.successMessage = true;
    }, (err)=>{
      console.log(err);
    })
  }
  ngOnDestroy(){
    if(this.paramSubscription){this.paramSubscription.unsubscribe();}
    if(this.eventSubscription){this.eventSubscription.unsubscribe();}
    if(this.userSubscription){this.userSubscription.unsubscribe();}
    if(this.locationSubscription){this.locationSubscription.unsubscribe();}
    if(this.getRegistrationSubscription){this.getRegistrationSubscription.unsubscribe();}
    if(this.getRegistrationCountSubscription){this.getRegistrationCountSubscription.unsubscribe();}
    if(this.registerUserSubscription){this.registerUserSubscription.unsubscribe();}
  }
}
