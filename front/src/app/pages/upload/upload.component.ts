import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from 'src/app/configuration';
import { LoginService } from 'src/app/services/login.service';
import { FilesService } from 'src/app/services/upload/files.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import files from 'src/files.json';
import { Router } from '@angular/router';

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

  public FilesList: { fileId: number, fileName: string, userId: number, username: string, isPublic: boolean, randomFileName: string, thisUser: string, Public:string}[];
  public FilesListUnauthorized: { fileId: number, fileName: string, userId: number, username: string, isPublic: boolean, randomFileName: string}[];

  constructor(private filesService: FilesService, private router: Router,private http: HttpClient, private loginService: LoginService, private userService: UserService, private cookie: CookieService, private toastr: ToastrService) {
    this.session = this.getUsername();
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  ngOnInit(): void {
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.session) {
      this.listOfFilesAuthorized = this.filesService.filesAuthorized().subscribe(data => {
        this.FilesList = data;

        for (let i = 0; i < this.FilesList.length; i++) {
          if (this.FilesList[i]['username'] == this.getUsername()) {
            this.FilesList[i]['thisUser'] = this.getUsername();
          }
          if(this.FilesList[i]['isPublic'] == true) {
            this.FilesList[i]['Public']="true";
          }
        } 


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

      sessionStorage.removeItem('csv');
      sessionStorage.removeItem('numOfPages');
      sessionStorage.removeItem('numericValues');
      sessionStorage.removeItem('statistics');
      sessionStorage.removeItem('inputList');
      sessionStorage.removeItem('output');

    let file = <File>files[0];
    var fileSize = file.size;
    if (fileSize / 1048576 > 5000)
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
      else{
        this.http.post<string>(this.configuration.fileUploadUnauthorized, formData).subscribe(name=>{
          let JSONname: string = JSON.stringify(name);
          let StringName = JSON.parse(JSONname).randomFileName;
          this.cookie.set("filename", StringName);
        })
      }
    }
    this.uploadNotification();
    this.router.navigate(['tables']);
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

  download(event, item) {
    if (this.cookie.check('token')) {
      this.token = this.cookie.get('token');
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + this.token
      });
      let options = { headers: headers };
      const baseUrl = 'https://localhost:7219/api/Csv/';
      this.http.get<any>('https://localhost:7219/api/Csv/'+item.randomFileName, {headers, responseType:'blob' as 'json'}).subscribe((response:any) => {
        let dataType = response.type;
        let binaryData=[];
        binaryData.push(response);
        let downloadLink=document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData,{type:dataType}));
        if(item.randomFileName){
          downloadLink.setAttribute('download',item.randomFileName);
        }
        document.body.appendChild(downloadLink);
        downloadLink.click();
      })
    }
  }

  downloadUn(event, item) {
    this.http.get<any>('https://localhost:7219/api/Csv/' + item.randomFileName, { responseType: 'blob' as 'json' }).subscribe((response: any) => {

      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (item.randomFileName) {
        downloadLink.setAttribute('download', item.randomFileName);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })
  }

  useThis(event, item) {
    this.cookie.set("filename", item.randomFileName);
    sessionStorage.clear();
  }
  useThisUn(event, item) {
    this.cookie.set("filename", item.randomFileName);
    sessionStorage.clear();
  }

  delete(event, item) {
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('token');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    this.http.get<any>('https://localhost:7219/api/FileUpload/delete-authorized/' + item.randomFileName, options).subscribe(token => {
      let JSONtoken: string = JSON.stringify(token);
      location.reload();
    })
  }

  onCheckboxChange(event: any,item) {
    if(!event.target.checked){
      item.isPublic = false;
      this.loggedUser = this.loginService.isAuthenticated();
      if (this.loggedUser) {
        this.token = this.cookie.get('token');
      }
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + this.token
      });
      let options = { headers: headers };
      this.http.post<string>('https://localhost:7219/api/Csv/updateVisibility',
      {
        "id" : item.fileId,
        "isVisible" : item.isPublic
      }, options).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        location.reload();
      })
      location.reload();
    }
    else if(event.target.checked){
      item.isPublic = true;
      this.loggedUser = this.loginService.isAuthenticated();
      if (this.loggedUser) {
        this.token = this.cookie.get('token');
      }
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + this.token
      });
      let options = { headers: headers };
      this.http.post<string>('https://localhost:7219/api/Csv/updateVisibility' ,
      {
        "id" : item.fileId,
        "isVisible" : item.isPublic
      }, options).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        location.reload();
      })
      location.reload();
    }
  }


  uploadNotification() {
    this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>File uploaded successfully</b>.', '', {
      disableTimeOut: false,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-info alert-with-icon",
      positionClass: 'toast-top-center'
    });
  }
}
