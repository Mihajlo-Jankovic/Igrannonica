import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from 'src/app/configuration';
import { LoginService } from 'src/app/services/login.service';
import { FilesService } from 'src/app/services/upload/files.service';
import { UserService } from 'src/app/services/user.service';
import files from 'src/files.json';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  loggedUser: boolean;
  files: any[];
  token: string;
  listOfFilesAuthorized: any = [];
  listOfFilesUnauthorized: any = [];
  selectedPrivacyType: string = "all";
  session: any;
  publicFiles: any = [];
  publicFilesUnauthorized: any = [];
  privateFiles: any = [];
  allFiles: any = [];

  configuration = new Configuration();

  public FilesList: { fileId: number, fileName: string, userId: number, username: string, isPublic: boolean }[];
  public FilesListUnauthorized: { fileId: number, fileName: string, userId: number, username: string, isPublic: boolean }[];

  constructor(private filesService: FilesService, private http: HttpClient, private loginService: LoginService, private userService: UserService, private cookie: CookieService) {
    this.session = this.getUsername();
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  ngOnInit(): void {
    this.loggedUser = this.loginService.isAuthenticated();
    if (!(this.get())) {
      console.log("1245");
    }
    if (this.session) {
      this.listOfFilesAuthorized = this.filesService.filesAuthorized().subscribe(data => {
        this.FilesList = data;
        for (let i = 0; i < this.FilesList.length; i++) {
          this.allFiles.push(this.FilesList[i]);
          if (this.FilesList[i]['isPublic'])
            this.publicFiles.push(this.FilesList[i]);
          else this.privateFiles.push(this.FilesList[i]);
        }
      })
    }
    else {
      this.listOfFilesUnauthorized = this.filesService.filesUnauthorized().subscribe(data => {
        this.FilesListUnauthorized = data;
        for (let i = 0; i < this.FilesListUnauthorized.length; i++) {
          if (this.FilesListUnauthorized[i]['isPublic'])
            this.publicFilesUnauthorized.push(this.FilesListUnauthorized[i]);
        }
        console.log(this.publicFilesUnauthorized);

      })
    }
  }

  public onSelectedType(event: any) {
    const value = event.target.value;
    this.selectedPrivacyType = value;
    if (this.selectedPrivacyType == "true") {
      this.FilesList = this.publicFiles;
    }
    else if (this.selectedPrivacyType == 'false') {
      this.FilesList = this.privateFiles;
    }
    else if (this.selectedPrivacyType == "all")
      this.FilesList = this.allFiles;
  }

  save(fileName: string) {
    sessionStorage.setItem('fileName', fileName);
  }


  get() {
    return sessionStorage.getItem('fileName');
  }



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

      if (this.cookie.check('token')) {
        this.token = this.cookie.get('token');
        let headers = new HttpHeaders({
          'Authorization': 'bearer ' + this.token
        });
        let options = { headers: headers };

        this.http.post<string>(this.configuration.fileUpload, formData, options).subscribe(name => {
          let JSONname: string = JSON.stringify(name);
          let StringName = JSON.parse(JSONname).randomFileName;
         this.cookie.set("filename", StringName);
        })
      }
    }
  }

  filesAuthorized() {
    this.filesService.filesAuthorized().subscribe(token => {
      let JSONtoken: string = JSON.stringify(token);
    })
  }
  filesUnauthorized() {
    this.filesService.filesUnauthorized().subscribe(token => {
      let JSONtoken: string = JSON.stringify(token);
    })
  }


}
