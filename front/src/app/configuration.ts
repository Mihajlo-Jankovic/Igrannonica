import { Component, Input } from "@angular/core";
import { environment } from "src/environments/environment";

export class Configuration
{
    public port : string = "http://147.91.204.115:10106"; // http://147.91.204.115:10106 https://localhost:7219
    

    public login : string = this.port + "/api/User/login";
    public register : string = this.port + "/api/User/register";
    public tableData : string = this.port + "/api/PythonComm/getTableDataUnauthorized";
    public statistics : string = this.port + "/api/PythonComm/getStatisticsUnauthorized";
    public deleteTableRow : string = this.port + "/api/Csv/deletefilerowunauthorized";
    public editTableCell : string = this.port + "/api/Csv/updatefilerowunauthorized";
    public authorizedFiles : string = this.port + "/api/Csv/getCSVAuthorized";
    public unauthorizedFiles : string = this.port + "/api/Csv/getCSVUnauthorized";
    public getNameSurnameEmail : string = this.port + "/api/User/GetNameSurnameEmail";
    public editUsername : string = this.port + "/api/User/EditUserName";
    public editPassword : string = this.port + "/api/User/EditUserPassword";
    public fileUpload : string = this.port + "/api/FileUpload";
    public fileUploadUnauthorized = this.port + "/api/FileUpload/unauthorized";
    public testiranje : string = this.port + "/api/PythonComm/testLive";
    public startTesting : string = this.port + "/api/PythonComm/startTraining";
    public userExperiments : string = this.port + "/api/User/getExperimentAuthorized";
    public publicExperiments : string = this.port + "/api/User/getExperimentUnauthorized";
    public deleteExperiment : string = this.port + "/api/User/deleteExperiment";
    public saveExperiment : string = this.port + "/api/User/saveExperiment";
    public downloadFile : string = this.port + "/api/Csv/";
    public downloadFileUnauthorized = this.port + "/api/FileUpload/delete-authorized/";
    public updateVisibility = this.port + "/api/Csv/updateVisibility";
    public refreshToken = this.port + "/api/User/refreshToken/";
    public updateVisibilityExperimets = this.port + "/api/User/updateExperimentVisibility";
    //public fillMissingValuesUnauthorized = this.port + "/api/Csv/fillMissingValuesunaUthorized";
    public fillMissingValuesUnauthorized = this.port + "/api/Csv/fillMissingValuesUnauthorized";
    public fillMissingValuesAuthorized = this.port + "/api/Csv/fillMissingValuesAuthorized";
    public changeOutliersUnauthorized = this.port + "/api/Csv/changeOutliersUnauthorized";
    public changeOutliersAuthorized = this.port + "/api/Csv/changeOutliersAuthorized";
    public tempPassword = this.port + "/api/User/sendtemppasswordmail/";
    public verifyMail = this.port + "/api/User/verifyMail";
    public resetPassword = this.port + "/api/User/resetpassword";
    public useFileAuthorized = this.port + "/api/FileUpload/usefileauthorized";
    public useFileUnauthorized = this.port + "/api/FileUpload/usefileunauthorized";
    public useExperimentAuthorized = this.port + "/api/User/useExperimentAuthorized";
    public useExperimentUnauthorized = this.port + "/api/User/useExperimentUnauthorized";
}