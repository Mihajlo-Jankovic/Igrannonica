import { Component, OnInit} from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import Chart from 'chart.js';
import { CookieService } from "ngx-cookie-service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { layer } from "src/app/models/layer.model";
import { neuron } from "src/app/models/neuron.model";
import { Configuration } from "src/app/configuration";
import { LoginService } from "src/app/services/login.service";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "src/app/services/notifications.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"]
})

export class DashboardComponent implements OnInit {

  public canvas: any;
  public ctx;
  public data: any;
  public val_data: any;
  public chart_labels: any;
  public label: string = "loss";
  public val_label: string = "val_loss";
  public myChartData;
  public buttons: any = [];
  public ngbTooltip : any;

  public problemType: string = "Regression";
  public encodingType: string = "label";
  public activationFunction: string = "sigmoid";
  public optimizer: string = "Adam";
  public learningRate: number = 0.0001;
  public regularization: string = "None";
  public regularizationRate: number = 0;
  public lossFunction: string;
  public metrics: any = [];
  public epochs: number = 10;
  public range: number = 50;
  public experimentName: string = "";

  public modelHistory: any;
  public trained: boolean = false;
  public training: boolean = false;

  public layersLabel: number = 1;
  public neurons: any = [];

  layer = new layer(1);
  neuron = new neuron(1);

  layerList = [];
  neuronsList = [1,1,1,1,1,1];
  neuronsMatrix = [[],[],[],[],[],[],[],[]];

  public fileName: string = this.cookieService.get('filename');

  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};

  constructor(private cookieService:CookieService, private http:HttpClient, private loginService: LoginService, private notify: NotificationsService) { }

  configuration = new Configuration();

  get() {
    return sessionStorage.getItem('username');
  }

  onLogout() {
    this.cookieService.deleteAll();
  }

  increaseLayers(){
    if(this.layersLabel < 6) {
      this.layersLabel++;
      this.layer = new layer(this.layersLabel);
      this.layerList.push(this.layer);
    }
  }

  decreaseLayers(index){
    if(this.layersLabel > 1) {
      this.layersLabel--;
      this.layerList.splice(index);
      this.neuronsList[index] = 1;
      this.neuronsMatrix[index].splice(1);
    }
  }

  increaseNeurons(index){
    if(this.neuronsList[index] < 8) {
      this.neuronsList[index]++;
      this.neuron = new neuron(this.neuronsList[index]);
      this.neuronsMatrix[index].push(this.neuron);
    }
  }

  decreaseNeurons(index, i){
    if(this.neuronsList[index] > 1){
      this.neuronsList[index]--;
      this.neuronsMatrix[index].splice(i-1);
    }
  }
  

  checkProblemType() {
    if(this.problemType == "Regression"){
      this.lossFunction = "mean_squared_error";
      this.dropdownList = [
        {item_id: "mse", item_text: 'Mean Squared Error'},
        {item_id: "msle", item_text: 'Mean Squared Logarithmic Error'},
        {item_id: "mae", item_text: 'Mean Absolute Error'},
        {item_id: "mape", item_text: 'Mean Absolute Percentage Error'},
        {item_id: "logcosh", item_text: 'Log Cosh Error'}
      ];
      this.selectedItems = this.dropdownList;
      this.metrics = this.selectedItems;
    }
    else {
      this.lossFunction = "binary_crossentropy";
      this.dropdownList = [
        {item_id: "binary_accuracy", item_text: 'Binary Accuracy'},
        {item_id: "categorical_accuracy", item_text: 'Categorical Accuracy'},
        {item_id: "sparse_categorical_accuracy", item_text: 'Sparse Categorical Accuracy'},
        {item_id: "top_k_accuracy", item_text: 'Top K Accuracy'},
        {item_id: "sparse_top_k_categorical_accuracy", item_text: 'Sparse Top K Categorical Accuracy'},
        {item_id: "accuracy", item_text: 'Accuracy'}
      ];
      this.selectedItems = this.dropdownList;
      this.metrics = this.selectedItems;
    }
  }

  multiselect(){
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: false
    };
  }

  startTraining() {
    if(sessionStorage.getItem('output') == null || sessionStorage.getItem('inputList') == null) {
      window.alert("Input or output not selected");
      return;
    }
    this.training = true;
    let fileName = this.cookieService.get('filename');
    let inputList = JSON.parse(sessionStorage.getItem('inputList'));
    let output = sessionStorage.getItem('output');
    let layerList = [];
    for (let i = 0; i < this.layersLabel; i++){
      layerList[i] = this.neuronsList[i];
    }
    let metrics = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      metrics[i] = this.selectedItems[i].item_id;
    }
    //console.log({"fileName" : fileName, 'inputList' : inputList, 'output' : output, 'encodingType' : this.encodingType, 'ratio' : 1 - (1 * (this.range/100)), 'numLayers' : this.layersLabel, 'layerList' : layerList, 'activationFunction' : this.activationFunction, 'regularization' : this.regularization, 'regularizationRate' : this.regularizationRate, 'optimizer' : this.optimizer, 'learningRate' : this.learningRate, 'problemType' : this.problemType, 'lossFunction' : this.lossFunction, 'metrics' : metrics, 'numEpochs' : this.epochs});
    this.http.post(this.configuration.startTesting,{"fileName" : fileName, 'inputList' : inputList, 'output' : output, 'encodingType' : this.encodingType, 'ratio' : 1 - (1 * (this.range/100)), 'numLayers' : this.layersLabel, 'layerList' : layerList, 'activationFunction' : this.activationFunction, 'regularization' : this.regularization, 'regularizationRate' : this.regularizationRate, 'optimizer' : this.optimizer, 'learningRate' : this.learningRate, 'problemType' : this.problemType, 'lossFunction' : this.lossFunction, 'metrics' : metrics, 'numEpochs' : this.epochs}).subscribe(
      (response) => {
        this.trained = true;
        this.training = false;
        this.modelHistory = response;
        this.buttons = Object.keys(this.modelHistory);
        this.buttons.splice(this.buttons.length/2);
        this.data = this.modelHistory['loss'];
        this.val_data = this.modelHistory['val_loss'];
        this.chart_labels = [];
        for (let i = 0; i < this.data.length; i++) {
          this.chart_labels[i] = i + 1;
        }
        this.updateOptions();
      }
    );
  }

  saveExperiment() {
    let loggedUser: boolean;
    let token: string;

    loggedUser = this.loginService.isAuthenticated();
    if (loggedUser) {
      token = this.cookieService.get('token');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + token
    });
    
    let options = { headers: headers };

    let fileName = this.cookieService.get('filename');
    let inputList = JSON.parse(sessionStorage.getItem('inputList'));
    let output = sessionStorage.getItem('output');
    let layerList = [];
    for (let i = 0; i < this.layersLabel; i++){
      layerList[i] = this.neuronsList[i];
    }
    let metrics = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      metrics[i] = this.selectedItems[i].item_id;
    }
    let today = new Date();
    let date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();
    let experiment = {
      'userId' : 0,
      'name' : this.experimentName,
      'date' : date,
      'fileName' : fileName, 
      'inputList' : inputList, 
      'output' : output, 
      'encodingType' : this.encodingType, 
      'ratio' : 1 - (1 * (this.range/100)), 
      'numLayers' : this.layersLabel, 
      'layerList' : layerList, 
      'activationFunction' : this.activationFunction, 
      'regularization' : this.regularization, 
      'regularizationRate' : this.regularizationRate, 
      'optimizer' : this.optimizer, 
      'learningRate' : this.learningRate, 
      'problemType' : this.problemType, 
      'lossFunction' : this.lossFunction, 
      'metrics' : metrics, 
      'numEpochs' : +this.epochs
    }
    /*
          SLANJE ZAHTEVA
    */
    this.http.post("https://localhost:7219/api/User/saveExperiment", experiment, options).subscribe(
      (response) => {
        this.notify.showNotification("Experiment saved to your profile successfully!");
      }
    );
  }

  changeData(name){
    this.data = this.modelHistory[name];
    this.val_data = this.modelHistory['val_' + name];
    this.label = name;
    this.val_label = 'val_' + name;
    this.updateOptions();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  ngOnInit() {
    this.multiselect();
    this.checkProblemType();
    this.layer.id = 1;
    this.layerList.push(this.layer);
    
    for (let i = 0; i < this.neuronsMatrix.length; i++) {
      this.neuron = new neuron(1);
      this.neuronsMatrix[i].push(neuron);
    }

    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: true
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ffffff"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ffffff"
          }
        }]
      }
    };

    this.chart_labels = [];

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
    var val_gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(212,80,217,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(212,80,217,0.0)');
    gradientStroke.addColorStop(0, 'rgba(212,80,217,0)'); //pink colors

    val_gradientStroke.addColorStop(1, 'rgba(14,134,212,0.2)');
    val_gradientStroke.addColorStop(0.4, 'rgba(14,134,212,0.0)');
    val_gradientStroke.addColorStop(0, 'rgba(14,134,212,0)'); //blue colors

    var config = {
      type: 'line',
      data: {
        labels: this.chart_labels,
        datasets: [{
          label: this.label,
          fill: true,
          backgroundColor: val_gradientStroke,
          borderColor: '#0e86d4',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#0e86d4',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#0e86d4',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.data,
        },{
          label: this.val_label,
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#d450d9',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#d450d9',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#d450d9',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.val_data,
        }]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.myChartData = new Chart(this.ctx, config);
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.data.datasets[0].label = this.label;
    this.myChartData.data.datasets[1].data = this.val_data;
    this.myChartData.data.datasets[1].label = this.val_label;
    this.myChartData.data.labels = this.chart_labels;
    this.myChartData.update();
  }

  showTooltip(name)
  {
    if(name == "mse")
    this.ngbTooltip = "Mean Squared Error";
    else if(name == "mae")
    this.ngbTooltip = "Mean Absolute Error";
    else if(name == "mape")
    this.ngbTooltip = "Mean Absolute Percentage Error";
    else if(name == "loss")
    this.ngbTooltip = "Loss Function";
    else if(name == "cosine")
    this.ngbTooltip = "Cosine Proximity";
    else if(name == "logcosh")
    this.ngbTooltip = "Log Cosh Error";
    else if(name == "msle")
    this.ngbTooltip = "Mean Squared Logarithmic Error";

    return this.ngbTooltip;
    
  }
}
