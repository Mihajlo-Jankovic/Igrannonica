import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from 'src/app/configuration';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ExpNameService } from 'src/app/services/expName.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss']
})
export class ExperimentsComponent implements OnInit {

  configuration = new Configuration();

  cookieCheck: any = false;
  token: string;
  loggedUser: boolean;
  pageNum: any = 1;
  numOfPages: any = 0;
  numPerPage: any = 6;
  listOfExperimentsAuthorized: any = [];
  listOfExperimentsUnauthorized: any = [];
  selectedPrivacyType: string = "public";
  publicExperiments: any = [];
  publicExperimentsUnauthorized: any = [];
  allExperiments: any = [];
  myExperiments: any = [];

  experiment = {
    'name': "",
    'description': ""
  }

  data = {
    "_id": "",
    "userId": 0,
    "username": "",
    "name": "",
    "date": "",
    "fileName": "",
    "realName": "",
    "description": "",
    "visibility": false,
    "models": [
      {
        "id": 0,
        "data": {
          "logcosh": [],
          "loss": [],
          "mae": [],
          "mape": [],
          "mse": [],
          "msle": [],
          "val_logcosh": [],
          "val_loss": [],
          "val_mae": [],
          "val_mape": [],
          "val_mse": [],
          "val_msle": []
        },
        "parameters": {
          "inputList": [],
          "output": "",
          "ratio": 0,
          "numLayers": 0,
          "layerList": [],
          "activationFunction": "",
          "regularization": "",
          "regularizationRate": 0,
          "optimizer": "",
          "learningRate": 0,
          "problemType": "",
          "lossFunction": "",
          "metrics": [],
          "numEpochs": 0,
          "encodingList": [],
          "fileName": ""
        }
      }
    ]
  }

  deleteWarning: boolean = false;
  toDelete: any;

  noExperiments: boolean = true;
  experimentListAuthorized: any = []
  experimentListUnauthorized: any = []

  public poruka: string;
  public message: string;

  constructor(public lang:LanguageService, private notify: NotificationsService, private userService: UserService, private cookie: CookieService, private router: Router, private loginService: LoginService, private http: HttpClient, private expName: ExpNameService) {
    if (this.cookie.get('cortexToken')) {
      this.cookieCheck = this.cookie.get('cortexToken');
      this.selectedPrivacyType = 'myexperiments'
    }
  }

  ngOnInit(): void {
    this.lang.lanClickedEvent.subscribe((data:string) =>{
      this.message = data;
    });
    this.message = sessionStorage.getItem("lang");
    sessionStorage.setItem('lastPage', 'experiments');
    this.showExperiments(this.selectedPrivacyType, this.pageNum);
  }

  refreshToken() {
    this.token = this.cookie.get('cortexToken');

    this.http.get<any>(this.configuration.refreshToken + this.token).subscribe(token => {
      let JSONtoken: string = JSON.stringify(token);
      let StringToken = JSON.parse(JSONtoken).token;
      this.cookie.set("cortexToken", StringToken);
    }, err => {
      let JSONtoken: string = JSON.stringify(err.error);
      let StringToken = JSON.parse(JSONtoken).token;
      if (StringToken == "Error: Token not valid") {
        this.cookie.deleteAll();
        sessionStorage.clear();
        this.router.navigate(["home"]);
      }
    });
  }

  getUsername() {
    return this.cookie.get('username');
  }

  showExperiments(privacyType: string, page: number) {
    this.loggedUser = this.loginService.isAuthenticated();
    this.numOfPages = 0;
    if (this.cookieCheck) {
      this.experimentListAuthorized = []
      this.listOfExperimentsAuthorized = this.userService.getAllUserExperiments(privacyType, page, this.numPerPage, this.numOfPages).subscribe(exp => {
        for (let i = 0; i < exp['experiments'].length; i++) {
          let expData: any = {};
          expData = exp['experiments'][i];
          this.data = expData;

          this.experimentListAuthorized.push(this.data);
          this.numOfPages = exp['numOfPages'];
        }

        this.allExperiments = [];
        this.myExperiments = [];

        for (let i = 0; i < this.experimentListAuthorized.length; i++) {
          if (this.experimentListAuthorized[i]['visibility'] == true) {
            this.allExperiments.push(this.experimentListAuthorized[i]);
          }
          this.myExperiments.push(this.experimentListAuthorized[i]);
        }
        if (this.selectedPrivacyType == "public") {
          this.experimentListAuthorized = this.allExperiments;
        }
        else if (this.selectedPrivacyType == "myexperiments") {
          this.experimentListAuthorized = this.myExperiments;
        }

        if (this.experimentListAuthorized.length != 0) {
          this.noExperiments = false;
        }
        else {
          this.noExperiments = true;
        }
      })
    }
    else {
      this.experimentListUnauthorized = [];
      this.listOfExperimentsUnauthorized = this.userService.getPublicExperiments("public", this.pageNum, this.numPerPage, this.numOfPages).subscribe(exp => {
        for (let i = 0; i < exp['experiments'].length; i++) {
          let expData: any = {};
          expData = exp['experiments'][i];
          this.data = expData;

          this.experimentListUnauthorized.push(this.data);
          this.numOfPages = exp['numOfPages'];
        }

        for (let i = 0; i < this.experimentListUnauthorized.length; i++) {
          if (this.experimentListUnauthorized[i]['visibility']) {
            this.publicExperimentsUnauthorized.push(this.experimentListUnauthorized[i]);
          }
        }

        if (this.publicExperimentsUnauthorized.length != 0) {
          this.noExperiments = false;
        }
        else {
          this.noExperiments = true;
        }
      });
    }
  }

  public checkForDelete(username: any) {
    if (username == this.cookie.get('username'))
      return false;
    else
      return true;
  }

  public onSelectedType(event: any) {
    const value = event.target.value;
    this.selectedPrivacyType = value;
    this.pageNum = 1;
    this.showExperiments(this.selectedPrivacyType, this.pageNum);
  }

  nextPage(i: number) {
    if (this.pageNum + i <= this.numOfPages) {
      this.pageNum += i;
      this.showExperiments(this.selectedPrivacyType, this.pageNum);
    }
  }

  previousPage(i: number) {
    if (this.pageNum - i >= 1) {
      this.pageNum -= i;
      this.showExperiments(this.selectedPrivacyType, this.pageNum);
    }
  }

  firstPage() {
    if (this.pageNum != 1) {
      this.pageNum = 1;
      this.showExperiments(this.selectedPrivacyType, this.pageNum);
    }
  }

  lastPage() {
    if (this.pageNum != this.numOfPages) {
      this.pageNum = this.numOfPages;
      this.showExperiments(this.selectedPrivacyType, this.pageNum);
    }
  }

  onCheckboxChange(event: any, item) {

    if (!event.target.checked) {
      item.visibility = false;
      this.loggedUser = this.loginService.isAuthenticated();
      if (this.loggedUser) {
        this.token = this.cookie.get('cortexToken');
      }
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + this.token
      });
      let options = { headers: headers };
      this.http.post<string>(this.configuration.updateVisibilityExperimets,
        {
          "_id": item._id,
          "visibility": item.visibility
        }, options).subscribe(token => {
          let JSONtoken: string = JSON.stringify(token);
          setTimeout(() => {
            this.showExperiments("public", this.pageNum);
          }, 350);
        })
    }
    if (event.target.checked) {
      item.visibility = true;
      this.loggedUser = this.loginService.isAuthenticated();
      if (this.loggedUser) {
        this.token = this.cookie.get('cortexToken');
      }
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + this.token
      });
      let options = { headers: headers };
      this.http.post<string>(this.configuration.updateVisibilityExperimets,
        {
          "_id": item._id,
          "visibility": item.visibility
        }, options).subscribe(token => {
          let JSONtoken: string = JSON.stringify(token);
        })
    }
  }

  deleteCheck(item) {
    this.deleteWarning = true;
    this.toDelete = item;
  }

  deleteExperiments(id: any) {
    this.userService.deleteExperiment(id).subscribe(res => {
      if (res['id']) {
        this.poruka = "Experiment deleted successfully.";
        if(this.message == "sr") this.poruka = "Eksperiment je uspe??no obrisan"
        this.notify.showNotification(this.poruka);
      }
      this.experimentListAuthorized = [];
      this.experimentListUnauthorized = [];
      this.showExperiments(this.selectedPrivacyType, this.pageNum);
    })
  }

  useExperiments(item) {
    if (this.loggedUser) {
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + this.cookieCheck
      });
      let options = { headers: headers };
      this.http.post<any>(this.configuration.useExperimentAuthorized, item, options).subscribe(res => {
        item = res;
        this.useExperimentHelper(res);
      });
    }
    else {
      this.http.post<any>(this.configuration.useExperimentUnauthorized, item).subscribe(res => {
        item = res;
        this.useExperimentHelper(res);
      });
    }

  }

  useExperimentHelper(item) {
    sessionStorage.clear();

    var metricsList = [];
    var metrics = item.models[0].parameters.metrics;
    for (let i = 0; i < metrics.length; i++) {
      if (metrics[i] == "mse") {
        metricsList[i] = { item_id: "mse", item_text: "Mean Squared Error" }
      }
      else if (metrics[i] == "msle") {
        metricsList[i] = { item_id: "msle", item_text: "Mean Squared Logarithmic Error" }
      }
      else if (metrics[i] == "mae") {
        metricsList[i] = { item_id: "mae", item_text: "Mean Absolute Error" }
      }
      else if (metrics[i] == "mape") {
        metricsList[i] = { item_id: "mape", item_text: "Mean Absolute Percentage Error" }
      }
      else if (metrics[i] == "logcosh") {
        metricsList[i] = { item_id: "logcosh", item_text: "Log Cosh Error" }
      }
      else if (metrics[i] == "categorical_accuracy") {
        metricsList[i] = { item_id: "categorical_accuracy", item_text: "Categorical Accuracy" }
      }
      else if (metrics[i] == "sparse_categorical_accuracy") {
        metricsList[i] = { item_id: "sparse_categorical_accuracy", item_text: "Sparse Categorical Accuracy" }
      }
      else if (metrics[i] == "top_k_accuracy") {
        metricsList[i] = { item_id: "top_k_accuracy", item_text: "Top K Accuracy" }
      }
      else if (metrics[i] == "sparse_top_k_categorical_accuracy") {
        metricsList[i] = { item_id: "sparse_top_k_categorical_accuracy", item_text: "Sparse Top K Categorical Accuracy" }
      }
      else if (metrics[i] == "accuracy") {
        metricsList[i] = { item_id: "accuracy", item_text: "Accuracy" }
      }
      else if (metrics[i] == "binary_accuracy") {
        metricsList[i] = { item_id: "binary_accuracy", item_text: "Binary Accuracy" }
      }
    }

    sessionStorage.setItem('metrics', JSON.stringify(metricsList))

    sessionStorage.setItem('modelsList', JSON.stringify(item.models));

    let keys = Object.keys(item.models[0].data);
    let headers = []
    keys.forEach(key => {
      if (item.models[0].data[key] != null)
        headers.push(key);
    })

    let evalHeaders = ["loss"]
    for (let i = 0; i < metrics.length; i++)
      evalHeaders.push(metrics[i]);

    sessionStorage.setItem('modelsHeader', JSON.stringify(headers));
    sessionStorage.setItem('evaluationMetrics', JSON.stringify(evalHeaders))
    sessionStorage.setItem('modelsTrained', (item.models.length).toString());

    let maxEpoch = item.models[0].parameters['numEpochs'];
    for (let i = 1; i < item.models.length; i++) {
      if (item.models[i].parameters['numEpochs'] > maxEpoch)
        maxEpoch = item.models[i].parameters['numEpochs'];
    }

    let labels = [];
    for (let i = 1; i <= maxEpoch; i++)
      labels.push(i);

    sessionStorage.setItem('maxEpoch', maxEpoch.toString());
    sessionStorage.setItem('metricsLabel', JSON.stringify(labels));

    sessionStorage.setItem('filename', item.fileName);
    sessionStorage.setItem('realName', item.realName);
    sessionStorage.setItem('description', item.description);
    sessionStorage.setItem('experimentName', item.name);

    this.expName.refreshExperimentName(item.name);
    this.expName.filename(item.fileName);

    // sessionStorage.removeItem('problemType');
    // sessionStorage.removeItem('optimizer');
    // sessionStorage.removeItem('regularization');
    // sessionStorage.removeItem('lossFunction');
    // sessionStorage.removeItem('range');
    // sessionStorage.removeItem('activationFunction');
    // sessionStorage.removeItem('activationFunction');
    // sessionStorage.removeItem('regularizationRate');
    // sessionStorage.removeItem('epochs');
    // sessionStorage.removeItem('neuronNum');
    // sessionStorage.removeItem('chartData');
    // sessionStorage.removeItem('numLayers');
    // sessionStorage.removeItem('neuronsList');

    this.router.navigate(['datapreview']);
  }

}
