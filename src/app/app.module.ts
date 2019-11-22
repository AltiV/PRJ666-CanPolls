import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EventComponent } from './event/event.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { SubmittedEventComponent } from './submitted-event/submitted-event.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InterceptTokenService } from 'src/data/services/intercept-token.service';
import { CreateEventComponent } from './create-event/create-event.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { OfficialEventComponent } from './official-event/official-event.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PartyFilterPipe} from './official-event/party-filter.pipe';
import { EditEventComponent } from './edit-event/edit-event.component'
import {ProvinceFilterPipe} from './official-event/province-filter.pipe';
import { AdminComponent } from './admin/admin.component';
import { FeedbackComponent } from './feedback/feedback.component'
import {MatDialogModule, MatButtonModule,MatFormFieldModule, MatInputModule,} from "@angular/material";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { DatePipe } from '@angular/common';

// retrieves the Json Web Token from local storage
export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    LoginComponent,
    RegisterComponent,
    EventComponent,
    PageNotFoundComponent,
    NavComponent,
    HomeComponent,
    ContentComponent,
    FooterComponent,
    SubmittedEventComponent,
    UserProfileComponent,
    CreateEventComponent,
    VerifyEmailComponent,
    OfficialEventComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PartyFilterPipe,
    EditEventComponent,
    ProvinceFilterPipe, 
    FeedbackComponent,
    ProvinceFilterPipe,
    AdminComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        authScheme: 'JWT'
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptTokenService,
      multi: true

    },
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FeedbackComponent
  ]
})
export class AppModule { }
