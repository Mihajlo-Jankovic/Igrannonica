import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss']
})
export class ExperimentsComponent implements OnInit {

  experiment = {
    'name' : "",
    'description' : ""
  }

  data = {
    'name' : "",
    'date' : "",
    'fileName' : "",
    'inputList' : [],
    'output' : "",
    'problemType' : "",
    'encodingType' : "",
    'optimizer' : "",
    'regularization' : "",
    'lossFunction' : "",
    'ratio' : 0,
    'activationFunction' : "",
    'learningRate' : 0,
    'regularizationRate' : 0,
    'epochs' : 0,
    'numLayers' : 0,
    'layerList' : [],
    'metrics' : []
  }

  experimentList : any = []

  constructor(private userService : UserService) { }

  ngOnInit(): void {
    this.showExperiments()
  }

  showExperiments()
  {
    this.userService.getAllUserExperiments().subscribe(exp =>{
      for(let i = 0; i< exp.length; i++)
      {
        let expData : any = {};
        expData = exp[i];
        this.data = expData;

        this.experimentList.push(this.data)
      }
    })
  }

}
