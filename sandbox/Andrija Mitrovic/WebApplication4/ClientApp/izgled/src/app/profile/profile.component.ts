import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../shared/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  constructor(public service: ProfileService) { }

  ngOnInit() {
    this.service.refreshList();
  }

  populateForm(selectedRecord: any) {
    this.service.formData = Object.assign({}, selectedRecord);
  }

  onDelete(id: number) {
    if (confirm('Are you sure to delete this record ?')) {
      this.service.deleteProfile(id)
        .subscribe(res => {
          this.service.refreshList();
        },
        err => { console.log(err); })
    }
  }
}
