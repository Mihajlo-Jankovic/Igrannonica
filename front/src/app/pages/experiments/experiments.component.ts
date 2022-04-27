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
    "_id": "",
    "userId": 0,
    "name": "",
    "date": "",
    "fileName": "",
    "realName": "",
    "description": "",
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
          "encodingType": "",
          "fileName": "s"
        }
      }
    ]
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

  deleteExperiments(id : any)
  {
    this.userService.deleteExperiment(id).subscribe(res => {
      this.experimentList = [];
      this.showExperiments();
    })
  }

}
