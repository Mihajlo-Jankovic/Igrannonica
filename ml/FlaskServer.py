from flask import Flask, request, send_file
import json
import program
import pandas as pd
import io

PATH = 'https://localhost:7219/api/Csv/'

app = Flask(__name__)




@app.route('/startTraining', methods=['POST'])
def startTraining():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        modelHistory = program.startTraining(json['connID'],json['fileName'], json['inputList'], json['output'], json['encodingType'], json['ratio'], json['numLayers'], json['layerList'], json['activationFunction'], json['regularization'], json['regularizationRate'], json['optimizer'], json['learningRate'], json['problemType'], json['lossFunction'], json['metrics'], json['numEpochs'])
        return modelHistory
    
    else:
        return content_type


if __name__ == '__main__':
    app.run(port=10107)
