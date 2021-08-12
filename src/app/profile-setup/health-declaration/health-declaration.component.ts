import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-health-declaration',
  templateUrl: './health-declaration.component.html',
  styleUrls: ['./health-declaration.component.css']
})
export class HealthDeclarationComponent implements OnInit {

  didNotCheckAllBoxesMessage = "";
  currentUser;
  
  constructor(
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,


  ) { 
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          console.log(user)
        } else {
          this.currentUser = ''
        }
      })

  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    var checkBoxes = document.getElementsByClassName("form-check-input");
    for (let i = 0; i < checkBoxes.length; i++) {
      const element = checkBoxes[i] as HTMLInputElement;
      if (!element.checked) {
        //trigger modal
        if (window.confirm("You did not check all boxes, would you like to proceed with the set up of a normal user")) {
          this.router.navigate(['child-profile-details']);
          this.userDataService.setIsDonor(this.currentUser.uid, {"isDonor": false});
        } else {
          this.didNotCheckAllBoxesMessage = "You did not check all boxes"
        }
        return;
      }
    }
    this.router.navigate(['profile-setup/lifestyle-information']);
  }

  

}
