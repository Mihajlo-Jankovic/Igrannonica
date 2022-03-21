import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  loggedUser: boolean;
  files: any [];
  
  constructor(private http : HttpClient, private loginService: LoginService, private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.loginService.isAuthenticated();
    console.log(this.loggedUser);

    /*
    this.userService.getAllFilesFromUser(1).subscribe(data => {
      this.files.push(data);
    }) */
    
  }

  headingLines: any = [];
  rowLines: any = [];


public uploadFile(files : any)
{
  if(files.length === 0)
    return;
  
  let file = <File>files[0];
  var fileSize = file.size;
  console.log(fileSize);
  if(fileSize / 1048576 > 5000)
    alert("Maximum file size is 500MB");
  else{
    const formData = new FormData();
    formData.append('file', file, file.name);

    this.http.post('https://localhost:7219/api/FileUpload/Upload', formData).subscribe(err =>
    {
      if(err)
      {
        console.log(err);
      }
    })
  }
}




}
