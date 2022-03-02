import { Component, OnInit } from '@angular/core';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  constructor(public service: ProfileService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }

  populateForm(selectedProfile: Profile){
    this.service.formData = Object.assign({},selectedProfile);
  }

  onDelete(id: number){
    this.service.deleteProfile(id)
    .subscribe(
      res=>{
        this.service.refreshList();
      },
      err=>{console.log(err)}
    );
  }
}
