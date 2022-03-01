import { Component, OnInit } from '@angular/core';
import {NgForm } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/shared/book';
import { BooksService } from 'src/app/shared/books.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styles: [
  ]
})
export class BookFormComponent implements OnInit {

  constructor(public service : BooksService, private toastr : ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(form : NgForm)
  {
    if(this.service.formData.id == 0)
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }

  insertRecord(form : NgForm)
  {
    this.service.postBook().subscribe(res =>{
      this.reset(form);
      this.toastr.success('Submited successfully', 'Books');
    }, err =>{
      console.log(err);
    });
  }

  updateRecord(form : NgForm)
  {
    this.service.updateBook().subscribe(res =>{
      this.reset(form);
      this.toastr.info('Updated successfully', 'Books');
    }, err =>{
      console.log(err);
    });
  }

  reset(form : NgForm)
  {
    this.service.refresh();
    this.service.formData = new Book();
  }

}
