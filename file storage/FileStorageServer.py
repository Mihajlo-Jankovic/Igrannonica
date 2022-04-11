import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory
from numpy import true_divide
from werkzeug.utils import secure_filename
import pandas as pd

AUTHORIZED_FOLDER = 'resources\CSVFiles'
UNAUTHORIZED_FOLDER = 'resources\CSVFilesUnauthorized'
ALLOWED_EXTENSIONS = {'csv'}

app = Flask(__name__)
app.config['AUTHORIZED_FOLDER'] = AUTHORIZED_FOLDER
app.config['UNAUTHORIZED_FOLDER'] = UNAUTHORIZED_FOLDER 

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def isAuthorized(flag):
    if flag==1:
        return True
    return False

@app.route('/uploadFileAuthorized/<authorization>', methods=['GET', 'POST'])
def upload_file_authorized(authorization):
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
        if authorization == "authorized":
            file.save(os.path.join(app.config['AUTHORIZED_FOLDER'], filename))
        else:
            file.save(os.path.join(app.config['UNAUTHORIZED_FOLDER'], filename))
        return {'message' : "Upload Successfull!"}

@app.route('/downloadFile', methods=['GET'])
def download_file():
    args = request.args
    if(args['authorization'] == "authorized"):
        return send_from_directory(app.config["AUTHORIZED_FOLDER"], args['name'])
    else:
        return send_from_directory(app.config["UNAUTHORIZED_FOLDER"], args['name'])

@app.route("/")
def hello():
    return "Hello World"

if __name__ == '__main__':
    app.run(port=8000)