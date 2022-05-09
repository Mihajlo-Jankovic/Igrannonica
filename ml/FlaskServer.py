from flask import Flask, request, send_file
import json
import program
import pandas as pd
import io
import threading

app = Flask(__name__)

@app.route('/startTraining', methods=['POST'])
def startTraining():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        #modelHistory = program.startTraining(json['connID'],json['fileName'], json['inputList'], json['output'], json['encodingType'], json['ratio'], json['numLayers'], json['layerList'], json['activationFunction'], json['regularization'], json['regularizationRate'], json['optimizer'], json['learningRate'], json['problemType'], json['lossFunction'], json['metrics'], json['numEpochs'])
        thread = threading.Thread(target=program.startTraining, args=[json['connID'],json['fileName'], json['inputList'], json['output'], json['encodingType'], json['ratio1'], json['ratio2'], json['numLayers'], json['layerList'], json['activationFunction'], json['regularization'], json['regularizationRate'], json['optimizer'], json['learningRate'], json['problemType'], json['lossFunction'], json['metrics'], json['numEpochs']])
        thread.start()
        print(json['ratio1'], json['ratio2'])
        return {"message" : "Training started"}
    
    else:
        return content_type

if __name__ == '__main__':
    app.run(port=10107)
