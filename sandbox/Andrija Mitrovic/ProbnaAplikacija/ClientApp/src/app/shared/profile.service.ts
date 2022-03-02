import { Injectable } from '@angular/core';
import { Profile } from './profile.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  formData: Profile = new Profile;
  list: Profile[];

  readonly baseURL = "https://localhost:5001/api/Profiles";

  postProfile(){
    return this.http.post(this.baseURL,this.formData);
  }
  putProfile(){
    return this.http.put(`${this.baseURL}/${this.formData.userID}`,this.formData);
  }

  deleteProfile(id:number){

    return this.http.delete(`${this.baseURL}/${id}`);
  }
  refreshList(){
    this.http.get(this.baseURL)
    .toPromise()
    .then(res => this.list = res as Profile[]);
  }
}
