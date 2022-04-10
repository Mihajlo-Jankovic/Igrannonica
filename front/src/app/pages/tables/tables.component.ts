import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { TableService } from 'src/app/services/table.service';
import { CookieService } from "ngx-cookie-service";

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

  //data: any = { "columns": ["title", "genre", "description", "director", "actors", "year", "runtime_(minutes)", "rating", "votes", "revenue_(millions)", "metascore"], "index": [1, 2, 3, 4, 5], "data": [["Guardians of the Galaxy", "Action,Adventure,Sci-Fi", "A group of intergalactic criminals are forced to work together to stop a fanatical warrior from taking control of the universe.", "James Gunn", "Chris Pratt, Vin Diesel, Bradley Cooper, Zoe Saldana", 2014, 121, 8.1, 757074, 333.13, 76], ["Prometheus", "Adventure,Mystery,Sci-Fi", "Following clues to the origin of mankind, a team finds a structure on a distant moon, but they soon realize they are not alone.", "Ridley Scott", "Noomi Rapace, Logan Marshall-Green, Michael Fassbender, Charlize Theron", 2012, 124, 7.0, 485820, 126.46, 65], ["Split", "Horror,Thriller", "Three girls are kidnapped by a man with a diagnosed 23 distinct personalities. They must try to escape before the apparent emergence of a frightful new 24th.", "M. Night Shyamalan", "James McAvoy, Anya Taylor-Joy, Haley Lu Richardson, Jessica Sula", 2016, 117, 7.3, 157606, 138.12, 62], ["Sing", "Animation,Comedy,Family", "In a city of humanoid animals, a hustling theater impresario's attempt to save his theater with a singing competition becomes grander than he anticipates even as its finalists' find that their lives will never be the same.", "Christophe Lourdelet", "Matthew McConaughey,Reese Witherspoon, Seth MacFarlane, Scarlett Johansson", 2016, 108, 7.2, 60545, 270.32, 59], ["Suicide Squad", "Action,Adventure,Fantasy", "A secret government agency recruits some of the most dangerous incarcerated super-villains to form a defensive task force. Their first mission: save the world from the apocalypse.", "David Ayer", "Will Smith, Jared Leto, Margot Robbie, Viola Davis", 2016, 123, 6.2, 393727, 325.02, 40]] }

  headingLines: any = [];
  numberData: any = [];
  numberLines: any = [];
  rowLines: any = [];
  numericValuesArray: any = [];
  fullCorrColNamesArray: any = []; //niz za kor matricu (nazivi kolona)
  fullCorrValArray: any = []; // niz za kor matricu (vrednosti)

  radios: any = [];
  checks: any = [];

  selectedType : string = "all";
  selectedRow : number = 10;
  selectedColName: string = "";
  selectedCol: number;

  selectedColDiv: boolean = false;

  page : number = 1;
  maxPage : any = 1000;

  showStatisticDiv: boolean = false;

  constructor(private tableService: TableService, private cookie : CookieService) {
    this.clearStorage();
    sessionStorage.removeItem('statistics');
      this.showTable(this.selectedType, this.selectedRow, this.page)
      this.boxPlotFun();
  }

  clearStorage()
  {
    sessionStorage.removeItem('csv');
    sessionStorage.removeItem('numOfPages');
    sessionStorage.removeItem('numericValues');
  }

  showTable(type : string, rows : number, page : number)
  {
    if(sessionStorage.getItem('csv') != null)
    {
      let dataCSV: any = {};
      dataCSV = JSON.parse(sessionStorage.getItem('csv'));
      this.data = dataCSV;
      this.maxPage=sessionStorage.getItem('numOfPages');
      this.numericValues = JSON.parse(sessionStorage.getItem('numericValues'));
      this.loadTable();
    }
    else{
      let filename = this.cookie.get('filename');
      this.tableService.getAll(filename,type, rows, page).subscribe(
      (response) => {
        this.csv = response;
        //console.log(this.csv);

        let dataCSV: any = {};
        dataCSV = this.csv['csv'];
        this.data = dataCSV;

        sessionStorage.setItem('csv', JSON.stringify(this.data));

        this.maxPage=this.csv['numOfPages'];
        sessionStorage.setItem('numOfPages', this.maxPage);

        //ucitavanje numericValues
        let numerValuesCSV: any = {};
        numerValuesCSV = this.csv['numericValues'];
        this.numericValues = numerValuesCSV;
        console.log("numeric values " + this.numericValues)

        sessionStorage.setItem('numericValues', JSON.stringify(this.numericValues));
        this.loadTable();
      })
    }
  }

  public loadTable()
  {
    let headersArray: any = [];
    for (let i = 0; i < this.data['columns'].length; i++) {
      headersArray.push(this.data['columns'][i]);
      this.radios[i] = false;
      this.checks[i] = false;
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

    this.selectedColName = this.numericValuesArray[0][0];
    this.selectedCol = this.numericValuesArray[0][1];
    this.selectedColDiv = true;

    if(this.numericValues['col'].length > 0) {
      this.showStatisticDiv = true;
      this.showStatistics(this.selectedCol);
    }
  }

  public onSelectedType(event: any) {
    const value = event.target.value;
    this.selectedType = value;
    sessionStorage.removeItem('csv');
    sessionStorage.removeItem('numOfPages');
    sessionStorage.removeItem('numericValues');
    this.reset();
    this.showTable(this.selectedType, this.selectedRow, this.page);
 }

 public onSelectedRow(event: any) {
  const value = event.target.value;
  this.selectedRow = value;
  this.clearStorage();
  this.reset();
  this.showTable(this.selectedType, this.selectedRow, this.page);
}

reset()
{
  this.headingLines  = [];
  this.numberData = [];
  this.numberLines = [];
  this.rowLines = [];
}

rowsNum: number;
  min: number;
  max: number;
  avg: number;
  med: number;
  firstQ: number;
  thirdQ: number;
  corrMatrix: any = {};
  mixArray: any = []; //niz za boxplot
  numArray: any= []; //niz za kor matricu
  outliers : any = [];
  
  showStatistics(col : number)
  {
    if(sessionStorage.getItem('statistics'))
    {
      this.statisticData = JSON.parse(sessionStorage.getItem('statistics'));
      this.loadStatistics();
    }
    else{
    let filename = this.cookie.get('filename');
    this.tableService.getStatistics(filename, col).subscribe(
      (response) => {
        this.statisticData = response;
        //console.log(this.statisticData);

        sessionStorage.setItem('statistics', JSON.stringify(this.statisticData));
        this.loadStatistics();
        this.boxPlotFun();
      })
    }
  }

  public loadStatistics()
  {
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

    this.numArray = [];
    for (let i = 0; i < this.statisticData['corrMatrix'][this.selectedCol].length; i++) {
      this.numArray.push(this.statisticData['corrMatrix'][this.selectedCol][i]);
    }

    this.outliers = [];
    for(let i=0;i<this.statisticData['outliers'].length;i++){
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

            for(let j = 0; j < this.fullMatrixData['values'][i].length; j++) {
              valArray.push(this.fullMatrixData['values'][i][j]);
            }
            this.fullCorrValArray.push(valArray);
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

  boxPlotFun()  {
    //console.log(this.mixArray[0], this.mixArray[1], this.mixArray[2], this.mixArray[3], this.mixArray[4]);
    this.chartOptions = {
      series: [
        {
          name : "box",
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
            x : this.selectedColName,
            y : this.outliers
          }
          ]
        }
      ],
      chart: {
        height: 223,
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
    if(this.page + i <= this.maxPage){
      this.page += i;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page);
    }
  }

  previousPage(i : number) {
    if(this.page - i >= 1){
      this.page -= i;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page);
    }
  }

  firstPage(){
    if(this.page != 1){
      this.page = 1;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page);
    }
  }

  lastPage(){
    if(this.page != this.maxPage){
      this.page = this.maxPage;
      this.clearStorage();
      this.reset();
      this.showTable(this.selectedType, this.selectedRow, this.page);
    }
  }


  showIO: boolean = false;
  showIOFun() {
    if(this.showIO == false)
      this.showIO = true;
    else
      this.showIO = false;
  }

  listCheckedI: any = [];
  disabledOutput: any;
  inputCheckedFun(event: any) {
    var value = event.target.value;

    var exists = false;
    for (let i = 0; i < this.listCheckedI.length; i++) {
      if(this.listCheckedI[i] == value) {
        var index = i; 
        exists = true;
      }
    }

    if(exists == true)
      this.listCheckedI.splice(index, 1);
    else
      this.listCheckedI.push(value);
    
    sessionStorage.setItem('inputList', JSON.stringify(this.listCheckedI));
    //console.log(this.listCheckedI);
  }

  selectedOutput: any;
  selectedOutputFun(event: any) {
    var value = event.target.value;
    this.selectedOutput = value;
    sessionStorage.setItem('output', this.selectedOutput);
    //console.log(this.selectedOutput);
  }

  disableOutput(id : number) {
    this.radios[id] = !this.radios[id];
  }
  checked : any;
  disableInput(id : number) {
    if(this.checked != undefined) {
      this.checks[this.checked] = !this.checks[this.checked];
    }
    this.checks[id] = !this.checks[id];
    this.checked = id;
  }
  selectedRows : Array<number> = [];

  selectedID(id : number){
    id = id + (this.page - 1)*this.selectedRow
    this.selectedRows.push(id);
  }

  async deleteRows()
  {
      await this.tableService.deleteRows(this.cookie.get('filename'), this.selectedRows).subscribe(err =>
        {
          this.clearStorage();
          sessionStorage.removeItem('statistics');
          this.reset()
          this.showTable(this.selectedType, this.selectedRow, this.page);
          this.resetStatistic();
          this.showStatistics(this.selectedCol);
          this.selectedRows = [];
        });

  }

  async editCell(id : number, value : any, columnName : string)
  {
    id = id + (this.page - 1)*this.selectedRow;

    await this.tableService.editCell(this.cookie.get('filename'), id, columnName, value).subscribe(err =>{
      this.clearStorage();
      sessionStorage.removeItem('statistics');
      this.reset()
      this.showTable(this.selectedType, this.selectedRow, this.page);
      this.resetStatistic();
      this.showStatistics(this.selectedCol);
    })
  }

  opndMatrix: boolean = false;

  previewMatrix() {
   // this.showToolBar = false;
   // this.boxPlotFun();
    this.opndMatrix = true;
  }

  close() {
    this.opndMatrix = false;
  }

}
