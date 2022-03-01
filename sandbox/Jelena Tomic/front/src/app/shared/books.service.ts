import { Injectable } from '@angular/core';
import { Book } from './book';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http : HttpClient) { }

  formData:Book = new Book();
  readonly baseURL = "http://localhost:58661/api/Books";
  list : Book[]

  postBook()
  {
    return this.http.post(this.baseURL, this.formData);
  }

  refresh()
  {
    return this.http.get(this.baseURL).toPromise().then(res => this.list = res as Book[]);
  }

  deleteBook(id:number)
  {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  updateBook()
  {
    return this.http.put(`${this.baseURL}/${this.formData.id}`, this.formData);
  }
}
