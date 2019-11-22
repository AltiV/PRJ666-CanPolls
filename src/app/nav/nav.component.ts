import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  private UserIsAdmin: boolean = false;
  private navSubs: any;

  constructor(
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    console.log("home called");
    this.navSubs = this.router.events.subscribe((event: Event) => {
     
      if (event instanceof NavigationStart)
      {
        this.token = this.auth.readToken();
        if(this.token!= null && this.token.isAdmin == true)
        {
          //console.log("Admin: "+this.token.isAdmin);  
          this.UserIsAdmin=true;
          
        }
      }
    });
  }

  logout(): void {

    this.token = null;
    this.UserIsAdmin=false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy()
  {
    this.navSubs.unsubscribe();
  }

}
/**
 *       


      
 */