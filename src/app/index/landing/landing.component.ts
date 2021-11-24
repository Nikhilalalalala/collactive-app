import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {


  promptEvent: any;
  showButton = false;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) { 
    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) { this.router.navigate(['/home']);}
    })
    window.addEventListener('beforeinstallprompt', event => {
      console.log(event)
      this.promptEvent = event;
    });
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['/login']);
  }

  onAddToScreenButtonClick() {
    this.promptEvent.prompt();
  }

}
