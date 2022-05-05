import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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
          "fileName": ""
        }
      }
    ]
  }

  experimentList : any = []

  constructor(private userService : UserService, private cookie : CookieService, private router :  Router) { }

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

  useExperiments(item)
  {

    var metricsList = [];
    var metrics = item.models[0].parameters.metrics;
    for(let i = 0; i< metrics.length;i++)
    {
      if(metrics[i] == "mse")
      {
        metricsList[i] = {item_id: "mse", item_text: "Mean Squared Error"}
      }
      else if(metrics[i] == "msle")
      {
        metricsList[i] = {item_id: "msle", item_text: "Mean Squared Logarithmic Error"}
      }
      else if(metrics[i] == "mae")
      {
        metricsList[i] = {item_id: "mae", item_text: "Mean Absolute Error"}
      }
      else if(metrics[i] == "mape")
      {
        metricsList[i] = {item_id: "mape", item_text: "Mean Absolute Percentage Error"}
      }
      else if(metrics[i] == "logcosh")
      {
        metricsList[i] = {item_id: "logcosh", item_text: "Log Cosh Error"}
      }
      else if(metrics[i] == "categorical_accuracy")
      {
        metricsList[i] = {item_id: "categorical_accuracy", item_text: "Categorical Accuracy"}
      }
      else if(metrics[i] == "sparse_categorical_accuracy")
      {
        metricsList[i] = {item_id: "sparse_categorical_accuracy", item_text: "Sparse Categorical Accuracy"}
      }
      else if(metrics[i] == "top_k_accuracy")
      {
        metricsList[i] = {item_id: "top_k_accuracy", item_text: "Top K Accuracy"} 
      }
      else if(metrics[i] == "sparse_top_k_categorical_accuracy")
      {
        metricsList[i] = {item_id: "sparse_top_k_categorical_accuracy", item_text: "Sparse Top K Categorical Accuracy"}
      }
      else if(metrics[i] == "accuracy")
      {
        metricsList[i] = {item_id: "accuracy", item_text: "Accuracy"}
      }
      else if(metrics[i] == "binary_accuracy")
      {
        metricsList[i] = {item_id: "binary_accuracy", item_text: "Binary Accuracy"}
      } 
    }

    sessionStorage.setItem('metrics', JSON.stringify(metricsList))

    sessionStorage.setItem('modelsList', JSON.stringify(item.models));

    let keys = Object.keys(item.models[0].data);
    let headers = []
    keys.forEach(key =>
      {
        if(item.models[0].data[key] != null)
          headers.push(key);
      })

    sessionStorage.setItem('modelsHeader', JSON.stringify(headers));
    sessionStorage.setItem('modelsTrained', (item.models.length).toString());

    let maxEpoch = item.models[0].parameters['numEpochs'];
    for(let i = 1; i< item.models.length; i++)
    {
        if(item.models[i].parameters['numEpochs'] > maxEpoch)
          maxEpoch = item.models[i].parameters['numEpochs'];
    }

    let labels = [];
    for(let i = 1; i <= maxEpoch; i++)
      labels.push(i);

    sessionStorage.setItem('maxEpoch', maxEpoch.toString());
    sessionStorage.setItem('metricsLabel', JSON.stringify(labels));

    this.cookie.set('filename', item.fileName);
    this.cookie.set('realName', item.realName);
    sessionStorage.setItem('description', item.description);
    sessionStorage.setItem('experimentName', item.name);

    sessionStorage.removeItem('problemType');
    sessionStorage.removeItem('encoding');
    sessionStorage.removeItem('optimizer');
    sessionStorage.removeItem('regularization');
    sessionStorage.removeItem('lossFunction');
    sessionStorage.removeItem('range');
    sessionStorage.removeItem('activationFunction');
    sessionStorage.removeItem('activationFunction');
    sessionStorage.removeItem('regularizationRate');
    sessionStorage.removeItem('epochs');

    this.router.navigate(['dashboard']);

  }

}
