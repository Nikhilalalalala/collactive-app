import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  // Current user info
  currentUser;
  firstName;
  lastName;
  isDonor: boolean;
  donorForm;

  // Basic details
  model: NgbDateStruct;
  dateOfBirth;
  dobString;
  areaOfResidency;
  areasOptions = ["North", "East", "West", "South", "Central"];
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  lifestyleInfoForm;
  dietaryRestrictions;
  allergens = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  currentChildID
  childrenProfiles = [];
  childProfileForm;

  constructor(public configDatePicker: NgbInputDatepickerConfig,
    public calendarDatePicker: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private userDataService: UserDataService,
    private auth: AuthService
  ) { 
    this.donorForm = this.formBuilder.group({
      isDonor: new FormControl(true, Validators.required),
    });

    this.lifestyleInfoForm = this.formBuilder.group({
      isSmoker: new FormControl(true, Validators.required),
      isDrinker: new FormControl(true, Validators.required),
      isCaffeineConsumer: new FormControl(true, Validators.required),
    });

    this.childProfileForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required)
    });

    // setting datepicker popup to close only on click outside
    configDatePicker.autoClose = 'outside';
    this.auth.getUserAuthState()
    .onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;

        this.userDataService.getProfileImg(this.currentUser.uid).subscribe((url) => {
          this.showProfileImg(url);
        }, err => {});

        this.userDataService.getUserDoc(this.currentUser.uid).subscribe(userDoc => {
          this.isDonor = userDoc['isDonor'];
          this.donorForm = this.formBuilder.group({
            isDonor: new FormControl(userDoc['isDonor'], Validators.required),
          });

          this.firstName = userDoc['firstName'];
          this.lastName = userDoc['lastName'];
          
          if (userDoc['dateOfBirth'] !== undefined) {
            this.dobString = userDoc['dateOfBirth'];
            let dobArr = this.dobString.split('-');
            this.dateOfBirth = {
              day: parseInt(dobArr[0]),
              month: parseInt(dobArr[1]),
              year: parseInt(dobArr[2]),
            }
          }
          if (userDoc['areaOfResidency'] !== undefined) {
            this.areaOfResidency = this.areasOptions.indexOf(userDoc['areaOfResidency']) >= 0
              ? this.areasOptions.indexOf(userDoc['areaOfResidency']) 
              : 0;
          }
          if (userDoc['lifestyle-info'] !== undefined) {
            this.lifestyleInfoForm = this.formBuilder.group({
              isSmoker: new FormControl(userDoc['lifestyle-info']['isSmoker'], Validators.required),
              isDrinker: new FormControl(userDoc['lifestyle-info']['isDrinker'], Validators.required),
              isCaffeineConsumer: new FormControl(userDoc['lifestyle-info']['isCaffeineConsumer'], Validators.required),
            });
          }
          if (userDoc['dietary-restrictions'] !== undefined) {
            this.dietaryRestrictions = userDoc['dietary-restrictions'];
          }

          this.childrenProfiles = [];
          this.userDataService.getChildren(this.currentUser.uid).then(collection => {
            collection.docs.forEach(docu => this.childrenProfiles.push(docu.data()))
          });

        })

      } else {
        this.currentUser = ''
      }
    });
}

  ngOnInit(): void {
  }


  // get DateOfBirth() { return this.basicDetailsForm.get('dateOfBirth') }

  onDoneButtonClick() {
    let dobStr = `${this.dateOfBirth.day}-${this.dateOfBirth.month}-${this.dateOfBirth.year}`;
    this.userDataService.updateUserDoc(this.currentUser.uid, {
      'dateOfBirth' : dobStr,
      'areaOfResidency' : this.areasOptions[this.areaOfResidency],
      'dietary-restrictions': this.dietaryRestrictions,
      'lifestyle-info': this.lifestyleInfoForm.value,
      'isDonor': this.donorForm.value["isDonor"]
    });
  }

  onPrevButtonClick() {
    this.onDoneButtonClick();
    this.router.navigate(['home']);
  }

  onImgSelected(e) {
    let selectedFile = e.target.files[0];
    if (selectedFile.size > 5200000) {
      window.prompt("The image uploaded has a very high resolution. Please choose an image that is less than 5MB");
    } else {
      this.userDataService.uploadProfileImg(this.currentUser.uid, selectedFile).then(() => {
        const url = URL.createObjectURL(selectedFile);
        this.showProfileImg(url);
      }).catch(err => {
        window.prompt("We are unable to upload your picture right now. Please try again later.");
      })
    }
  }

  showProfileImg(url) {
    const frame = document.getElementById('frame');
    if (frame !== null) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
      document.getElementById('plus-icon').style.display = 'none';
    }
  }

  // Children settings

  addChild() {
    // reset form and childID
    this.currentChildID = undefined;
    this.childProfileForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required)
    });
    this.allergens = [
      {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
      {name:"Eggs", checked: false},
      {name:"Cow’s milk", checked: false},
      {name:"Peanuts and other tree nuts", checked: false},
      {name:"Grains such as wheat, oat, and barley", checked: false},
      {name:"Soy", checked: false},
      {name:"Fish", checked: false},
    ]
  }

  get name() { return this.childProfileForm.get('name'); }
  get childDateOfBirth() { return this.childProfileForm.get('dateOfBirth'); }
  get gender() { return this.childProfileForm.get('gender'); }

  correctFields() {
    if (this.name.invalid) {
      window.alert("Please input your child's name.");
      document.getElementById("name").style.borderColor = "red";
      return false;
    } else if (this.dateOfBirth.invalid) {
      window.alert("Please input your child's date of birth.");
      document.getElementById("childDateOfBirth").style.borderColor = "red";
      return false;
    } else if (this.gender.invalid) {
      window.alert("Please input your child's gender");
      document.getElementById("gender").style.borderColor = "red";
      return false;
    } else {
      return true;
    }
  }

  saveChild() {
    if (!this.correctFields()) {
      return false;
    }

    let childProfile = {
      "name": this.childProfileForm.controls.name.value,
      "dateOfBirth": this.childProfileForm.controls.dateOfBirth.value, 
      "gender": this.childProfileForm.controls.gender.value,
      "allergies": this.allergens
    }
    
    if (this.currentChildID === undefined) {
      this.userDataService.addNewChildProfile(this.currentUser.uid, childProfile);
    } else {
      childProfile["childID"] = this.currentChildID;
      this.userDataService.updateChildProfile(this.currentUser.uid, this.currentChildID, childProfile);
    }
    this.updateExistingChildren();
    this.addChild();
    return true;
  }

  selectChildProfile(childID: String) {
    if (childID === undefined) {
      window.location.reload();
    }
    this.userDataService.getChildProfile(this.currentUser.uid, childID).subscribe(
      doc => {
        let currentChild = doc.data();
        this.childProfileForm.controls.name.setValue(currentChild["name"]);
        this.childProfileForm.controls.dateOfBirth.setValue(currentChild["dateOfBirth"]);
        this.childProfileForm.controls.gender.setValue(currentChild["gender"]);
        this.allergens = currentChild["allergies"];
        this.currentChildID = childID;
      } 
    );
  }

  updateExistingChildren() {
    this.childrenProfiles = [];
    this.userDataService.getChildren(this.currentUser.uid).then(collection => {
      collection.docs.forEach(doc => this.childrenProfiles.push(doc.data()))
    });
  }

  deleteChildProfile(childID: String) {
    this.userDataService.deleteChildProfile(this.currentUser.uid, childID);
    this.updateExistingChildren();
  }
}
