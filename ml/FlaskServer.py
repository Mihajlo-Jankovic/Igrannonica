from flask import Flask, request
import json, cgi

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World"

@app.route("/tabledata", methods=['GET'])
def tableData():
    return json.dumps({'Title': 'test', 'Body': 'test', 'UserId' : 4})

@app.route('/post', methods=['POST'])
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json
        json['received'] = 'ok'
        return json
    else:
        return content_type

if __name__ == '__main__':
    app.run()