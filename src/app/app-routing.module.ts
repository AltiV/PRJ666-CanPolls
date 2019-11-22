import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardAuthService } from 'src/data/services/guard-auth.service';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './event/event.component';
import { SubmittedEventComponent } from './submitted-event/submitted-event.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { OfficialEventComponent } from './official-event/official-event.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'events', component: EventComponent },
  { path: 'event/:id', component: SubmittedEventComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'createEvent', component: CreateEventComponent, canActivate: [GuardAuthService] },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'verifyEmail/:id/:token', component: VerifyEmailComponent },
  { path: 'officialEvent', component: OfficialEventComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'resetPassword/:id/:token', component: ResetPasswordComponent },
  { path: 'event/:id/edit', component: EditEventComponent, canActivate: [GuardAuthService] },
  { path: "", redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
