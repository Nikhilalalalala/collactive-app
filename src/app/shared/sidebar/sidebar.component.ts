import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth/auth.service';
import { UserDataService } from '../../service/user-data/user-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser:any;
  currUserFullName:string;
  isDonor:boolean;
  
  constructor(
    public activeModal: NgbActiveModal,
    private auth: AuthService,
    private userDataService: UserDataService) { 
      
    }

  ngOnInit(): void {
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
         this.currentUser = user;
        }
        this.userDataService.getProfileImg(this.currentUser.uid).pipe().subscribe(url => {       
          this.showProfileImg(url);
        });
        this.userDataService.getUserDetails(this.currentUser.uid).then((res:any) => {
          var user = res.data()
          this.currUserFullName = user.firstName + " " + user.lastName;
          this.isDonor = user.isDonor;
        })
      });
  }

  close() {
    this.activeModal.close();
  }

  showProfileImg(url) {
    const frame = document.getElementById('frame');
    if (frame !== null) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
    }
  }

}
