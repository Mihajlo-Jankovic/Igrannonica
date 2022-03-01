
import { Profile } from './profile.model';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  formData: Profile= new Profile();
  readonly baseURL = 'http://localhost:44338/api/Profile';
  list: Profile[] = [];

  constructor(private http: HttpClient) { }

  postProfile() {
    return this.http.post(this.baseURL, this.formData);
  }
  putProfile() {
    return this.http.put(`${this.baseURL}/${this.formData.ProfileID}`, this.formData);
  }
  deleteProfile(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  refreshList() {
    this.http.get(this.baseURL)
      .toPromise()
      .then(res =>this.list = res as Profile[]);
  }

  
}
