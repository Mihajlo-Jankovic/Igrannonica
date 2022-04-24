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
import * as signalR from '@microsoft/signalr'
import { SignalRService } from "src/app/services/signal-r.service";
import { trainedModel } from "src/app/models/trainedModel.model";
import { FailedToNegotiateWithServerError } from "@microsoft/signalr/dist/esm/Errors";

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
  public epochs: number = 100;
  public range: number = 80;
  public experimentName: string = "";

  public selectedMetric: string = "loss";

  public trained: boolean = false;
  public training: boolean = false;

  public layersLabel: number = 1;
  public neurons: any = [];

  layer = new layer(1);
  neuron = new neuron(1);

  layerList = [];
  neuronsList = [1,1,1,1,1,1,1,1];

  public fileName: string = this.cookieService.get('filename');
  public loggedUser: boolean;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};

  private hubConnection: signalR.HubConnection;
  public connectionId : string;
  public liveData: {};
  public chartData = {};

  public parameters: {};
  public modelsList: any = [];
  public modelsTrained: number = 0;
  public modelsHeader: any = [];
  public selectedEpoch: number = 0;
  public maxEpochs: number = 0;

  public gradientChartOptionsConfigurationWithTooltipRed: any;
  public metricChartOptions: any;
  public smallMetricChartOptions: any;
  public smallMetricCharts: any = [];
  public metricChartConfig: any;
  public metricsCanvas: any;
  public metricsCtx;
  public metricLabels = [];
  public metricsChart;
  public selectedChartMetric: string = "none";

  public openMetricsChart: boolean = false;
  public firstTraining: boolean = false;

  public loginWarning: boolean = false;

  constructor(private toastr: ToastrService,private cookieService:CookieService, private signal : SignalRService,private http:HttpClient, private loginService: LoginService, private notify: NotificationsService) { }

  configuration = new Configuration();


  clearEverything() {
    this.problemType = "Regression";
    this.encodingType = "label";
    this.activationFunction = "sigmoid";
    this.optimizer = "Adam";
    this.learningRate = 0.0001;
    this.regularization = "None";
    this.regularizationRate = 0;
    this.metrics = [];
    this.epochs = 100;
    this.range = 80;
    this.experimentName = "";
    this.checkProblemType();

    this.selectedMetric = "loss";
    this.trained = false;
    this.training = false;

    this.layerList = [];
    this.neuronsList = [1,1,1,1,1,1,1,1];
    this.layer.id = 1;
    this.layerList.push(this.layer);

    this.layersLabel = 1;

    this.liveData = {};
    this.chartData = {};
    
    this.parameters = {};
    this.modelsList = [];
    this.modelsTrained = 0;
    this.modelsHeader = [];
    this.selectedEpoch = 0;
    this.maxEpochs = 0;

    this.metricLabels = [];
    this.selectedChartMetric = "none";

    this.openMetricsChart = false;
    this.firstTraining = false;
  
    this.loginWarning = false;
  }
  
  ngOnInit() {
    
    this.loggedUser = this.loginService.isAuthenticated();
    this.checkStorage();
    this.startConnection();
    this.addTrainingDataListener();

    this.multiselect();
    this.checkProblemType();

    this.chartData = {};

    if(sessionStorage.getItem('numLayers'))
    {
      var numLayer = Number(sessionStorage.getItem('numLayers'));
      for(let i=0;i<numLayer;i++){
        this.layersLabel = i + 1;
        this.layer = new layer(this.layersLabel);
        this.layerList.push(this.layer);
      }

      if(sessionStorage.getItem('neuronsList'))
      {
        var list = []; 
        list = JSON.parse(sessionStorage.getItem('neuronsList'));

        for(let i=0;i<numLayer;i++){
          this.neuronsList[i] = list[i];
          this.neuron = new neuron(this.neuronsList[i]);
        }
      }

    }
    else {
      this.layer.id = 1;
      this.layerList.push(this.layer);
    }
    

    this.gradientChartOptionsConfigurationWithTooltipRed = {
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
          },
          scaleLabel: {
            display: true,
            labelString: "Values",
            fontColor : "#ffffff"
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
          },
          scaleLabel: {
            display: true,
            labelString: "Epochs",
            fontColor : "#ffffff"
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
      options: this.gradientChartOptionsConfigurationWithTooltipRed
    };
    this.myChartData = new Chart(this.ctx, config);

    this.configureGraph();
  }
  
  configureGraph() {
    this.metricChartOptions = {
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
          },
          scaleLabel: {
            display: true,
            labelString: "Values",
            fontColor : "#ffffff"
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
          },
          scaleLabel: {
            display: true,
            labelString: "Epochs",
            fontColor : "#ffffff"
          }
        }]
      }
    };

    this.metricsCanvas = document.getElementById("metric-chart");
    this.metricsCtx = this.metricsCanvas.getContext("2d");

    this.metricChartConfig = {
      type : "line",
      data : {},
      options: this.metricChartOptions
    };
    
    this.metricsChart = new Chart(this.metricsCtx, this.metricChartConfig);

    this.smallMetricChartOptions = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      responsive: true,
      tooltip : {
        enabled: false
      },
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            display : false
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e"
          },
          display : false
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            display : false
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          },
          display : false
        }]
      }
    };


  }

  get() {
    return sessionStorage.getItem('username');
  }

  onLogout() {
    this.cookieService.deleteAll();
  }

  increaseLayers(){
    if(this.layersLabel < 8) {
      this.layersLabel++;
      this.layer = new layer(this.layersLabel);
      this.layerList.push(this.layer);
      sessionStorage.setItem('numLayers', (this.layerList.length).toString())
    }
  }

  decreaseLayers(index){
    if(this.layersLabel > 1) {
      this.layersLabel--;
      this.layerList.splice(index);
      this.neuronsList[index] = 1;
      sessionStorage.setItem('numLayers', (this.layerList.length).toString())
      sessionStorage.setItem('neuronsList', JSON.stringify(this.neuronsList));
    }
  }

  increaseNeurons(index){
    this.neuronsList[index]++;
    this.neuron = new neuron(this.neuronsList[index]);
    sessionStorage.setItem('neuronsList', JSON.stringify(this.neuronsList));
  }

  decreaseNeurons(index, i){
    if(this.neuronsList[index] > 1){
      this.neuronsList[index]--;
      sessionStorage.setItem('neuronsList', JSON.stringify(this.neuronsList));
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
    sessionStorage.setItem('problemType', this.problemType);
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

  checkBeforeTraining() {
    if(!this.loggedUser) {
      if(!this.firstTraining) {
        this.loginWarning = true;
      }
      else {
        this.startTraining();
      }
    }
    else {
      this.startTraining();
    }
  }

  startTraining() {
    if(sessionStorage.getItem('output') == null || sessionStorage.getItem('inputList') == null) {
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Input or output not selected</b>.', '', {
        disableTimeOut: false,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-top-center'
      });
      return;
    }
    this.loginWarning = false;
    this.chartData = {};
    this.training = true;
    this.firstTraining = true;
    let fileName = this.cookieService.get('filename');
    let connID = this.cookieService.get('connID');
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
    this.parameters = {"connID" : connID, "fileName" : fileName, 'inputList' : inputList, 'output' : output, 'encodingType' : this.encodingType, 'ratio' : 1 - (1 * (this.range/100)), 'numLayers' : this.layersLabel, 'layerList' : layerList, 'activationFunction' : this.activationFunction, 'regularization' : this.regularization, 'regularizationRate' : this.regularizationRate, 'optimizer' : this.optimizer, 'learningRate' : this.learningRate, 'problemType' : this.problemType, 'lossFunction' : this.lossFunction, 'metrics' : metrics, 'numEpochs' : this.epochs};
    //console.log({"fileName" : fileName, 'inputList' : inputList, 'output' : output, 'encodingType' : this.encodingType, 'ratio' : 1 - (1 * (this.range/100)), 'numLayers' : this.layersLabel, 'layerList' : layerList, 'activationFunction' : this.activationFunction, 'regularization' : this.regularization, 'regularizationRate' : this.regularizationRate, 'optimizer' : this.optimizer, 'learningRate' : this.learningRate, 'problemType' : this.problemType, 'lossFunction' : this.lossFunction, 'metrics' : metrics, 'numEpochs' : this.epochs});
    this.http.post(this.configuration.startTesting, this.parameters).subscribe(
      (response) => {
        this.modelsTrained++;
        
        if(this.epochs > this.maxEpochs) {
          this.maxEpochs = this.epochs;
          for (let i = 0; i < this.maxEpochs; i++){
            this.metricLabels[i] = i+1;
          }
        }

        this.modelsHeader = [];
        for (let i = 0; i < this.selectedItems.length; i++) {
          this.modelsHeader.push(this.selectedItems[i]['item_id']);
          this.modelsHeader.push('val_' + this.selectedItems[i]['item_id']);
        }
        this.notify.showNotification("Training started successfully!");
      }
    );
  }

  saveExperiment() {
    let token: string;

    if (this.loggedUser) {
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
      'numEpochs' : +this.epochs,
      'results' : JSON.stringify(this.chartData)
    }
    /*
          SLANJE ZAHTEVA
    */
    this.http.post(this.configuration.saveExperiment, experiment, options).subscribe(
      (response) => {
        this.notify.showNotification("Experiment saved to your profile successfully!");
      }
    );
  }

  changeData(name){
    this.selectedMetric = name;
    this.data = this.chartData[name];
    this.val_data = this.chartData['val_' + name];
    this.label = name;
    this.val_label = 'val_' + name;
    this.updateOptions();
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  checkStorage()
  {
    if(sessionStorage.getItem('problemType'))
    {
      this.problemType = sessionStorage.getItem('problemType');
    }
    if(sessionStorage.getItem('encoding'))
    {
      this.encodingType = sessionStorage.getItem('encoding');
    }
    if(sessionStorage.getItem('optimizer'))
    {
      this.optimizer = sessionStorage.getItem('optimizer');
    }
    if(sessionStorage.getItem('regularization'))
    {
      this.regularization = sessionStorage.getItem('regularization');
    }
    if(sessionStorage.getItem('lossFunction'))
    {
      this.lossFunction = sessionStorage.getItem('lossFunction');
    }
    if(sessionStorage.getItem('range'))
    {
      this.range = Number(sessionStorage.getItem('range'));
    }
    if(sessionStorage.getItem('activationFunction'))
    {
      this.activationFunction = sessionStorage.getItem('activationFunction');
    }
    if(sessionStorage.getItem('learningRate'))
    {
      this.learningRate = Number(sessionStorage.getItem('learningRate'));
    }
    if(sessionStorage.getItem('regularizationRate'))
    {
      this.regularizationRate = Number(sessionStorage.getItem('regularizationRate'));
    }
    if(sessionStorage.getItem('epochs'))
    {
      this.epochs = Number(sessionStorage.getItem('epochs'));
    }
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

  onSelected(event : any)
  {
    const target = event.target.name;
    const value = event.target.value;
    if(target == "encodingType")
    {
      this.encodingType = value;
      sessionStorage.setItem('encoding', this.encodingType);
    }
    else if(target == "optimizer")
    {
      this.optimizer = value;
      sessionStorage.setItem('optimizer', this.optimizer);
    }
    else if(target == "regularization")
    {
      this.regularization = value;
      sessionStorage.setItem('regularization', this.regularization);
    }
    else if(target == "lossFunction")
    {
      this.lossFunction = value;
      sessionStorage.setItem('lossFunction', this.lossFunction);
    }
    else if(target == "range")
    {
      this.range = value;
      sessionStorage.setItem('range', (this.range).toString());
    }
    else if(target == "activationFunction")
    {
      this.activationFunction = value;
      sessionStorage.setItem('activationFunction', this.activationFunction);
    }
    else if(target == "learningRate")
    {
      this.learningRate = value;
      sessionStorage.setItem('learningRate', (this.learningRate).toString());
    }
    else if(target == "regularizationRate")
    {
      this.regularizationRate = value;
      sessionStorage.setItem('regularizationRate', (this.regularizationRate).toString());
    }
    else if(target == "epochs")
    {
      this.epochs = value;
      sessionStorage.setItem('epochs', (this.epochs).toString());
    }
  }

  nextPage(step){
    if(this.selectedEpoch < this.maxEpochs) {
      this.selectedEpoch+= step;
    }
  }

  previousPage(step){
    if(this.selectedEpoch > 0){
      this.selectedEpoch-= step;
    }
  }

  firstPage(){
    this.selectedEpoch = 0;
  }

  lastPage(){
    this.selectedEpoch = this.maxEpochs-1;
  }

  chartThisMetric(metric : string){
    this.openMetricsChart = true;
    this.selectedChartMetric = metric;

    this.metricsChart.data.labels = this.metricLabels;
    this.metricsChart.data.datasets = [];

    for (let i = 0; i < this.modelsList.length; i++) {
      //console.log(this.modelsList[i].data);
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);

      this.metricsChart.data.datasets.push({
        label: "model " + this.modelsList[i].id,
        fill: false,
        borderColor: "rgb(" + r + "," + g + "," + b + ")",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "rgb(" + r + "," + g + "," + b + ")",
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: "rgb(" + r + "," + g + "," + b + ")",
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: this.modelsList[i].data[metric],
      });
    }

    this.metricsChart.options.scales.yAxes[0].scaleLabel.labelString = metric;
    this.metricsChart.update();
  }

  makeSmallCharts(id: number, epochs: number) {
    var smallMetricCanvas: any;
    var smallMetricCtx: any;
    for (let i = 0; i < this.modelsHeader.length; i++) {
      smallMetricCanvas = document.getElementById(this.modelsHeader[i] + "-chart");
      console.log(smallMetricCanvas);
      smallMetricCtx = smallMetricCanvas.getContext("2d");
      console.log(this.modelsHeader[i] + "-chart");

      var smallMetricLabels = []


      for(let i = 0; i < epochs; i++) {
        smallMetricLabels.push(i);
      }

      var data = {
        labels: smallMetricLabels,
        datasets: [{
          label: "label",
          fill: false,
          backgroundColor: '#ffffff',
          borderColor: '#00d6b4',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#00d6b4',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#00d6b4',
          pointBorderWidth: 0,
          pointHoverRadius: 0,
          pointHoverBorderWidth: 0,
          pointRadius: 0,
          data: this.modelsList[id].data[this.modelsHeader[i]],
        }]
      };

      var smallMetricChartConfig = {
        type : "line",
        data : data,
        options: this.smallMetricChartOptions
      };
      
      this.smallMetricCharts[id] = new Chart(smallMetricCtx, smallMetricChartConfig);
      this.smallMetricCharts[id].update();
    }
  }

  //SOKETI

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.configuration.port + "/chatHub")
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferDataListener = () => {
    this.hubConnection.on('ReceiveConnID', (data) => {
    });
  }

  public getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid').then(
      (data) => {
          this.connectionId = data;
          this.cookieService.set("connID", this.connectionId);
        }
    ); 
  }

  public addTrainingDataListener = () => {
    this.hubConnection.on('trainingdata', (data) => {
      if(data['ended'] == 0) {
        this.liveData = data;
        this.chartData = this.liveData['trainingData'];
        this.buttons = Object.keys(this.chartData);
        this.buttons.splice(this.buttons.length/2);
        this.data = this.chartData[this.selectedMetric];
        this.val_data = this.chartData['val_'+this.selectedMetric];
        this.chart_labels = [];
        for (let i = 0; i < this.data.length; i++) {
          this.chart_labels[i] = i + 1;
        }
        this.updateOptions();
      }
      else {
        this.training = false;
        this.trained = true;

        var newModel = new trainedModel(this.modelsTrained, this.parameters);
        this.modelsList.push(newModel);
        this.modelsList[this.modelsTrained-1].data = this.chartData;

        if(this.selectedChartMetric == "none"){
          this.chartThisMetric(this.modelsHeader[0]);
        }
        else {
          this.chartThisMetric(this.selectedChartMetric);
        }
        //this.makeSmallCharts(this.modelsTrained-1, data["epochs"]);
      }
    });
  }
}
