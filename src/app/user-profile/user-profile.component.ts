import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { Event } from 'src/data/Model/Event';
import { UserService } from '../../data/services/user.service'
import { EventService } from '../../data/services/event.service'
import { AuthService } from 'src/data/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationError } from 'src/data/Model/ValidationError';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 
  private token: any;
  private userSubscription: any;
  private eventSubscription: any;
  currentUser: User = new User();
  validationErrors: ValidationError[];


  userSubmittedEvents: any[];
  attendedEvents: any[];

  successMessage: boolean;
  warning: String;
  updateUserMessageString: String;
  
  
  passwordSuccess : boolean;
  passwordValidation: ValidationError[];
  passwordWarning: String;

  password: string;
  password2: string;
  curPass: string;

  notifSuccess: boolean = false;
  notifsSuccessMessage: String;


  constructor(private auth: AuthService, private uService: UserService, private eService: EventService, private router: Router){

    this.token = this.auth.readToken();

   }
  ngOnInit() {
    this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((us) => {
      this.currentUser = us;
    });

      this.eService.getAllEventsByUser(this.token.userId).subscribe(data => {
        this.userSubmittedEvents = data;
      });
      this.eService.getEventsAttendedByUser(this.token.userId).subscribe(data => {
        this.attendedEvents = data;
      });
   }

  routeEvent(eventId: number): void {
    this.router.navigate([]).then(result => {  window.open('/event/'+eventId, '_blank'); });
  }

  ngOnDestroy(){ 
      if(this.userSubscription){this.userSubscription.unsubscribe();}
      if(this.eventSubscription){this.eventSubscription.unsubscribe();}
  }

  onSubmit(f: NgForm, prof: boolean): void {

    if(prof == true)
    {
    this.uService.updateUserInfo(this.currentUser).subscribe((successMessage) => {

      this.uService.getUserTokenById(this.currentUser.userId).subscribe((success) => {
         window.localStorage.setItem('access_token', success.token);
         this.token = this.auth.readToken();
        console.log("UP: "+JSON.stringify(this.token));
      });

      this.updateUserMessageString = successMessage;
      this.warning = null;
      this.successMessage = true;
      setTimeout(()=>{
        this.successMessage = false;
      },3500);
    }, (err) => {
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
        setTimeout(()=>{
          this.validationErrors = null;
        },3500);
      }
      else {
        this.warning = err.error.message;
        setTimeout(()=>{
          this.warning = "";
        },3500);
      }
    });
    
  }
  else
  {
    this.uService.updatePassword(this.currentUser, this.password, this.password2, this.curPass).subscribe((passwordSuccess) => {
      this.passwordWarning = null;
      this.passwordSuccess = true;
      setTimeout(()=>{
        this.passwordSuccess = false;
      },2500);
    }, (err) => {
      if (err.error.validationErrors) {
        this.passwordValidation = err.error.validationErrors;
        setTimeout(()=>{
          this.passwordValidation = null;
        },2500);
      }
      else {
        this.passwordWarning = err.error.message;
        setTimeout(()=>{
          this.passwordWarning = "";
        },2500);
      }
    });
  }
  }

  clickMethod() {
    if(confirm("Are you sure you want to delete your profile?")) {
      this.uService.deleteUser(this.token).subscribe( () =>
        {
          this.auth.logout();
          this.token = null;
          this.router.navigate(['/login']);
        });
    }
  }

  notifications(selection: any)
  {
      if(selection == true)
      {
            this.currentUser.notificationsOn = true;
            this.uService.updateUserInfo(this.currentUser).subscribe(() => {
              this.successMessage = true;
              this.updateUserMessageString = "Notifications turned on. Promise, we won't be annoying.";
              setTimeout(()=>{
                this.successMessage = false;
              },2500);
            });
      }
      else
      {
            this.currentUser.notificationsOn = false;
            this.uService.updateUserInfo(this.currentUser).subscribe(() => {
              this.successMessage = true;
              this.updateUserMessageString = "Notifications turned off."
              setTimeout(()=>{
                this.successMessage = false;
              },2500);
            });
      }
  }
 
}