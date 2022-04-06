export class Configuration
{
    public port : string  = "https://localhost:7219";

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
    public testiranje : string = this.port + "/api/PythonComm/testiranje";
    public startTesting : string = this.port + "/api/PythonComm/startTraining";
}