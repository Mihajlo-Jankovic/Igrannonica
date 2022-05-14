import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, send_file
from numpy import true_divide
from werkzeug.utils import secure_filename
import pandas as pd
import FileStorageProgram
import json
import io

UPLOAD_FOLDER = os.path.join('Resources','CSVFiles')
ALLOWED_EXTENSIONS = {'csv'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadFile', methods=['GET', 'POST'])
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return {'message' : "No file part."}
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        flash('No selected file')
        return {'message' : "No selected file."}
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return {'message' : "Upload Successfull!", 'randomFileName' : filename}

@app.route('/downloadFile/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route('/deleteFile/<filename>', methods=['GET'])
def delete_file(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if(os.path.isfile(filepath)):
    
        #os.remove() function to remove the file
        os.remove(filepath)
        
        #Printing the confirmation message of deletion
        return {"message" : "Dataset successfully deleted."}
    return {"message" : "Error encoundered while deleting dataset."}


# Kontroler za prikaz podataka u tabeli
@app.route('/tabledata', methods=['POST'])
def table_data():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        jsonObject = request.json

        filterList = FileStorageProgram.filterCSV(os.path.join(app.config['UPLOAD_FOLDER'], jsonObject['FileName']), int(jsonObject['Rows']), jsonObject['DataType'], jsonObject['PageNum'])
        df = filterList[0]
        numOfPages = filterList[1]
        numericValues = FileStorageProgram.numericValues(os.path.join(app.config['UPLOAD_FOLDER'], jsonObject['FileName']))

        return {'csv': json.loads(df.to_json(orient = 'split')), 'numericValues': numericValues, 'numOfPages': numOfPages}
        
    else:
        return {"message" : "Error encoundered while reading dataset content."}

# Kontroler za prikaz statistickih podataka
@app.route('/statistics', methods=['POST'])
def statistics():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        jsonObject = request.json

        dictionary = FileStorageProgram.statistics(FileStorageProgram.openCSV(os.path.join(app.config['UPLOAD_FOLDER'], jsonObject['FileName'])),int(jsonObject['ColIndex']))
        json_object = json.dumps(dictionary) 
        
        return json_object
        
    else:
        return {"message" : "Error encoundered while calculating statistics."}

@app.route('/editcell', methods=['POST'])
def edit_cell():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json
        df = FileStorageProgram.openCSV(os.path.join(app.config['UPLOAD_FOLDER'], json['fileName']))
        df = FileStorageProgram.editCell(df,int(json['rowNumber']), json['columnName'], json['value'])

        
        df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'], json['fileName']), index=False)

        return {"message" : "Edit successfull."}
        
    else:
        return {"message" : "Error encoundered while editing cell content."}


@app.route('/deleterow', methods=['POST'])
def delete_row():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json
        df = FileStorageProgram.openCSV(os.path.join(app.config['UPLOAD_FOLDER'], json['fileName']))
        df = FileStorageProgram.deleteRow(df,json['rowNumber'])

        df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'], json['fileName']), index=False)

        return {"message" : "Delete successfull."}
        
    else:
        return {"message" : "Error encoundered while deleting a row from the dataset."}

@app.route('/fillMissingValues', methods=['POST'])
def fill_missing_values():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json; charset=utf-8'):
        json = request.json
        df = FileStorageProgram.openCSV(os.path.join(app.config['UPLOAD_FOLDER'], json['fileName']))
        print(df.isnull().sum())
        df = FileStorageProgram.missing_values(df, json["colName"], json["fillMethod"], json["specificVal"])

        
        df.to_csv(os.path.join(app.config['UPLOAD_FOLDER'], json['fileName']), index=False)

        return {"message" : "Edit successfull."}
        
    else:
        return {"message" : "Error encoundered while editing cell content."}

if __name__ == '__main__':
    app.run(port=10108)