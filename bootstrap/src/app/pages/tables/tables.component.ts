import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: "app-tables",
  templateUrl: "tables.component.html"
})
export class TablesComponent {

  data = {
    'columns': [],
    'index': [],
    'data': []
  }

  //data: any = { "columns": ["title", "genre", "description", "director", "actors", "year", "runtime_(minutes)", "rating", "votes", "revenue_(millions)", "metascore"], "index": [1, 2, 3, 4, 5], "data": [["Guardians of the Galaxy", "Action,Adventure,Sci-Fi", "A group of intergalactic criminals are forced to work together to stop a fanatical warrior from taking control of the universe.", "James Gunn", "Chris Pratt, Vin Diesel, Bradley Cooper, Zoe Saldana", 2014, 121, 8.1, 757074, 333.13, 76], ["Prometheus", "Adventure,Mystery,Sci-Fi", "Following clues to the origin of mankind, a team finds a structure on a distant moon, but they soon realize they are not alone.", "Ridley Scott", "Noomi Rapace, Logan Marshall-Green, Michael Fassbender, Charlize Theron", 2012, 124, 7.0, 485820, 126.46, 65], ["Split", "Horror,Thriller", "Three girls are kidnapped by a man with a diagnosed 23 distinct personalities. They must try to escape before the apparent emergence of a frightful new 24th.", "M. Night Shyamalan", "James McAvoy, Anya Taylor-Joy, Haley Lu Richardson, Jessica Sula", 2016, 117, 7.3, 157606, 138.12, 62], ["Sing", "Animation,Comedy,Family", "In a city of humanoid animals, a hustling theater impresario's attempt to save his theater with a singing competition becomes grander than he anticipates even as its finalists' find that their lives will never be the same.", "Christophe Lourdelet", "Matthew McConaughey,Reese Witherspoon, Seth MacFarlane, Scarlett Johansson", 2016, 108, 7.2, 60545, 270.32, 59], ["Suicide Squad", "Action,Adventure,Fantasy", "A secret government agency recruits some of the most dangerous incarcerated super-villains to form a defensive task force. Their first mission: save the world from the apocalypse.", "David Ayer", "Will Smith, Jared Leto, Margot Robbie, Viola Davis", 2016, 123, 6.2, 393727, 325.02, 40]] }

  headingLines: any = [];
  numberData: any = [];
  numberLines: any = [];
  rowLines: any = [];

  constructor(private tableService: TableService) {
    this.tableService.getAll().subscribe(
      (response) => {
        this.data = response;
        console.log(this.data)
        let headersArray: any = [];
        console.log(this.data['columns'])
        for (let i = 0; i < this.data['columns'].length; i++) {
          console.log(this.data['columns'][i]);
          headersArray.push(this.data['columns'][i])
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
      })

  }
}
