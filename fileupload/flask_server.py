from distutils.command.upload import upload
from flask import Flask, request, send_file
import json
import file_upload_program
import pandas as pd
import io
import os
from werkzeug.utils import secure_filename

PATH = 'https://localhost:7219/api/Csv/'

app = Flask(__name__)

upload_folder = "uploads/"
if not os.path.exists(upload_folder):
    os.mkdir(upload_folder)

app.config['UPLOAD_FOLDER'] = upload_folder

@app.route("/")
def hello():
    return "Hello World"

@app.route("/upload/<filename>", methods=["POST", "PUT"])
def upload_process(filename):
    filename = secure_filename(filename)
    fileFullPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    with open(fileFullPath, "wb") as f:
        chunk_size = 4096
        #request.stream.write(f)
        chunk = request.stream.read(chunk_size)
        while len(chunk) > 0:
            chunk = request.stream.read(chunk_size)
            f.write(chunk)
    return "ok"


if __name__ == '__main__':
    app.run()
