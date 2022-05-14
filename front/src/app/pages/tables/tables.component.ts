import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { TableService } from 'src/app/services/table.service';
import { CookieService } from "ngx-cookie-service";
import { Configuration } from "src/app/configuration";

import {
  ChartComponent,
  ApexChart,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexAxisChartSeries,
  ApexStroke,
  ApexTooltip
} from "ng-apexcharts";
import { AnyForUntypedForms } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

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
  //*
  column = {
    'id': 0,
    'colName': "",
    'isSelected': false,
    'isNum': false,
    'encoding': "",
    'encList': []
  }
  //*
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

  arr: any = [];
  arrMin: any = [];
  arrQ1: any = [];
  arrMean: any = [];
  arrMedian: any = [];
  arrQ3: any = [];
  arrMax: any = [];

  hideStatistics: boolean = false;
  hideBoxplot: boolean = false;
  hideMatrix: boolean = false;

  statsButton: string = "Full Statistics";
  matrixButton: string = "View Full Matrix";

  X: boolean = true;
  ioSelection: boolean = false;
  encoding: boolean = false;
  dataPreprocessing: boolean = false;

  //*
  notChecked: boolean = false;
  encodingList = ["label", "one-hot", "binary", "frequency"];
  colDataList: any = [];
  //*

  //*
  missingValuesList = [];
  fillMissingValuesList = ["", "MIN", "MAX", "AVG", "MEAN"];
  dataOutliers: any = {"columns": ["RANK", "Country", "Happiness score", "Whisker-high", "Whisker-low", "Dystopia (1.83) + residual", "Explained by: GDP per capita", "Explained by: Social support", "Explained by: Healthy life expectancy", "Explained by: Freedom to make life choices", "Explained by: Generosity", "Explained by: Perceptions of corruption"], "data": [[1, "Finland", 7.821, 7.886, 7.756, 2.518, 1.892, 1.258, 0.775, 0.736, 0.109, 0.534], [2, "Denmark", 7.636, 7.71, 7.563, 2.226, 1.953, 1.243, 0.777, 0.719, 0.188, 0.532 ], [3, "Iceland", 7.557, 7.651, 7.464, 2.32, 1.936, 1.32, 0.803, 0.718, 0.27, 0.191 ], [ 4, "Switzerland", 7.512, 7.586, 7.437, 2.153, 2.026, 1.226, 0.822, 0.677, 0.147, 0.461], [5, "Netherlands", 7.415, 7.471, 7.359, 2.137, 1.945, 1.206, 0.787, 0.651, 0.271, 0.419], [6, "Luxembourg*", 7.404, 7.501, 7.307, 2.042, 2.209, 1.155, 0.79, 0.7, 0.12, 0.388], [ 7, "Sweden", 7.384, 7.454, 7.315, 2.003, 1.92, 1.204, 0.803, 0.724, 0.218, 0.512], [8, "Norway", 7.365, 7.44, 7.29, 1.925, 1.997, 1.239, 0.786, 0.728, 0.217, 0.474], [9, "Israel", 7.364, 7.426, 7.301, 2.634, 1.826, 1.221, 0.818, 0.568, 0.155, 0.143], [10, "New Zealand", 7.2, 7.279, 7.12, 1.954, 1.852, 1.235, 0.752, 0.68, 0.245, 0.483 ]], "index": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }
  selectedMissingValCol;
  selectedMissingValColBoolean: boolean = true;
  selectedToFillMissingValCol: string = "MIN";
  enteredToFillMissingValCol: any = "";
  
  selectedOutliersRows: any = [];
  headingLinesOutliers: any = [];
  numberLinesOutliers: any = [];
  numberDataOutliers: any = [];
  rowLinesOutliers: any = [];
  //*
  deleteWarning: boolean = false;

  filter = 0;

  token: string;
  cookieCheck: any;
  configuration = new Configuration();

  constructor(private tableService: TableService, private cookie: CookieService, private toastr: ToastrService, private router: Router, private http: HttpClient) {
    sessionStorage.removeItem('statistics');
    this.cookieCheck = this.cookie.get('token');
    this.showTable(this.selectedType, this.selectedRow, this.page, false)
    this.boxPlotFun();
    this.showOutliers();
  }

  ngOnInit() {
    if (this.cookieCheck) {
      this.refreshToken();
    }
  }

  refreshToken(){
    this.token = this.cookie.get('token');
    
    this.http.get<any>(this.configuration.refreshToken + this.token ).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        this.cookie.set("token", StringToken);
    }, err=>{
        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).token;
        if(StringToken == "Error: Token not valid"){
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

  showTable(type: string, rows: number, page: number, filter: boolean) {
    if (sessionStorage.getItem('csv') != null) {
      let dataCSV: any = {};
      dataCSV = JSON.parse(sessionStorage.getItem('csv'));
      this.data = dataCSV;
      this.maxPage = sessionStorage.getItem('numOfPages');
      this.numericValues = JSON.parse(sessionStorage.getItem('numericValues'));
      this.loadTable(filter);
    }
    else {
      let filename = this.cookie.get('filename');
      this.tableService.getAll(filename, type, rows, page).subscribe(
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
          console.log("numeric values " + this.numericValues)

          sessionStorage.setItem('numericValues', JSON.stringify(this.numericValues));
          this.loadTable(filter);
        }, err => {
          let JSONtoken: string = JSON.stringify(err.error);
          let StringToken = JSON.parse(JSONtoken).responseMessage;
          if (StringToken == "Error encoundered while reading dataset content.") {
            this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Error encoundered while reading dataset content</b>.', '', {
              disableTimeOut: false,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-info alert-with-icon",
              positionClass: 'toast-top-center'
            });
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
      numValueIndexArray.push(i);
      this.numericValuesArray.push(numValueIndexArray);
    }

    this.selectedColName = this.numericValuesArray[0][0];
    this.selectedCol = this.numericValuesArray[0][1];
    this.selectedColDiv = true;


    if (this.numericValues['col'].length > 0 && !filter) {
      this.showStatisticDiv = true;
      this.showStatistics(this.selectedCol);
    }
    //*
    this.setInputOutput();
    //*
  }

  setInputOutput() {

    if(sessionStorage.getItem("inputList") == null) {
      for (let i = 0; i < this.headingLines[0].length-1; i++) {
        this.radios[i] = true; //disabled
        this.checks[i] = false; //disabled
        this.radios1[i] = false; //checked
        this.checks1[i] = true; //checked
        this.listCheckedI.push(this.headingLines[0][i])
      }

      this.checks[this.headingLines[0].length-1] = true;
      this.checks1[this.headingLines[0].length-1] = false;
      this.listCheckedI.splice(this.headingLines[0].length-1, 1);
      sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));

      this.radios[this.headingLines[0].length-1] = false;
      this.radios1[this.headingLines[0].length-1] = true;
      this.selectedOutput = this.headingLines[0][this.headingLines[0].length-1];
      sessionStorage.setItem('output', this.selectedOutput);
      this.pret = this.headingLines[0].length-2;
      
      this.setEncoding();
    }
    else {
      this.listCheckedI = JSON.parse(sessionStorage.getItem('inputList'));
      this.selectedOutput = sessionStorage.getItem('output');

      let f: number = 0;
      for (let i = 0; i < this.headingLines[0].length; i++) {
        f = 0;
        for (let j = 0; j < this.listCheckedI.length; j++) {
          if(this.headingLines[0][i] == this.listCheckedI[j]) {
            this.checks1[i] = true;
            this.checks[i] = false;
            this.radios1[i] = false;
            this.radios[i] = true;
            f = 1;
          }
        }
        if(f == 0)
        {
          if(this.headingLines[0][i] == this.selectedOutput) {
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
    for (let i = 0; i < this.headingLines[0].length-1; i++) {   
      let f: any = 0;
      this.restartColData();

      for(let j = 0; j < this.numericValues['col'].length; j++) {
        if(this.numericValues['col'][j] == this.headingLines[0][i]) {
          this.column['encoding'] = "none";
          f = 1;
        }
      }
        
      if(f == 0) {
        this.column['encoding'] = this.encodingList[0];
      }
      this.column['id'] = i;
      this.column['colName'] = this.headingLines[0][i]
      this.column['isSelected'] = true;
      this.column['isNum'] = this.isNumericFun(this.headingLines[0][i]);
      this.column['encList'] = this.getSelectedEnc(this.column['isNum'], this.column['encoding']);
        
      this.colDataList.push(this.column);
    }

    let f: any = 0;
    this.restartColData();
    this.column['id'] = this.headingLines[0].length-1;
    this.column['colName'] = this.headingLines[0][this.headingLines[0].length-1];
    this.column['isSelected'] = false;
    this.column['isNum'] = this.isNumericFun(this.headingLines[0][this.headingLines[0].length-1]);
  
    f = 0;
    for(let j = 0; j < this.numericValues['col'].length; j++) {
      if(this.numericValues['col'][j] == this.headingLines[0][this.headingLines[0].length-1]) {
        this.column['encoding'] = "none";
        f = 1;
      }
    }
    if(f == 0) {
      this.column['encoding'] = this.encoding[0];
    }
    this.column['encList'] = this.getSelectedEnc(this.column['isNum'], this.column['encoding']);
    this.colDataList.push(this.column);
  
    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
  }

  isNumericFun(colName: any) {
    for(let i = 0; i < this.numericValues['col'].length; i++) {
      if(this.numericValues['col'][i] == colName) {
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
      'encList': []
    };
  }
  //*

  public onSelectedType(event: any, filter: boolean) {
    this.page = 1;
    const value = event.target.value;
    this.selectedType = value;
    this.clearStorage();
    this.reset();
    this.showTable(this.selectedType, this.selectedRow, this.page, filter);
  }

  public onSelectedRow(event: any, filter: boolean) {
    this.page = 1;
    const value = event.target.value;
    this.selectedRow = value;
    this.clearStorage();
    this.reset();
    this.showTable(this.selectedType, this.selectedRow, this.page, filter);
  }

  reset() {
    this.headingLines = [];
    this.numberData = [];
    this.numberLines = [];
    this.rowLines = [];
  }

  showStatistics(col: number) {
    if (sessionStorage.getItem('statistics')) {
      //this.statisticData = JSON.parse(sessionStorage.getItem('statistics'));
      //this.loadStatistics();
      this.statistic = JSON.parse(sessionStorage.getItem('statistics'));
      this.loadStatistics(col);
    }
    else {
      let filename = this.cookie.get('filename');
      this.tableService.getStatistics(filename, col).subscribe(
        (response) => {
          this.statistic = response;
          //console.log(this.statistic);
          sessionStorage.setItem('statistics', JSON.stringify(this.statistic));
          this.loadStatistics(col);
          this.boxPlotFun();
        }, err => {
          let JSONtoken: string = JSON.stringify(err.error);
          let StringToken = JSON.parse(JSONtoken).responseMessage;
          if (StringToken == "Error encoundered while calculating statistics.") {
            this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Error encoundered while calculating statistics</b>.', '', {
              disableTimeOut: false,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-info alert-with-icon",
              positionClass: 'toast-top-center'
            });
          }
        })
    }
  }


  colListData: any = [];
  public loadStatistics(col: number) {
    this.colListData = [];
    for (let i = 0; i < this.statistic['colList'].length; i++) {
      this.colListData.push(this.statistic['colList'][i]);
    }

    this.arr = [];
    this.arrMin = [];
    this.arrQ1 = [];
    this.arrMean = [];
    this.arrMedian = [];
    this.arrQ3 = [];
    this.arrMax = [];
    for (let i = 0; i < this.statistic['jsonList'].length; i++) {
      this.arr.push(this.statistic['jsonList'][i]);
      this.arrMin.push(this.arr[i]['min']);
      this.arrQ1.push(this.arr[i]['firstQ']);
      this.arrMean.push(this.arr[i]['avg']);
      this.arrMedian.push(this.arr[i]['med']);
      this.arrQ3.push(this.arr[i]['thirdQ']);
      this.arrMax.push(this.arr[i]['max']);
    }

    for (let i = 0; i < this.statistic['jsonList'].length; i++) {
      if (i == col) {
        this.statisticData = this.statistic['jsonList'][i];
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

        let permName: string;
        for (let i = 0; i < this.colListData.length; i++) {
          if (i == col) {
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
        }
        this.boxPlotFun();
      }
    }
  }

  public onSelectedCol(event: any) {
    const value = event.target.value;
    var splitted = value.split("|", 2);
    this.selectedColName = splitted[0];
    this.selectedCol = parseInt(splitted[1]);
    sessionStorage.removeItem('statistics');
    this.resetStatistic();
    this.showStatistics(this.selectedCol);
  }

  resetStatistic() {
    this.numArray = [];
    this.mixArray = [];
    this.outliers = [];
  }

  boxPlotFun() {
    //console.log(this.mixArray[0], this.mixArray[1], this.mixArray[2], this.mixArray[3], this.mixArray[4]);
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
        height: 280,
        type: "boxPlot",
        foreColor: '#ced4da',

        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: true,
            reset: true,
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
      this.showTable(this.selectedType, this.selectedRow, this.page, true);
    }
  }

  previousPage(i: number) {
    if (this.page - i >= 1) {
      this.page -= i;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true);
    }
  }

  firstPage() {
    if (this.page != 1) {
      this.page = 1;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true);
    }
  }

  lastPage() {
    if (this.page != this.maxPage) {
      this.page = this.maxPage;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page, true);
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
    if(sessionStorage.getItem('inputList')) {
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

    if(exists == true) {
      //*
      for(let i = 0; i < this.colDataList.length; i++) {
        if(this.colDataList[i]['colName'] == value) {

          this.colDataList[i]['isSelected'] = false;
              
          if(this.colDataList[i]['isNum'])
            this.colDataList[i]['encoding'] = "none";
          else
            this.colDataList[i]['encoding'] = this.encodingList[0];
          
          this.colDataList[i]['encList'] = this.getSelectedEnc(this.colDataList[i]['isNum'], this.colDataList[i]['encoding']);
        }
      }
      //*
    }
    else {
      //*
      for(let i = 0; i < this.colDataList.length; i++) {
        if(this.colDataList[i]['colName'] == value)
          this.colDataList[i]['isSelected'] = true;
      }
      //*
    }

    for(let i = 0; i < this.colDataList.length; i++) {
      if(this.colDataList[i]['isSelected'] == true) {
        this.listCheckedI.push(this.colDataList[i]['colName']);
      }
    }

    //*
    if(this.listCheckedI.length == 0)
      this.notChecked = true;
    else
      this.notChecked = false;

    sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));
    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
    //console.log(this.colDataList);
    //*
  }

  updateEncoding() {
    let f: number = 0;

    this.listCheckedI = JSON.parse(sessionStorage.getItem('inputList'));
    this.colDataList = JSON.parse(sessionStorage.getItem('columnData'));

    for (let i = 0; i < this.colDataList.length; i++) {
      f = 0;
      for (let j = 0; j < this.listCheckedI.length; j++) {
        if(this.colDataList[i]['colName'] == this.listCheckedI[j]) {
          this.colDataList[i]['isSelected'] = true;
          f = 1;
        }
      }
      if(f == 0)
        this.colDataList[i]['isSelected'] = false;
  }

  sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
  sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));
  }

  selectedOutputFun(event: any) {
    var value = event.target.value;
    var ind: number = -1;

    for (let i = 0; i < this.headingLines[0].length; i++) {
      if (this.selectedOutput == this.headingLines[0][i])
        ind = i;
    }

    this.pret = ind;
    //console.log(this.pret);
    this.selectedOutput = value;

    sessionStorage.setItem('output', this.selectedOutput);
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
      id = id + (this.page - 1) * this.selectedRow
      this.selectedRows.push(id);
    }
    else {
      id = id + (this.page - 1) * this.selectedRow
      this.selectedRows.forEach((element, index) => {
        if (element == id) this.selectedRows.splice(index, 1)
      });
    }
    console.log(this.selectedRows)
  }

  onSelectedEnc(event : any)
  {
    const value = event.target.value;
    var splitted = value.split("|", 2);
    let selectedEncoding: string = splitted[0];
    let selectedcol: string = splitted[1];

    for(let i = 0; i < this.colDataList.length; i++) {
      if(this.colDataList[i]['colName'] == selectedcol) {
        this.colDataList[i]['encoding'] = selectedEncoding;
        this.colDataList[i]['encList'] = this.getSelectedEnc(this.colDataList[i]['isNum'], selectedEncoding);
      }
    }

    sessionStorage.setItem('columnData', JSON.stringify(this.colDataList));
  }

  //*
  getSelectedEnc(isNum: any, encName: any) {
    let temp = [];
    if(encName == "none")
      temp.push(true, false, false, false, false);
    else if(encName == this.encodingList[0] && isNum == true)
      temp.push(false, true, false, false, false);
    else if(encName == this.encodingList[0] && isNum == false)
      temp.push(false, true, false, false, false);
    else if(encName == this.encodingList[1] && isNum == true)
      temp.push(false, false, true, false, false);
    else if(encName == this.encodingList[1] && isNum == false)
      temp.push(false, false, true, false, false);
    else if(encName == this.encodingList[2] && isNum == true)
      temp.push(false, false, false, true, false);
    else if(encName == this.encodingList[2] && isNum == false)
      temp.push(false, false, false, true, false);
    else if(encName == this.encodingList[3] && isNum == true)
      temp.push(false, false, false, false, true);
    else if(encName == this.encodingList[3] && isNum == false)
      temp.push(false, false, false, false, true);

    return temp;
  }

  async deleteRows()
  {
      await this.tableService.deleteRows(this.cookie.get('filename'), this.selectedRows).subscribe(err =>
        {
          this.clearStorage();
          this.reset();
          this.showTable(this.selectedType, this.selectedRow, this.page, false);
          sessionStorage.removeItem('statistics');
          this.resetStatistic();
          this.showStatistics(this.selectedCol);
          this.selectedRows = [];
          this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Delete successfull</b>.', '', {
            disableTimeOut: false,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: 'toast-top-center'
          });
        }, err => {
            let JSONtoken: string = JSON.stringify(err.error);
            let StringToken = JSON.parse(JSONtoken).responseMessage;
            if (StringToken == "Error encoundered while deleting a row from the dataset.") {
              this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Error encoundered while deleting a row from the dataset</b>.', '', {
                disableTimeOut: false,
                closeButton: true,
                enableHtml: true,
                toastClass: "alert alert-info alert-with-icon",
                positionClass: 'toast-top-center'
              });
            }
          });
  }

  deleteCheck() {
    if (this.selectedRows.length != 0) this.deleteWarning = true;
  }

  

  async editCell(id: number, value: any, columnName: string) {
    id = id + (this.page - 1) * this.selectedRow;

    await this.tableService.editCell(this.cookie.get('filename'), id, columnName, value).subscribe(res => {
      this.clearStorage();
      sessionStorage.removeItem('statistics');
      this.reset()
      this.showTable(this.selectedType, this.selectedRow, this.page, false);
      this.resetStatistic();
      this.showStatistics(this.selectedCol);
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Edit successfull</b>.', '', {
        disableTimeOut: false,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-top-center'
      });

    }, err => {
      let JSONtoken: string = JSON.stringify(err.error);
      let StringToken = JSON.parse(JSONtoken).responseMessage;
      if (StringToken == "Error encoundered while deleting a row from the dataset.") {
        this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Error encoundered while editing cell content</b>.', '', {
          disableTimeOut: false,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-info alert-with-icon",
          positionClass: 'toast-top-center'
        });
      }
    })
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
    if (this.statsButton == "Full Statistics") {
      this.hideBoxplot = true;
      this.hideMatrix = true;
      this.hideS = true;
      stats.classList.add('col-lg-12');
      this.statsButton = "Close Statistics"

      document.getElementById("stat").classList.add("height-change");
    }
    else {
      this.hideBoxplot = false;
      this.hideMatrix = false;
      this.hideS = false;
      stats.classList.remove('col-lg-12');
      this.statsButton = "Full Statistics"

      document.getElementById("stat").classList.remove("height-change");
    }
  }

  expandMatrix() {
    var matrix = document.getElementsByClassName('matrix')[0];

    if (this.matrixButton == "View Full Matrix") {
      this.hideBoxplot = true;
      this.hideStatistics = true;
      this.hideM = true;
      matrix.classList.add('col-lg-12');
      this.matrixButton = "Close Matrix"
    }
    else {
      this.hideBoxplot = false;
      this.hideStatistics = false;
      this.hideM = false;
      matrix.classList.remove('col-lg-12');
      this.matrixButton = "View Full Matrix"
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
    console.log(height);
  }

  showOutliers() {

    let headersArray: any = [];
    for (let i = 0; i < this.dataOutliers['columns'].length; i++) {
      headersArray.push(this.dataOutliers['columns'][i]);
    }
    this.headingLinesOutliers.push(headersArray);

    let index = [];
    for (let i = 0; i < this.dataOutliers['index'].length; i++) {
      index.push([i]);
    }
    this.numberLinesOutliers.push(index);

    let dataArr = [];
    for (let i = 0; i < this.dataOutliers['columns'].length; i++) {
      dataArr.push([i]);
    }
    this.numberDataOutliers.push(dataArr);

    let rowsArray = [];
    for (let i = 0; i < this.dataOutliers['data'].length; i++) {
      rowsArray.push(this.dataOutliers['data'][i]);
    }
    this.rowLinesOutliers.push(rowsArray);

    this.selectedMissingValCol = this.headingLinesOutliers[0][0];
  }

  onSelectedMissingValueCol(event: any) {
    const value = event.target.value;
    this.selectedMissingValCol = value;
  }

  isSelectedMissingValuesCol(item: any) {
    if(item == this.selectedMissingValCol)
      this.selectedMissingValColBoolean = true;
    else
      this.selectedMissingValColBoolean = false;

    return this.selectedMissingValColBoolean;
  }

  isSelectedMissingValuesField(id: number) {
    for (let i = 0; i < this.headingLinesOutliers[0].length; i++) {
      if(this.headingLinesOutliers[0][i] == this.selectedMissingValCol) {
        if(i == id) {
          return true;
        }
      }
    }
    return false;
  }

  onSelectedToFillMissingValCol(event: any) {
    const value = event.target.value;
    this.selectedToFillMissingValCol = value;
  }
  
  selectedIDOutliers(id : number) {
    let exists: boolean = false;
    for(let i = 0; i < this.selectedOutliersRows.length; i++) {
      if(this.selectedOutliersRows[i] == id) {
        console.log("Postoji");
        exists = true;
        break;
      }
    }

    if(exists == true)
      this.selectedOutliersRows.splice(id, 1);
    else
      this.selectedOutliersRows.push(id);

    //console.log(this.selectedOutliersRows);
  }
  
  deleteOutliers() {
    
  }

  public isFillMissValDisabled = true;

  isMVDisabled() {
    if(this.selectedToFillMissingValCol == "")
      this.isFillMissValDisabled = false;
    else
      this.isFillMissValDisabled = true;

    return this.isFillMissValDisabled;
  }

  isMVDisabled1() {
    if(this.enteredToFillMissingValCol == "")
      return false;
    else
      return true;
  }

  onInputToFillMissingValCol(event: any) {
    const value = event.target.value;
  }

  confirmToFillMissingValues() {
    if(this.selectedToFillMissingValCol == "" && this.enteredToFillMissingValCol == "") {
      alert("Izaberite vrednost ili popunite polje!");
    }
    else {

    }
  }
  
}