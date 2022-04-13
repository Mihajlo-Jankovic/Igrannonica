from flask import Flask, request, send_file
import json
import program
import pandas as pd
import io

PATH = 'https://localhost:7219/api/Csv/'

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World"

@app.route("/simpleget", methods=['GET'])
def tableData():
    return json.dumps({'Title': 'test', 'Body': 'test', 'UserId' : 4})


@app.route('/startTraining', methods=['POST'])
def startTraining():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        modelHistory = program.startTraining(json['fileName'], json['inputList'], json['output'], json['encodingType'], json['ratio'], json['numLayers'], json['layerList'], json['activationFunction'], json['regularization'], json['regularizationRate'], json['optimizer'], json['learningRate'], json['problemType'], json['lossFunction'], json['metrics'], json['numEpochs'])
        return modelHistory
    
    else:
        return content_type

@app.route('/testiranje', methods=['GET'])
def probaIspisa():
    history = program.testiranje()
    return history

if __name__ == '__main__':
    app.run()
