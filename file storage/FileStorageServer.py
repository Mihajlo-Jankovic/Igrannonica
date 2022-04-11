import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory
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

@app.route('/uploadFileAuthorized', methods=['GET', 'POST'])
def upload_file_authorized():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['AUTHORIZED_FOLDER'], filename))
            return redirect(url_for('download_authorized_file', name=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
        <input type=file name=file>
        <input type=submit value=Upload>
    </form>
    '''

@app.route('/uploadFileUnauthorized', methods=['GET', 'POST'])
def upload_file_unauthorized():
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
        file.save(os.path.join(app.config['UNAUTHORIZED_FOLDER'], filename))
        return {'message' : "Upload Successfull!"}

@app.route('/downloadAuthorized/<name>')
def download_authorized_file(name):
    return send_from_directory(app.config["AUTHORIZED_FOLDER"], name)

@app.route('/downloadUnauthorized/<name>')
def download_unauthorized_file(name):
    return send_from_directory(app.config["UNAUTHORIZED_FOLDER"], name)

@app.route("/")
def hello():
    return "Hello World"

if __name__ == '__main__':
    app.run(port=8000)