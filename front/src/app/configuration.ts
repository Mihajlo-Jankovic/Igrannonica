import { Component, Input } from "@angular/core";
import { environment } from "src/environments/environment";

export class Configuration
{
    public port : string = environment.url;
    

    public login : string = this.port + "/api/User/login";
    public register : string = this.port + "/api/User/register";
    public tableData : string = this.port + "/api/PythonComm/getTableData";
    public statistics : string = this.port + "/api/PythonComm/getStatistics";
    public deleteTableRow : string = this.port + "/api/Csv/deletefilerow";
    public editTableCell : string = this.port + "/api/Csv/updatefilerow";
    public authorizedFiles : string = this.port + "/api/Csv/getCSVAuthorized";
    public unauthorizedFiles : string = this.port + "/api/Csv/getCSVUnauthorized";
    public getNameSurnameEmail : string = this.port + "/api/User/GetNameSurnameEmail";
    public editUsername : string = this.port + "/api/User/EditUserName";
    public editPassword : string = this.port + "/api/User/EditUserPassword";
    public fileUpload : string = this.port + "/api/FileUpload";
    public fileUploadUnauthorized = this.port + "/api/FileUpload/unauthorized";
    public testiranje : string = this.port + "/api/PythonComm/testiranje";
    public startTesting : string = this.port + "/api/PythonComm/startTraining";
    public userExperiments : string = this.port + "/api/User/getUserExperiments";
    public deleteExperiment : string = this.port + "/api/User/deleteExperiment";
    public saveExperiment : string = this.port + "/api/User/saveExperiment";
    public downloadFile : string = this.port + "/api/Csv/";
    public downloadFileUnauthorized = this.port + "/api/FileUpload/delete-authorized/";
    public updateVisibility = this.port + "/api/Csv/updateVisibility";
}