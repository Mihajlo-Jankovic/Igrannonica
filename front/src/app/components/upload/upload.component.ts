import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  loggedUser: boolean;
  files: any = [];

  constructor(private http : HttpClient, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loggedUser = this.loginService.isAuthenticated();
    console.log(this.loggedUser);
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
  if(fileSize / 1048576 > 500)
    alert("Maximum file size is 500MB");
  else{
    const formData = new FormData();
    formData.append('file', file, file.name);

    let reader: FileReader =  new FileReader();
                reader.readAsText(file);
                reader.onload = (e) => {
                    let csv: any = reader.result;
                    let allTextLines = [];
                    allTextLines = csv.split('\n');
                    
                    let headers = allTextLines[0].split(/;|,/);
                    let data = headers;
                    let headersArray = [];

                    for (let i = 0; i < headers.length; i++) {
                        headersArray.push(data[i]);
                    }
                    this.headingLines.push(headersArray);

                    let rowsArray = [];

                    let length = allTextLines.length - 1;
                    
                    let rows = [];
                    for (let i = 1; i < length; i++) {
                        rows.push(allTextLines[i].split(/;|,/));
                    }
                    length = rows.length;
                    for (let j = 0; j < length; j++) {
                        rowsArray.push(rows[j]);
                    }
                    this.rowLines.push(rowsArray);
                    console.log(this.rowLines);
                }

    this.http.post('https://localhost:7219/api/Upload', formData).subscribe(err =>
    {
      if(err)
      {
        console.log(err);
      }
    })
  }
}

}
