import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PorudzbineDetails } from '../shared/porudzbine-details.model';
import { PorudzbineDetailsService } from '../shared/porudzbine-details.service';

@Component({
  selector: 'app-porudzbine-details',
  templateUrl: './porudzbine-details.component.html',
  styles: [
  ]
})
export class PorudzbineDetailsComponent implements OnInit {

  constructor(public service: PorudzbineDetailsService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.refreshlist();
  }

  populateForm(selectedRecord:PorudzbineDetails){
    this.service.formData = selectedRecord;
  }

  onDelete(id:number){
    if(confirm("Da li ste sigurni da zelite da obrisete ovu dostavu?"))
    {
      this.service.deletePorudzbineDetails(id)
      .subscribe(
        res => {
          this.service.refreshlist();
          this.toastr.error("Uspesno obrisano", "Detalji dostave")

        },
        err => {console.log(err)}
      )
    }
  }
}
