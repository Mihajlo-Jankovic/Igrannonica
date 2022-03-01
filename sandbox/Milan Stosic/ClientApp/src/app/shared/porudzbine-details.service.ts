import { Injectable } from '@angular/core';
import { PorudzbineDetails } from './porudzbine-details.model';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class PorudzbineDetailsService {

  constructor(private http:HttpClient) { }

  formData:PorudzbineDetails = new PorudzbineDetails();
  readonly baseURL = 'https://localhost:7194/api/Dostave';
  list : PorudzbineDetails[];

  postPorudzbineDetails() {
    return this.http.post(this.baseURL, this.formData);
  }

  putPorudzbineDetails() {
    return this.http.put(`${this.baseURL}/${this.formData.id}`, this.formData);
  }

  deletePorudzbineDetails(id:number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  refreshlist(){
    this.http.get(this.baseURL)
    .toPromise()
    .then(res => this.list = res as PorudzbineDetails[]);
  }
}
