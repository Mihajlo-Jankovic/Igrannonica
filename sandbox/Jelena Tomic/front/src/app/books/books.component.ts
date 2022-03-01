import { Component, OnInit } from '@angular/core';
import { Book } from '../shared/book';
import { BooksService } from '../shared/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styles: [
  ]
})
export class BooksComponent implements OnInit {

  constructor(public service : BooksService) { }

  ngOnInit(): void {
    this.service.refresh();
  }

  populateForm(book : Book)
  {
    this.service.formData = (Object).assign({}, book);
  }

  delete(id:number)
  {
    this.service.deleteBook(id).subscribe(res =>{
      this.service.refresh();
    },
     err =>{console.log(err)});
     this.service.refresh();
  }

}
