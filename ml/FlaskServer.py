from flask import Flask, request, send_file
import json
import program
import pandas as pd
import io

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

        df = program.filterCSV('https://localhost:7219/api/Csv/' + json['FileName'], int(json['Rows']), json['DataType'])
        #print(json['FileName'])
        #df = pd.read_csv('https://localhost:7219/api/Csv/' +json['FileName'])

        return df.to_json(orient = 'split')
        
    else:
        return content_type

@app.route('/editcell', methods=['GET'])
def edit_cell():
    '''content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):'''
        #json = request.json

    df = pd.read_csv('csv\movies.csv', index_col = 0, nrows = 10) 
    df = program.editCell(df,2,'Title',"string")

        #df.to_csv('https://localhost:7219/api/Csv/updateFile/5fnoop501qs.csv')

        #df = program.openCSV('https://localhost:7219/api/Csv/' + json['FileName'], 0)
        #df = program.editCell(df,json['rowNumber '], json['columnName'], json['value'])

    file = io.BytesIO()
    df.to_csv(file,mode='b')
    file.seek(0)
    return send_file(file,download_name="movies.csv")
            
    '''else:
        return content_type'''
'''
@app.delete_row('/deleterow', methods=['POST'])
def delete_row():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json

        df = program.filterCSV('https://localhost:7219/api/Csv/' + json['FileName'], int(json['Rows']), json['DataType'])
        #print(json['FileName'])
        #df = pd.read_csv('https://localhost:7219/api/Csv/' +json['FileName'])

        return df.to_json(orient = 'split')
        
    else:
        return content_type
'''



if __name__ == '__main__':
    app.run()