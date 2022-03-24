from flask import Flask, request
import json
import program
import pandas as pd

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

       # df = program.filterCSV('https://localhost:7219/api/Csv/' + json['FileName'], int(json['Rows']), json['DataType'])
        print(json['FileName'])
        df = pd.read_csv('https://localhost:7219/api/Csv/' +json['FileName'])

        return df.to_json(orient = 'split')
        
    else:
        return content_type

if __name__ == '__main__':
    app.run()