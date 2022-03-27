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

@app.route('/tabledata', methods=['POST'])
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        df = program.filterCSV(PATH + json['FileName'], int(json['Rows']), json['DataType'])

        return df.to_json(orient = 'split')
        
    else:
        return content_type

@app.route('/editcell', methods=['POST'])
def edit_cell():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        df = program.openCSV(PATH + json['FileName'], 0)
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

        df = program.openCSV(PATH + json['FileName'], 0)
        df = program.deleteRow(df,json['rowNumber'])

        file = io.BytesIO()
        df.to_csv(file, mode='b')
        file.seek(0)

        return send_file(file, download_name=json['fileName'])
        
    else:
        return content_type



if __name__ == '__main__':
    app.run()