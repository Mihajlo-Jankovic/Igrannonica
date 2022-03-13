import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
  }

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

  this.http.post('https://localhost:7219/', formData).subscribe(err =>
  {
    if(err)
    {
      console.log(err);
    }
  })
}
}

}
