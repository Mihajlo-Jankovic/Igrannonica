from flask import Flask, request
import json
import program

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

        df = program.filterCSV('csv' + "\\" + json['FileName'], int(json['Rows']), json['DataType'])

        return df.to_json(orient = 'split')
        
    else:
        return content_type

if __name__ == '__main__':
    app.run()