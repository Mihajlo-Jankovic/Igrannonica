import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  loggedUser: boolean;
  files: any[];
  token : string;

  constructor(private http: HttpClient, private loginService: LoginService, private userService: UserService, private cookie : CookieService) { }

  ngOnInit(): void {
    this.loggedUser = this.loginService.isAuthenticated();
    if (!(this.get())) {
      console.log("1245");
    }


    /*
    this.userService.getAllFilesFromUser(1).subscribe(data => {
      this.files.push(data);
    }) */

  }

  save(fileName:string){
    sessionStorage.setItem('fileName',fileName);
  }
  

  get() {
    return sessionStorage.getItem('fileName');
  }


  headingLines: any = [];
  rowLines: any = [];


  public uploadFile(files: any) {
    if (files.length === 0)
      return;

    let file = <File>files[0];
    var fileSize = file.size;
    if (fileSize / 1048576 > 500)
      alert("Maximum file size is 500MB");
    else {
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.save(file.name);

      if(this.cookie.check('token'))
      {
        this.token = this.cookie.get('token');
        let headers = new HttpHeaders({
          'Authorization': 'bearer ' + this.token });
        let options = { headers: headers };

        this.http.post<string>('https://localhost:7219/api/FileUpload', formData, options).subscribe(name => {
         this.cookie.set("filename", file.name);
      })
      }

      
    }
  }
}
