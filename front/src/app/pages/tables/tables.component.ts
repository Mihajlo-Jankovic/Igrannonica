import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { TableService } from 'src/app/services/table.service';
import { CookieService } from "ngx-cookie-service";
import { Configuration } from "src/app/configuration";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Chart from 'chart.js';

import {
  ChartComponent,
  ApexChart,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexAxisChartSeries,
  ApexStroke,
  ApexTooltip
} from "ng-apexcharts";
import { NotificationsService } from "src/app/services/notifications.service";
import { LanguageService } from "src/app/services/language.service";

declare function myFunc(): any;

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  tooltip: ApexTooltip
};

@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html",
  styleUrls: ["tables.component.scss"]
})
export class TablesComponent {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  csv = {
    'csv': {}, //podaci za ucitavanje tabele
    'numOfPages': 0,
    'numericValues': {}, //numericke kolone
    'colName': []
  }

  data = {
    'columns': [],
    'index': [],
    'data': []
  }

  numericValues = {
    'col': [],
    'index': []
  }

  statistic = {
    'colList': [],
    'jsonList': []
  }

  statisticData = {
    'rowsNum': 0,
    'min': 0,
    'max': 0,
    'avg': 0,
    'med': 0,
    'firstQ': 0,
    'thirdQ': 0,
    'corrMatrix': {},
    'fullCorrMatrix': {}
  }

  fullMatrixData = {
    'columns': [],
    'values': []
  }

  column = {
    'id': 0,
    'colName': "",
    'isSelected': false,
    'isNum': false,
    'encoding': "",
    'encList': [],
    'output': false
  }

  //data: any = { "columns": ["title", "genre", "description", "director", "actors", "year", "runtime_(minutes)", "rating", "votes", "revenue_(millions)", "metascore"], "index": [1, 2, 3, 4, 5], "data": [["Guardians of the Galaxy", "Action,Adventure,Sci-Fi", "A group of intergalactic criminals are forced to work together to stop a fanatical warrior from taking control of the universe.", "James Gunn", "Chris Pratt, Vin Diesel, Bradley Cooper, Zoe Saldana", 2014, 121, 8.1, 757074, 333.13, 76], ["Prometheus", "Adventure,Mystery,Sci-Fi", "Following clues to the origin of mankind, a team finds a structure on a distant moon, but they soon realize they are not alone.", "Ridley Scott", "Noomi Rapace, Logan Marshall-Green, Michael Fassbender, Charlize Theron", 2012, 124, 7.0, 485820, 126.46, 65], ["Split", "Horror,Thriller", "Three girls are kidnapped by a man with a diagnosed 23 distinct personalities. They must try to escape before the apparent emergence of a frightful new 24th.", "M. Night Shyamalan", "James McAvoy, Anya Taylor-Joy, Haley Lu Richardson, Jessica Sula", 2016, 117, 7.3, 157606, 138.12, 62], ["Sing", "Animation,Comedy,Family", "In a city of humanoid animals, a hustling theater impresario's attempt to save his theater with a singing competition becomes grander than he anticipates even as its finalists' find that their lives will never be the same.", "Christophe Lourdelet", "Matthew McConaughey,Reese Witherspoon, Seth MacFarlane, Scarlett Johansson", 2016, 108, 7.2, 60545, 270.32, 59], ["Suicide Squad", "Action,Adventure,Fantasy", "A secret government agency recruits some of the most dangerous incarcerated super-villains to form a defensive task force. Their first mission: save the world from the apocalypse.", "David Ayer", "Will Smith, Jared Leto, Margot Robbie, Viola Davis", 2016, 123, 6.2, 393727, 325.02, 40]] }

  showIO: boolean = false;
  opndMatrix: boolean = false;

  headingLines: any = [];
  numberData: any = [];
  numberLines: any = [];
  rowLines: any = [];
  numericValuesArray: any = [];
  fullCorrColNamesArray: any = []; //niz za kor matricu (nazivi kolona)
  fullCorrValArray: any = []; // niz za kor matricu (vrednosti)

  radios: any = [];
  checks: any = [];
  radios1: any = [];
  checks1: any = [];
  pret: number = -1;

  selectedType: string = "all";
  selectedRow: number = 10;
  selectedColName: string = "";
  selectedCol: number;
  selectedColDiv: boolean = false;

  deleteIndicator: boolean = false;

  listCheckedI: any = [];
  disabledOutput: any;

  selectedOutput: any;
  checked: any;
  selectedRows: Array<number> = [];

  page: number = 1;
  maxPage: any = 1000;

  showStatisticDiv: boolean = false;

  rowsNum: number;
  min: number;
  max: number;
  avg: number;
  med: number;
  firstQ: number;
  thirdQ: number;
  corrMatrix: any = {};
  mixArray: any = []; //niz za boxplot
  numArray: any = []; //niz za kor matricu
  outliers: any = [];

  stdev: any;
  iqr: any;
  isNumCol: any;
  frequency: string;
  mostFrequent: any;
  numOfNulls: any;
  unique: any;

  arrNum: any = [];
  arrMin: any = [];
  arrQ1: any = [];
  arrMean: any = [];
  arrMedian: any = [];
  arrQ3: any = [];
  arrMax: any = [];
  arrStDev: any = [];
  arrIQR: any = [];
  colListData: any = [];
  numOfOutliers: any;
  arrFrequency: any = [];
  arrMostFrequent: any = [];
  arrNumOfNulls: any = [];
  arrUnique: any = [];
  arrMissingValues: any = [];
  arrAllOutliers: any = [];

  hideStatistics: boolean = false;
  hideBoxplot: boolean = false;
  hideMatrix: boolean = false;

  public poruka: string;



  X: boolean = true;
  ioSelection: boolean = false;
  encoding: boolean = false;
  dataPreprocessing: boolean = false;

  plotButton: string = "Pie Chart"
  public canvas: any;
  public ctx;
  pieChart: any;
  differentValues = true;
  showPieChart: boolean = false;

  //*
  notChecked: boolean = false;
  encodingList = ["label", "one-hot", "binary", "frequency"];
  colDataList: any = [];
  //*

  //*
  missingValuesList = [];
  fillMissingValuesListNum = ["none", "min", "max", "mean", "median", "firstQ", "thirdQ", "stdev", "iqr", "deleteAll"];
  fillMissingValuesListNonNum = ["none", "mostFrequent", "deleteAll"];
  selectedMissingValCol: string;
  selectedMissingValColBoolean: boolean = true;
  selectedToFillMissingValCol: string;
  enteredToFillMissingValCol: string = "";

  selectedOutliersCol: string;
  selectedToReplaceOutliers: any;
  replaceOutliersList = ["none", "min", "max", "mean", "median", "firstQ", "thirdQ", "stdev", "iqr", "deleteAll"];
  enteredToReplaceOutliersCol: string = "";
  selectedOutliersRows: any = [];
  //*

  selectedOutlierColumn: string = "";

  deleteWarning: boolean = false;

  filter = 0;

  token: string;
  cookieCheck: any;
  configuration = new Configuration();

  //*
  numCol: boolean; //za prikaz numerickih/nenumerickih - statistika
  numCol1: boolean = true; //za prikaz numerickih/nenumerickih - missingValues
  numCol2: boolean;
  //*

  buttonMissingValues = "Replace";
  buttonOutliers = "Replace";

  public message:string;
  public message2:string;

  statsButton="Full Statistics" ;
  matrixButton= "Full Matrix";

  colNameArray: any = [];

  constructor(public lang: LanguageService, private tableService: TableService, private cookie: CookieService, private toastr: ToastrService, private http: HttpClient, private router: Router, private notify: NotificationsService) {
    sessionStorage.removeItem('statistics');
    this.cookieCheck = this.cookie.get('cortexToken');
    this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
    this.boxPlotFun();

  }

  ngOnInit() {
    this.lang.lanClickedEvent.subscribe((data:string) =>{
      this.message = data;
      if(data == 'sr')
      this.message2 = "sr";
      else if(data == "en")
      this.message2 = "en";
      if(this.message == "sr") {
        this.statsButton="Cela statistika";
      }
      else{
        this.statsButton = "Full Statistics";
      }

      if(this.message == "sr") this.matrixButton="Cela matrica";
      else{
        this.matrixButton = "Full Matrix";
      }

      if(this.message == "sr"){
        this.buttonMissingValues = "Zameni";
      }
      else{
        this.buttonMissingValues = "Replace";
      }

      if(this.message == "sr"){
        this.buttonOutliers = "Zameni";
      }
      else{
        this.buttonOutliers = "Replace";
      }
    });
    this.message = sessionStorage.getItem("lang");
    console.log(this.message2);
   

    sessionStorage.setItem('lastPage', 'datapreview');
    if (this.cookieCheck) {
      this.refreshToken();
    }
    this.chartConfig();

    this.clearStorage();
    this.reset();
    this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
  }

  chartConfig() {
    setTimeout(() => {
      this.canvas = document.getElementById("pie-chart");
      this.ctx = this.canvas.getContext("2d");

      const pieOptions = {
        maintainAspectRatio: false,
        legend: {
          display: false
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
        responsive: true
      }

      const config = {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: []
          }]
        },
        options: pieOptions
      };

      this.pieChart = new Chart(this.ctx, config);
    }, 50);
  }

  plotCheck() {
    if (this.plotButton == 'Pie Chart') {
      this.plotButton = 'Box Plot'
      this.updatePieChart();
    }
    else {
      this.plotButton = 'Pie Chart';
      this.differentValues = true;
      this.showPieChart = false;
    }
  }

  selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},75%,50%)`;
  }

  updatePieChart() {
    if (this.canvas == null) {
      this.chartConfig();
    }

    var index = this.statistic['colList'].indexOf(this.selectedColName, 0);
    var uniqueList = this.statistic['jsonList'][index]['uniqueList'];

    if (Object.keys(uniqueList).length < 100) {
      this.differentValues = true;
      this.showPieChart = true;
      this.pieChart.data.labels = Object.keys(uniqueList);
      this.pieChart.data.datasets[0].data = Object.values(uniqueList);
      this.pieChart.data.datasets[0].backgroundColor = [];
      for (let i = 0; i < Object.values(uniqueList).length; i++) {
        // var r = Math.floor(Math.random() * 255);
        // var g = Math.floor(Math.random() * 255);
        // var b = Math.floor(Math.random() * 255);

        this.pieChart.data.datasets[0].backgroundColor[i] = this.selectColor(i);
        //"rgb(" + r + "," + g + "," + b + ")";
      }
      this.pieChart.update();
    }
    else {
      this.differentValues = false;
      this.showPieChart = false;
    }

  }

  getFileName() {
    return sessionStorage.getItem("realName");
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

  clearStorage() {
    sessionStorage.removeItem('csv');
    sessionStorage.removeItem('numOfPages');
    sessionStorage.removeItem('numericValues');
  }

  showTable(type: string, rows: number, page: number, filter: boolean, outlierColumn: string) {
    if (sessionStorage.getItem('csv') != null) {
      if (sessionStorage.getItem('selectedType') && sessionStorage.getItem('selectedType') != type) {
        this.selectedType = sessionStorage.getItem('selectedType');

        let filename = sessionStorage.getItem('filename');
        this.tableService.getAll(filename, this.selectedType, rows, page, sessionStorage.getItem('selectedOutlierColumn')).subscribe(
          (response) => {
            this.csv = response;
            let dataCSV: any = {};
            dataCSV = this.csv['csv'];
            this.data = dataCSV;

            sessionStorage.setItem('csv', JSON.stringify(this.data));

            this.maxPage = this.csv['numOfPages'];
            sessionStorage.setItem('numOfPages', this.maxPage);

            //ucitavanje numericValues
            let numerValuesCSV: any = {};
            numerValuesCSV = this.csv['numericValues'];
            this.numericValues = numerValuesCSV;

            sessionStorage.setItem('numericValues', JSON.stringify(this.numericValues));
            this.selectedOutlierColumn = sessionStorage.getItem('selectedOutlierColumn');

            this.colNameArray = this.csv['colList'];
            sessionStorage.setItem('colNameArray', JSON.stringify(this.colNameArray));
            
            this.loadTable(filter);
          }, err => {
            let JSONtoken: string = JSON.stringify(err.error);
            let StringToken = JSON.parse(JSONtoken).responseMessage;
            if (StringToken == "Error encountered while reading dataset content.") {
              this.poruka = "Error encoundered while reading dataset content";
              if(this.message == "sr") this.poruka = "Došlo je do greške pri čitanju sadržaja skupa podataka";
              this.notify.showNotification(this.poruka);
            }
          })
      }
      else {
        let dataCSV: any = {};
        dataCSV = JSON.parse(sessionStorage.getItem('csv'));
        this.data = dataCSV;
        this.maxPage = sessionStorage.getItem('numOfPages');
        this.numericValues = JSON.parse(sessionStorage.getItem('numericValues'));
        this.loadTable(filter);
      }
    }
    else {
      let filename = sessionStorage.getItem('filename');
      this.tableService.getAll(filename, type, rows, page, outlierColumn).subscribe(
        (response) => {
          this.csv = response;
          let dataCSV: any = {};
          dataCSV = this.csv['csv'];
          this.data = dataCSV;

          sessionStorage.setItem('csv', JSON.stringify(this.data));

          this.maxPage = this.csv['numOfPages'];
          sessionStorage.setItem('numOfPages', this.maxPage);

          //ucitavanje numericValues
          let numerValuesCSV: any = {};
          numerValuesCSV = this.csv['numericValues'];
          this.numericValues = numerValuesCSV;
          
          sessionStorage.setItem('numericValues', JSON.stringify(this.numericValues));

          this.colNameArray = this.csv['colList'];
          sessionStorage.setItem('colNameArray', JSON.stringify(this.colNameArray));

          this.loadTable(filter);
        }, err => {
          let JSONtoken: string = JSON.stringify(err.error);
          let StringToken = JSON.parse(JSONtoken).responseMessage;
          if (StringToken == "Error encoundered while reading dataset content.") {
            this.poruka = "Error encoundered while reading dataset content";
            if(this.message == "sr") this.poruka = "Došlo je do greške pri čitanju sadržaja skupa podataka";
            this.notify.showNotification(this.poruka);
          }
        })
    }
  }

  public loadTable(filter: boolean) {
    let headersArray: any = [];
    for (let i = 0; i < this.data['columns'].length; i++) {
      headersArray.push(this.data['columns'][i]);
    }
    this.headingLines.push(headersArray);

    let index = [];
    for (let i = 0; i < this.data['index'].length; i++) {
      index.push([i]);
    }
    this.numberLines.push(index);

    let dataArr = [];
    for (let i = 0; i < this.data['columns'].length; i++) {
      dataArr.push([i]);
    }
    this.numberData.push(dataArr);

    let rowsArray = [];
    for (let i = 0; i < this.data['data'].length; i++) {
      rowsArray.push(this.data['data'][i]);
    }
    this.rowLines.push(rowsArray);

    let numValueIndexArray: any = [];
    this.numericValuesArray = [];
    for (let i = 0; i < this.numericValues['col'].length; i++) {
      numValueIndexArray = [];
      numValueIndexArray.push(this.numericValues['col'][i]);
      numValueIndexArray.push(this.numericValues['index'][i]);
      this.numericValuesArray.push(numValueIndexArray);
    }

    this.colNameArray = JSON.parse(sessionStorage.getItem('colNameArray'));
    if (!filter) {
      this.selectedColName = this.colNameArray[0];
      this.selectedCol = this.numericValuesArray[0][1];
      this.selectedColDiv = true;
    }
    this.numCol2 = this.isNumericFun(this.selectedColName);

    if (!filter) {
      //this.showStatisticDiv = true;
      this.showStatistics(this.selectedColName, true);
    }
    //*
    this.setInputOutput();
    //*
  }

  setInputOutput() {
    if (sessionStorage.getItem("inputList") == null) {
      for (let i = 0; i < this.colNameArray.length - 1; i++) {
        this.radios[i] = true; //disabled
        this.checks[i] = false; //disabled
        this.radios1[i] = false; //checked
        this.checks1[i] = true; //checked
        this.listCheckedI.push(this.colNameArray[i])
      }

      this.checks[this.colNameArray.length - 1] = true;
      this.checks1[this.colNameArray.length - 1] = false;
      this.listCheckedI.splice(this.colNameArray.length - 1, 1);
      sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));

      this.radios[this.colNameArray.length - 1] = false;
      this.radios1[this.colNameArray.length - 1] = true;
      this.selectedOutput = this.colNameArray[this.colNameArray.length - 1];
      sessionStorage.setItem('output', this.selectedOutput);
      this.pret = this.colNameArray.length - 1;
      this.setEncoding();
      this.outputStorage();
    }
    else {
      this.listCheckedI = JSON.parse(sessionStorage.getItem('inputList'));
      this.selectedOutput = sessionStorage.getItem('output');

      let f: number = 0;
      for (let i = 0; i < this.colNameArray.length; i++) {
        f = 0;
        for (let j = 0; j < this.listCheckedI.length; j++) {
          if (this.colNameArray[i] == this.listCheckedI[j]) {
            this.checks1[i] = true;
            this.checks[i] = false;
            this.radios1[i] = false;
            this.radios[i] = true;
            f = 1;
          }
        }
        if (f == 0) {
          if (this.colNameArray[i] == this.selectedOutput) {
            this.checks1[i] = false;
            this.checks[i] = true;
            this.radios1[i] = true;
            this.radios[i] = false;
          }
          else {
            this.radios[i] = false;
            this.checks[i] = false;
            this.radios1[i] = false;
            this.checks1[i] = false;
          }
        }
      }
      sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));
      sessionStorage.setItem('output', this.selectedOutput);
      this.updateEncoding();
    }
  }
  //*
  setEncoding() {
    for (let i = 0; i < this.colNameArray.length - 1; i++) {
      let f: any = 0;
      this.restartColData();

      for (let j = 0; j < this.numericValues['col'].length; j++) {
        if (this.numericValues['col'][j] == this.colNameArray[i]) {
          this.column['encoding'] = "none";
          f = 1;
        }
      }

      if (f == 0) {
        this.column['encoding'] = this.encodingList[0];
      }
      this.column['id'] = i;
      this.column['colName'] = this.colNameArray[i];
      this.column['isSelected'] = true;
      this.column['isNum'] = this.isNumericFun(this.colNameArray[i]);
      this.column['encList'] = this.getSelectedEnc(this.column['isNum'], this.column['encoding']);
      this.column['output'] = false;
      this.colDataList.push(this.column);
    }

    let f: any = 0;
    this.restartColData();
    this.column['id'] = this.colNameArray.length - 1;
    this.column['colName'] = this.colNameArray[this.colNameArray.length - 1];
    this.column['isSelected'] = true;
    this.column['isNum'] = this.isNumericFun(this.colNameArray[this.colNameArray.length - 1]);
    /*
    f = 0;
    for(let j = 0; j < this.numericValues['col'].length; j++) {
      if(this.numericValues['col'][j] == this.headingLines[0][this.headingLines[0].length-2]) {
        this.column['encoding'] = "none";
        f = 1;
      }
    }
    if(f == 0) {
      this.column['encoding'] = this.encoding[0];
    }
    */
    this.column['encoding'] = this.encoding[0];
    this.column['encList'] = this.getSelectedEnc(this.column['isNum'], this.column['encoding']);
    this.column['output'] = true;
    this.colDataList.push(this.column);

    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
  }

  isNumericFun(colName: any) {
    for (let i = 0; i < this.numericValues['col'].length; i++) {
      if (this.numericValues['col'][i] == colName) {
        return true;
      }
    }
    return false;
  }

  restartColData() {
    this.column = {
      'id': 0,
      'colName': "",
      'isSelected': false,
      'isNum': false,
      'encoding': "",
      'encList': [],
      'output': false
    };
  }
  //*

  public onSelectedType(event: any, filter: boolean) {
    this.page = 1;
    const value = event.target.value;
    this.selectedType = value;
    sessionStorage.setItem('selectedType', this.selectedType);
    this.clearStorage();
    this.reset();
    if (this.selectedType == 'outlier') {
      this.selectedOutlierColumn = this.numericValues['col'][0];
      sessionStorage.setItem('selectedOutlierColumn', this.selectedOutlierColumn);
    }
    this.showTable(this.selectedType, this.selectedRow, this.page, filter, this.selectedOutlierColumn);
  }

  public onSelectedRow(event: any, filter: boolean) {
    this.page = 1;
    const value = event.target.value;
    this.selectedRow = value;
    this.clearStorage();
    this.reset();
    this.showTable(this.selectedType, this.selectedRow, this.page, filter, this.selectedOutlierColumn);
  }

  public onSelectedOutlierColumn(event: any, filter: boolean) {
    this.page = 1;
    const value = event.target.value;
    this.selectedOutlierColumn = value;
    sessionStorage.setItem('selectedOutlierColumn', this.selectedOutlierColumn);
    this.clearStorage();
    this.reset();
    this.showTable(this.selectedType, this.selectedRow, this.page, filter, this.selectedOutlierColumn);
  }

  reset() {
    this.headingLines = [];
    this.numberData = [];
    this.numberLines = [];
    this.rowLines = [];
  }

  showStatistics(col: string, flag1: boolean) {
    if (sessionStorage.getItem('statistics') && flag1 == false) {
      //this.statisticData = JSON.parse(sessionStorage.getItem('statistics'));
      //this.loadStatistics();
      this.statistic = JSON.parse(sessionStorage.getItem('statistics'));
      this.loadStatistics(col);
      this.setMissingValuesandOutliers();
    }
    else {
      let filename = sessionStorage.getItem('filename');
      this.tableService.getStatistics(filename, 0).subscribe(
        (response) => {
          this.statistic = response;
          this.showStatisticDiv = true;
          sessionStorage.setItem('statistics', JSON.stringify(this.statistic));
          this.loadStatistics(col);
          this.setMissingValuesandOutliers();
          this.boxPlotFun();
        }, err => {
          let JSONtoken: string = JSON.stringify(err.error);
          let StringToken = JSON.parse(JSONtoken).responseMessage;
          if (StringToken == "Error encoundered while calculating statistics.") {
            this.poruka = "Error encoundered while calculating statistics";
            if(this.message == "sr") this.poruka = "Došlo je do greške pri izračunavanju statistike";
            this.notify.showNotification(this.poruka);
          }
        })
    }
  }

  public setNumCol() {
    let x = this.statistic['jsonList'][0];
    if (x['isNumeric'] == 1)
      this.numCol = true;
    else
      this.numCol = false;
  }

  public loadStatistics(col: string) {
    this.colListData = [];
    for (let i = 0; i < this.statistic['colList'].length; i++) {
      this.colListData.push(this.statistic['colList'][i]);
    }

    this.arrNum = [];
    for (let i = 0; i < this.statistic['jsonList'].length; i++) {
      this.arrNum.push(this.statistic['jsonList'][i]);
    }

    this.arrAllOutliers = [];
    for (let i = 0; i < this.statistic['jsonList'].length; i++) {
      this.statisticData = this.statistic['jsonList'][i];

      if (this.statisticData['isNumeric'] && this.statisticData['numOfOutliers']) {
        this.arrAllOutliers.push(this.statistic['colList'][i]);
      }
    }

    this.restartStat();
    for (let i = 0; i < this.arrNum.length; i++) {
      this.statisticData = this.statistic['jsonList'][i];
      if (this.statisticData['isNumeric'] == 1) {
        this.arrMin.push(this.arrNum[i]['min']);
        this.arrQ1.push(this.arrNum[i]['firstQ']);
        this.arrMean.push(this.arrNum[i]['avg']);
        this.arrMedian.push(this.arrNum[i]['med']);
        this.arrQ3.push(this.arrNum[i]['thirdQ']);
        this.arrMax.push(this.arrNum[i]['max']);
        this.arrStDev.push(this.arrNum[i]['stdev']);
        this.arrIQR.push(this.arrNum[i]['iqr']);

        this.arrFrequency.push("-");
        this.arrMostFrequent.push("-");
        this.arrUnique.push("-");
        this.arrNumOfNulls.push(this.arrNum[i]['numOfNulls']);
      }
      else {
        this.arrMin.push("-");
        this.arrQ1.push("-");
        this.arrMean.push("-");
        this.arrMedian.push("-");
        this.arrQ3.push("-");
        this.arrMax.push("-");
        this.arrStDev.push("-");
        this.arrIQR.push("-");

        this.arrFrequency.push(this.arrNum[i]['frequency']);
        this.arrMostFrequent.push(this.arrNum[i]['mostFrequent']);
        this.arrUnique.push(this.arrNum[i]['unique']);
        this.arrNumOfNulls.push(this.arrNum[i]['numOfNulls']);
      }
    }

    for (let i = 0; i < this.statistic['jsonList'].length; i++) {
      this.statisticData = this.statistic['jsonList'][i];
      if (this.statistic['colList'][i] == col) {
        if (this.statisticData['isNumeric'] == 1) {

          this.mixArray = [];
          this.rowsNum = this.statisticData['rowsNum'];
          this.min = this.statisticData['min'];
          this.mixArray.push(this.min);
          this.firstQ = this.statisticData['firstQ'];
          this.mixArray.push(this.firstQ);
          this.avg = this.statisticData['avg'];
          this.med = this.statisticData['med'];
          this.mixArray.push(this.med);
          this.thirdQ = this.statisticData['thirdQ'];
          this.mixArray.push(this.thirdQ);
          this.max = this.statisticData['max'];
          this.mixArray.push(this.max);
          this.stdev = this.statisticData['stdev'];
          this.iqr = this.statisticData['iqr'];
          this.numOfOutliers = this.statisticData['numOfOutliers'];
          this.numOfNulls = this.statisticData['numOfNulls'];

          let permName: string;
          for (let i = 0; i < this.colListData.length; i++) {
            if (this.colListData[i] == col) {
              permName = this.colListData[i];
            }
          }

          this.numArray = [];
          for (let i = 0; i < this.statisticData['corrMatrix'][permName].length; i++) {
            this.numArray.push(this.statisticData['corrMatrix'][permName][i]);
          }

          this.outliers = [];
          for (let i = 0; i < this.statisticData['outliers'].length; i++) {
            this.outliers.push(this.statisticData['outliers'][i]);
          }
          /*
          let fullMatrix: any = {};
          fullMatrix = this.statisticData['fullCorrMatrix'];
          this.fullMatrixData = fullMatrix;

          this.fullCorrColNamesArray = [];
          for (let i = 0; i < this.fullMatrixData['columns'].length; i++) {
            this.fullCorrColNamesArray.push(this.fullMatrixData['columns'][i]);
          }

          this.fullCorrValArray = [];
          let valArray: any = [];
          for (let i = 0; i < this.fullMatrixData['values'].length; i++) {
            valArray = [];

            for (let j = 0; j < this.fullMatrixData['values'][i].length; j++) {
              valArray.push(this.fullMatrixData['values'][i][j]);
            }
            this.fullCorrValArray.push(valArray);
          }*/
          this.boxPlotFun();
        }
        else {
          this.frequency = this.statisticData['frequency'];
          this.mostFrequent = this.statisticData['mostFrequent'];
          this.numOfNulls = this.statisticData['numOfNulls'];
          this.unique = this.statisticData['unique'];
        }
      }
    }

    let fullMatrix: any = {};
    fullMatrix = this.statistic['fullCorrelationMatrix'];
    this.fullMatrixData = fullMatrix;

    this.fullCorrColNamesArray = [];
    for (let i = 0; i < this.fullMatrixData['columns'].length; i++) {
      this.fullCorrColNamesArray.push(this.fullMatrixData['columns'][i]);
    }

    this.fullCorrValArray = [];
    let valArray: any = [];
    for (let i = 0; i < this.fullMatrixData['values'].length; i++) {
      valArray = [];

      for (let j = 0; j < this.fullMatrixData['values'][i].length; j++) {
        valArray.push(this.fullMatrixData['values'][i][j]);
      }
      this.fullCorrValArray.push(valArray);
    }
  }

  restartStat() {
    this.arrMin = [];
    this.arrQ1 = [];
    this.arrMean = [];
    this.arrMedian = [];
    this.arrQ3 = [];
    this.arrMax = [];
    this.arrStDev = [];
    this.arrIQR = [];
    this.arrFrequency = [];
    this.arrMostFrequent = [];
    this.arrUnique = [];
    this.arrNumOfNulls = [];
  }

  setMissingValuesandOutliers() {

    this.arrMissingValues = [];
    for (let i = 0; i < this.statistic['colList'].length; i++) {
      if (this.arrNumOfNulls[i] != 0) {
        this.arrMissingValues.push(this.statistic['colList'][i]);
      }
    }

    this.selectedMissingValCol = this.arrMissingValues[0];

    if (this.isNumericFun(this.selectedMissingValCol))
      this.numCol1 = true;
    else
      this.numCol1 = false;

    this.selectedToFillMissingValCol = this.fillMissingValuesListNonNum[0];
    this.selectedOutliersCol = this.arrAllOutliers[0];
    this.selectedToReplaceOutliers = this.fillMissingValuesListNonNum[0];
  }

  existsMissingValues() {
    for (let i = 0; i < this.arrNumOfNulls.length; i++) {
      if (this.arrNumOfNulls[i] != 0) {
        return true;
      }
    }
    return false;
  }

  existsOutliers() {

    for (let i = 0; i < this.statistic['jsonList'].length; i++) {
      let statData = this.statistic['jsonList'][i];

      if (statData['isNumeric'] == 1) {
        let outliers = [];
        for (let j = 0; j < statData['outliers'].length; j++) {
          outliers.push(statData['outliers'][j]);
          return true;
        }
      }
    }
    return false;
  }

  public onSelectedCol(event: any) {
    const value = event.target.value;
    this.selectedColName = value;
    /*
    var splitted = value.split("|", 2);
    this.selectedColName = splitted[0];
    this.selectedCol = parseInt(splitted[1]);
    sessionStorage.removeItem('statistics');
    this.resetStatistic();
    this.showStatistics(this.selectedCol);
    */
    if (this.isNumericFun(value)) {
      this.numCol2 = true;
      this.plotButton = 'Box Plot'
      this.plotCheck();
    }
    else {
      this.numCol2 = false;
      this.plotButton = "Pie Chart";
      this.plotCheck();
    }

    sessionStorage.removeItem('statistics');
    this.resetStatistic();
    this.showStatistics(value, false);
  }

  resetStatistic() {
    this.numArray = [];
    this.mixArray = [];
    this.outliers = [];
  }

  boxPlotFun() {
    this.chartOptions = {
      series: [
        {
          name: "box",
          type: "boxPlot",
          data: [
            {
              x: this.selectedColName,
              y: [this.mixArray[0], this.mixArray[1], this.mixArray[2], this.mixArray[3], this.mixArray[4]]
            },
          ]
        },
        {
          name: 'outliers',
          type: 'scatter',
          data: [{
            x: this.selectedColName,
            y: this.outliers[0]
          },
          {
            x: this.selectedColName,
            y: this.outliers[1]
          },
          {
            x: this.selectedColName,
            y: this.outliers[2]
          },
          {
            x: this.selectedColName,
            y: this.outliers[this.outliers.length - 1]
          },
          {
            x: this.selectedColName,
            y: this.outliers[this.outliers.length - 2]
          }
          ]
        }
      ],
      chart: {
        height: 350,
        type: "boxPlot",
        foreColor: '#ced4da',

        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: []
          },
          export: {
            csv: {
              filename: "boxplot",
              columnDelimiter: ',',
              headerCategory: 'category',
              headerValue: 'value',
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString()
              }
            },
            svg: {
              filename: "boxplot"
            },
            png: {
              filename: "boxplot"
            }
          },
          autoSelected: 'zoom'
        }
      },
      title: {
        text: "",
        align: "left"
      },
      plotOptions: {
        bar: {
        },
        boxPlot: {
          colors: {
            upper: "#2B908F",
            lower: "#69D2E7"
          }
        }
      },
      stroke: {
        colors: ["#FA4443"]
      },
      tooltip: {
        shared: false,
        intersect: true
      }
    };
  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  nextPage(i: number) {
    if (this.page + i <= this.maxPage) {
      this.page += i;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true, this.selectedOutlierColumn);
    }
  }

  previousPage(i: number) {
    if (this.page - i >= 1) {
      this.page -= i;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true, this.selectedOutlierColumn);
    }
  }

  firstPage() {
    if (this.page != 1) {
      this.page = 1;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true, this.selectedOutlierColumn);
    }
  }

  lastPage() {
    if (this.page != this.maxPage) {
      this.page = this.maxPage;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true, this.selectedOutlierColumn);
    }
  }

  showIOFun() {
    if (this.showIO == false)
      this.showIO = true;
    else
      this.showIO = false;
  }

  inputCheckedFun(event: any) {
    var value = event.target.value;

    //*
    if (sessionStorage.getItem('inputList')) {
      this.listCheckedI = JSON.parse(sessionStorage.getItem('inputList'));
      this.colDataList = JSON.parse(sessionStorage.getItem('columnData'));
    }
    //*

    var exists = false;
    for (let i = 0; i < this.listCheckedI.length; i++) {
      if (this.listCheckedI[i] == value) {
        var index = i;
        exists = true;
        break;
      }
    }

    //*
    this.listCheckedI = [];
    //*

    if (exists == true) {
      //*
      for (let i = 0; i < this.colDataList.length; i++) {
        if (this.colDataList[i]['colName'] == value) {
          this.colDataList[i]['isSelected'] = false;
        }
      }
      //*
    }
    else {
      //*
      for (let i = 0; i < this.colDataList.length; i++) {
        if (this.colDataList[i]['colName'] == value) {
          this.colDataList[i]['isSelected'] = true;

          if (this.colDataList[i]['isNum'])
            this.colDataList[i]['encoding'] = "none";
          else
            this.colDataList[i]['encoding'] = this.encodingList[0];

          this.colDataList[i]['encList'] = this.getSelectedEnc(this.colDataList[i]['isNum'], this.colDataList[i]['encoding']);
        }
      }
      //*
    }

    for (let i = 0; i < this.colDataList.length; i++) {
      if (this.colDataList[i]['isSelected'] == true && this.colDataList[i]['output'] == false) {
        this.listCheckedI.push(this.colDataList[i]['colName']);
      }
    }

    if (this.listCheckedI.length == 0)
      this.notChecked = true;
    else
      this.notChecked = false;

    sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));
    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
  }

  updateEncoding() {
    let f: number = 0;

    this.listCheckedI = JSON.parse(sessionStorage.getItem('inputList'));
    this.colDataList = JSON.parse(sessionStorage.getItem('columnData'));
    this.selectedOutput = sessionStorage.getItem('output');

    for (let i = 0; i < this.colDataList.length; i++) {
      f = 0;
      for (let j = 0; j < this.listCheckedI.length; j++) {
        if (this.colDataList[i]['colName'] == this.listCheckedI[j]) {
          this.colDataList[i]['isSelected'] = true;
          this.colDataList[i]['output'] = false;
          f = 1;
        }
        else if (this.colDataList[i]['colName'] == this.selectedOutput) {
          this.colDataList[i]['isSelected'] = true;
          this.colDataList[i]['output'] = true;
          f = 1;
        }
      }
      if (f == 0)
        this.colDataList[i]['isSelected'] = false;
    }

    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
    sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));
  }

  selectedOutputFun(event: any) {
    var value = event.target.value;
    var ind: number = -1;

    for (let i = 0; i < this.colNameArray.length; i++) {
      if (this.selectedOutput == this.colNameArray[i])
        ind = i;
    }

    this.pret = ind;
    this.selectedOutput = value;

    this.outputStorage();

    this.colDataList = JSON.parse(sessionStorage.getItem('columnData'));

    this.colDataList[ind]['isSelected'] = false;
    this.colDataList[ind]['output'] = false;

    for (let i = 0; i < this.colDataList.length; i++) {
      if (this.colDataList[i]['colName'] == value) {
        this.colDataList[i]['isSelected'] = true;
        this.colDataList[i]['output'] = true;
        this.colDataList[i]['encoding'] = this.encodingList[0];
        this.colDataList[i]['encList'] = this.getSelectedEnc(this.colDataList[i]['isNum'], this.colDataList[i]['encoding']);
      }
    }

    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
    sessionStorage.setItem('output', this.selectedOutput);
  }

  outputStorage() {
    for (let i = 0; i < this.statistic['colList'].length; i++) {
      if (this.statistic['colList'][i] == this.selectedOutput) {
        sessionStorage.setItem('outputValues', this.statistic['jsonList'][i]['rowsNum']);
        sessionStorage.setItem('outputUniques', this.statistic['jsonList'][i]['unique']);
        if (this.statistic['jsonList'][i]['isNumeric'] == 1) {
          sessionStorage.setItem('outputNumeric', 'true');
        }
        else {
          sessionStorage.setItem('outputNumeric', 'false');
        }
      }
    }
  }

  disableOutput(id: number) {
    this.radios[id] = !this.radios[id];
  }

  disableInput(id: number) {
    this.checks[id] = !this.checks[id];

    if (this.pret != -1) {
      this.checks[this.pret] = !this.checks[this.pret];
    }
  }

  selectedID(event, id: number) {
    if (event.target.checked) {
      this.selectedRows.push(id);
    }
    else {
      this.selectedRows.forEach((element, index) => {
        if (element == id) this.selectedRows.splice(index, 1)
      });
    }

  }

  onSelectedEnc(event: any) {
    const value = event.target.value;
    var splitted = value.split("|", 2);
    let selectedEncoding: string = splitted[0];
    let selectedcol: string = splitted[1];

    for (let i = 0; i < this.colDataList.length; i++) {
      if (this.colDataList[i]['colName'] == selectedcol) {
        this.colDataList[i]['encoding'] = selectedEncoding;
        this.colDataList[i]['encList'] = this.getSelectedEnc(this.colDataList[i]['isNum'], selectedEncoding);
      }
    }

    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
  }

  //*
  getSelectedEnc(isNum: any, encName: any) {
    let temp = [];
    if (encName == "none")
      temp.push(true, false, false, false, false);
    else if (encName == this.encodingList[0] && isNum == true)
      temp.push(false, true, false, false, false);
    else if (encName == this.encodingList[0] && isNum == false)
      temp.push(false, true, false, false, false);
    else if (encName == this.encodingList[1] && isNum == true)
      temp.push(false, false, true, false, false);
    else if (encName == this.encodingList[1] && isNum == false)
      temp.push(false, false, true, false, false);
    else if (encName == this.encodingList[2] && isNum == true)
      temp.push(false, false, false, true, false);
    else if (encName == this.encodingList[2] && isNum == false)
      temp.push(false, false, false, true, false);
    else if (encName == this.encodingList[3] && isNum == true)
      temp.push(false, false, false, false, true);
    else if (encName == this.encodingList[3] && isNum == false)
      temp.push(false, false, false, false, true);

    return temp;
  }

  async deleteRows() {

    await this.tableService.deleteRows(sessionStorage.getItem('filename'), this.selectedRows).subscribe(res => {
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
      sessionStorage.removeItem('statistics');
      this.resetStatistic();
      this.showStatistics(this.selectedColName, true);
      this.selectedRows = [];
      this.poruka = "Delete successfull";
      if(this.message == "sr") this.poruka = "Red/ovi su uspešno obrisani";
      this.notify.showNotification(this.poruka);
    }, err => {
      let JSONtoken: string = JSON.stringify(err.error);
      let StringToken = JSON.parse(JSONtoken).responseMessage;
      if (StringToken == "Error encoundered while deleting a row from the dataset.") {
        this.poruka = "Error encoundered while deleting a row from the dataset";
        if(this.message == "sr") this.poruka = "Došlo je do greške prilikom brisanja reda iz skupa podataka"
        this.notify.showNotification(this.poruka);
      }
    });
  }

  deleteCheck() {
    if (this.selectedRows.length != 0) this.deleteWarning = true;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  async editCell(id: number, value: any, columnName: string) {

    if (this.isNumericFun(columnName) && !this.isNumber(value)) {
      this.poruka = "You are trying to insert non numeric value into numeric column"
      if(this.message == "sr") this.poruka = "Pokušavate da umetnete nenumeričku vrednost u numeričku kolonu"
      this.notify.showNotification(this.poruka);
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
    }
    else {
      await this.tableService.editCell(sessionStorage.getItem('filename'), id, columnName, value).subscribe(res => {
        this.clearStorage();
        sessionStorage.removeItem('statistics');
        this.reset()
        this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
        this.resetStatistic();
        this.showStatistics(this.selectedColName, true);
        this.poruka = "Edit successfull";
        if(this.message == "sr") this.poruka = "Izmena je uspela";
        this.notify.showNotification(this.poruka);

      }, err => {
        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).responseMessage;
        if (StringToken == "Error encoundered while deleting a row from the dataset.") {
          this.poruka = "Error encoundered while editing cell content";
          if(this.message == "sr") this.poruka = "Došlo je do greške pri uređivanju sadržaja ćelije";
          this.notify.showNotification(this.poruka);
        }
      })
    }
  }

  previewMatrix() {
    // this.showToolBar = false;
    // this.boxPlotFun();
    this.opndMatrix = true;
  }

  close() {
    this.opndMatrix = false;
  }

  hideS: boolean = false;
  hideM: boolean = false;

  expandStats() {
    var stats = document.getElementsByClassName('statistics')[0];
    if (this.statsButton == "Full Statistics" || this.statsButton=="Cela statistika") {
      this.hideBoxplot = true;
      this.hideMatrix = true;
      this.hideS = true;
      stats.classList.add('col-lg-12');
      this.statsButton = "Close Statistics";
      if(this.message2=="sr") this.statsButton = "Zatvori statistiku";
      document.getElementById("stat").classList.add("height-change");
    }
    else {
      this.hideBoxplot = false;
      this.hideMatrix = false;
      this.hideS = false;
      stats.classList.remove('col-lg-12');
      this.statsButton == "Full Statistics";
      if(this.message2=='sr')this.statsButton="Cela statistika";

      document.getElementById("stat").classList.remove("height-change");
    }
  }

  expandMatrix() {
    var matrix = document.getElementsByClassName('matrix')[0];
    var matrixCard = document.getElementById('matrixCard');
    var corr = document.getElementById('corr');

    let height = this.fullCorrColNamesArray.length * 80 + 180;

    if (this.matrixButton == "Full Matrix" || this.matrixButton=="Cela matrica") {
      this.hideBoxplot = true;
      this.hideStatistics = true;
      this.hideM = true;
      matrix.classList.add('col-lg-12');
      matrix.classList.add('largeCorr');
      this.matrixButton = "Close Matrix";
      if(this.message2 == "sr") this.matrixButton = "Zatvori matricu"
      matrixCard.setAttribute("style", "height:" + height + "px;");
      corr.setAttribute("style", "height: 100%;");
    }
    else {
      this.hideBoxplot = false;
      this.hideStatistics = false;
      this.hideM = false;
      matrix.classList.remove('col-lg-12');
      matrix.classList.remove('largeCorr');
      this.matrixButton = "Full Matrix";
      if(this.message2 == "sr") this.matrixButton=="Cela matrica";
      matrixCard.setAttribute("style", "height: 480px;");
      corr.setAttribute("style", "height: 405px;");
    }
  }

  openedTab(id: number) {
    var buttons = document.getElementsByClassName('tabBtn');

    /*
    for(let i = 0; i < buttons.length; i++){
      buttons[i].classList.remove('tabOpened');
    }

    buttons[id].classList.add('tabOpened');
    */

    if (id == 0) {
      this.X = true;
      this.ioSelection = false;
      this.encoding = false;
      this.dataPreprocessing = false;
    }
    else if (id == 1) {
      this.X = false;
      this.ioSelection = true;
      this.encoding = false;
      this.dataPreprocessing = false;
      //this.heightCorrection();
    }
    else if (id == 2) {
      this.X = false;
      this.ioSelection = false;
      this.encoding = true;
      this.dataPreprocessing = false;
    }
    else if (id == 3) {
      this.X = false;
      this.ioSelection = false;
      this.encoding = false;
      this.dataPreprocessing = true;
    }
  }

  heightCorrection() {
    var tabs = document.getElementsByClassName('tabs')[0];
    var height: number = 0;
    if (this.ioSelection) {
      height = document.getElementsByClassName('io-selection')[0].clientHeight;
    }
    else if (this.encoding) {
      height = document.getElementsByClassName('encoding')[0].clientHeight;
    }
    else if (this.dataPreprocessing) {
      height = document.getElementsByClassName('data-preprocessing')[0].clientHeight;
    }
    else if (this.X) {
      height = document.getElementsByClassName('X')[0].clientHeight;
    }
    height += 70;
    tabs.setAttribute('style', 'height: ' + height + 'px;');
  }


  onSelectedMissingValueCol(event: any) {
    const value = event.target.value;
    this.selectedMissingValCol = value;

    if (this.isNumericFun(value))
      this.numCol1 = true;
    else
      this.numCol1 = false;

  }

  isSelectedMissingValuesCol(item: any) {
    if (item == this.selectedMissingValCol)
      this.selectedMissingValColBoolean = true;
    else
      this.selectedMissingValColBoolean = false;

    return this.selectedMissingValColBoolean;
  }

  isSelectedMissingValuesField(id: number) {
    for (let i = 0; i < this.headingLines[0].length; i++) {
      if (this.headingLines[0][i] == this.selectedMissingValCol) {
        if (i == id) {
          return true;
        }
      }
    }
    return false;
  }

  isSelectedOutlierField(id: number) {
    for (let i = 0; i < this.headingLines[0].length; i++) {
      if (this.headingLines[0][i] == this.selectedOutlierColumn) {
        if (i == id) {
          return true;
        }
      }
    }
    return false;
  }

  onSelectedToFillMissingValCol(event: any) {
    const value = event.target.value;
    this.selectedToFillMissingValCol = value;
    this.enteredToFillMissingValCol = "";

    if(value == "deleteAll")
      this.buttonMissingValues = "Delete All";
    else
      this.buttonMissingValues = "Replace";
  }

  selectedIDOutliers(id: number) {
    let exists: boolean = false;
    for (let i = 0; i < this.selectedOutliersRows.length; i++) {
      if (this.selectedOutliersRows[i] == id) {
        exists = true;
        break;
      }
    }

    if (exists == true)
      this.selectedOutliersRows.splice(id, 1);
    else
      this.selectedOutliersRows.push(id);

  }

  deleteOutliers() {

  }

  public isFillMissValDisabled = true;

  isMVDisabled() {
    if (this.selectedToFillMissingValCol == "none")
      this.isFillMissValDisabled = false;
    else
      this.isFillMissValDisabled = true;

    return this.isFillMissValDisabled;
  }

  isMVDisabled1() {
    if (this.enteredToFillMissingValCol == "")
      return false;
    else
      return true;
  }


  onInputToFillMissingValCol(event: any) {
    const value = event.target.value;
    this.buttonMissingValues = "Replace";
    this.selectedToFillMissingValCol = 'none';
    this.enteredToFillMissingValCol = value;
  }

  confirmToFillMissingValues() {
    let filename =sessionStorage.getItem('filename');
    if (this.isNumericFun(this.selectedToFillMissingValCol) && !this.isNumber(this.enteredToFillMissingValCol)) {
      this.poruka = "You are trying to replace with non numeric value";
      if(this.message == "sr") this.poruka = "Pokušavate da zamenite nenumeričkom vrednošću";
      this.notify.showNotification(this.poruka);
    }
    else if (this.selectedToFillMissingValCol == "none" && this.enteredToFillMissingValCol == "") {
      this.poruka = "Please choose value to replace missing values.";
      if(this.message == "sr") this.poruka = "Izaberite vrednost da biste popunili vrednosti koje nedostaju";
      this.notify.showNotification(this.poruka);
    }
    else {
      if (this.selectedToFillMissingValCol == "mean")
        this.selectedToFillMissingValCol = "avg";
      else if (this.selectedToFillMissingValCol == "median")
        this.selectedToFillMissingValCol = "med";

      if (this.cookie.get('cortexToken')) {
        this.tableService.fillMissingValuesAuthorized(this.selectedMissingValCol, filename, this.selectedToFillMissingValCol, this.enteredToFillMissingValCol).subscribe(
          (response) => {

            this.resetMissingValues();
            //this.reset();
            //this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn)
            this.poruka = "Edit successfull";
            if(this.message == "sr") this.poruka = "Izmena je uspela";
            this.notify.showNotification(this.poruka);
            setTimeout(() => {
              this.clearStorage();
              this.reset();
              this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
            }, 350);
          })
      }
      else {
        this.tableService.fillMissingValuesUnauthorized(this.selectedMissingValCol, filename, this.selectedToFillMissingValCol, this.enteredToFillMissingValCol).subscribe(
          (response) => {

            this.resetMissingValues();
            //this.reset();
            //this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn)
            this.poruka = "Edit successfull";
            if(this.message == "sr") this.poruka = "Izmena je uspela";
            this.notify.showNotification(this.poruka);
            setTimeout(() => {
              this.clearStorage();
              this.reset();
              this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
            }, 350);
          })
      }
    }
  }

  resetMissingValues() {
    this.selectedMissingValCol = this.arrMissingValues[0];
    this.selectedToFillMissingValCol = "none";
    this.enteredToFillMissingValCol = "";
  }

  floatToInt(num: any) {
    if (parseInt(num) == num) {
      return 10;
    }
    else {
      let str = parseFloat(num).toString();
      let s = str.split(".", 2);

      return s[1].substring(0, 1);
    }
  }

  confirmToReplaceOutliers() {

    let filename = sessionStorage.getItem('filename');
    if (this.selectedToReplaceOutliers == "none" && this.enteredToReplaceOutliersCol == "") {
      this.poruka = "Please choose value to replace outliers.";
      if(this.message == "sr") this.poruka = "Izaberite vrednost da biste zamenili izuzetke";
      this.notify.showNotification(this.poruka);
    }
    else if (!this.isNumber(this.enteredToReplaceOutliersCol) && this.enteredToReplaceOutliersCol != "") {
      this.poruka = "You are trying to replace with non numeric value";
      if(this.message == "sr") this.poruka = "Pokušavate da zamenite nenumeričkom vrednošću";
      this.notify.showNotification(this.poruka);
    }
    else {
      if (this.selectedToReplaceOutliers == "mean")
        this.selectedToReplaceOutliers = "avg";
      else if (this.selectedToReplaceOutliers == "median")
        this.selectedToReplaceOutliers = "med";

      if (this.cookie.get('cortexToken')) {
        this.tableService.changeOutliersAuthorized(this.selectedOutliersCol, filename, this.selectedToReplaceOutliers, this.enteredToReplaceOutliersCol).subscribe(
          (response) => {

            this.resetOutliers();
            this.poruka = "Edit successfull";
            if(this.message == "sr") this.poruka = "Izmena je uspela";
            this.notify.showNotification(this.poruka);
            setTimeout(() => {
              this.clearStorage();
              this.reset();
              this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
            }, 350);
          })
      }
      else {
        this.tableService.changeOutliersUnauthorized(this.selectedOutliersCol, filename, this.selectedToReplaceOutliers, this.enteredToReplaceOutliersCol).subscribe(
          (response) => {

            this.resetOutliers();
            this.poruka = "Edit successfull";
            if(this.message == "sr") this.poruka = "Izmena je uspela";
            this.notify.showNotification(this.poruka);
            setTimeout(() => {
              this.clearStorage();
              this.reset();
              this.showTable(this.selectedType, this.selectedRow, this.page, false, this.selectedOutlierColumn);
            }, 350);
          })
      }
    }

  }

  resetOutliers() {
    this.selectedOutliersCol = this.arrAllOutliers[0];
    this.selectedToReplaceOutliers = "none";
    this.enteredToReplaceOutliersCol = "";
  }

  onSelectedToChangeOutliers(event: any) {
    const value = event.target.value;
    this.selectedOutliersCol = value;
  }

  onSelectedValueOutliers(event: any) {
    const value = event.target.value;
    this.selectedToReplaceOutliers = value;
    this.enteredToReplaceOutliersCol = "";

    if(this.selectedToReplaceOutliers == "deleteAll")
      this.buttonOutliers = "Delete All";
    else
      this.buttonOutliers = "Replace";
  }

  onInputToFillOutliers(event: any) {
    const value = event.target.value;
    this.buttonOutliers = "Replace";
    this.enteredToReplaceOutliersCol = value;
    this.selectedToReplaceOutliers = 'none';
  }

  selectedTypeMessage() {
    if (this.selectedType == 'null'){
      if(this.message2 == "sr") return "Nema redova sa nedostajućim vrednostima";
      else return "No rows with null values.";
    }
    else if (this.selectedType == "not null"){
      if(this.message2 == "sr") return "Nema redova bez nedostajućih vrednosti";
      else return "No rows with not null values.";
    }
    else if (this.selectedType == 'outlier'){
      if(this.message2 == "sr") return "Nema redova sa izuzecima";
      else return "No rows with outliers.";
    }
    else{
      if(this.message2 == "sr") return "Prazan skup podataka";
      else return "Empty dataset.";
    }
  }

  isDisabledOutput(item: string) 
  {
    for(let i = 0; i < this.listCheckedI.length; i++) {
      if(this.listCheckedI[i] == item) {
        return true;
      }
    }
    return false;
  }
}