import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Biblioteka } from './biblioteka.model';

@Injectable({
  providedIn: 'root'
})
export class BibliotekaService {

  constructor(private http:HttpClient) { }

  readonly baseURL = 'http://localhost:62017/api/Biblioteka'
  formData: Biblioteka = new Biblioteka();
  list!:Biblioteka[];
  
  postBiblioteka(){
    return this.http.post(this.baseURL, this.formData);
  }
  putBiblioteka(){
    return this.http.put(`${this.baseURL}/${this.formData.id}`, this.formData);
  }
  deleteBiblioteka(id:number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }
  refreshList(){
    this.http.get(this.baseURL)
    .toPromise()
    .then(res => this.list = res as Biblioteka[]);
  }
}
