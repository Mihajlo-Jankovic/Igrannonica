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

# Kontroler za prikaz podataka u tabeli
@app.route('/tabledata', methods=['POST'])
def table_data():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        jsonObject = request.json

        filterList = program.filterCSV(PATH + jsonObject['FileName'], int(jsonObject['Rows']), jsonObject['DataType'], jsonObject['PageNum'])
        df = filterList[0]
        numOfPages = filterList[1]
        numericValues = program.numericValues(PATH + jsonObject['FileName'])

        return {'csv': json.loads(df.to_json(orient = 'split')), 'numericValues': numericValues, 'numOfPages': numOfPages}
        
    else:
        return content_type

# Kontroler za prikaz statistickih podataka
@app.route('/statistics', methods=['POST'])
def statistics():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        jsonObject = request.json

        dictionary = program.statistics(program.openCSV(PATH + jsonObject['FileName']),int(jsonObject['ColIndex']))
        json_object = json.dumps(dictionary) 
        
        return json_object
        
    else:
        return content_type

@app.route('/editcell', methods=['POST'])
def edit_cell():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        df = program.openCSV(PATH + json['FileName'])
        df = program.editCell(df,int(json['rowNumber']), json['columnName'], json['value'])

        file = io.BytesIO()
        df.to_csv(file, mode='b')
        file.seek(0)

        return send_file(file, download_name=json['fileName'])
            
    else:
        return content_type


@app.route('/deleterow', methods=['POST'])
def delete_row():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        df = program.openCSV(PATH + json['FileName'])
        df = program.deleteRow(df,json['rowNumber'])

        file = io.BytesIO()
        df.to_csv(file, mode='b')
        file.seek(0)

        return send_file(file, download_name=json['fileName'])
        
    else:
        return content_type

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
