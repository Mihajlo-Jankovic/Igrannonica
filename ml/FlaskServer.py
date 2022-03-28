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

# Kontroler za prikaz podataka u tabeli
@app.route('/tabledata', methods=['POST'])
def table_data():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        jsonObject = request.json

        filterList = program.filterCSV('https://localhost:7219/api/Csv/' + jsonObject['FileName'], int(jsonObject['Rows']), jsonObject['DataType'], jsonObject['PageNum'])
        df = filterList[0]
        numOfPages = filterList[1]
        numericValues = program.numericValues('https://localhost:7219/api/Csv/' + jsonObject['FileName'])

        return {'csv': json.loads(df.to_json(orient = 'split')), 'numericValues': numericValues, 'numOfPages': numOfPages}
        
    else:
        return content_type

# Kontroler za prikaz statistickih podataka
@app.route('/statistics', methods=['POST'])
def statistics():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        jsonObject = request.json

        dictionary = program.statistics(program.openCSV('https://localhost:7219/api/Csv/' + jsonObject['FileName'],0),int(jsonObject['ColIndex']))
        json_object = json.dumps(dictionary) 
        
        return json_object
        
    else:
        return content_type

if __name__ == '__main__':
    app.run()
