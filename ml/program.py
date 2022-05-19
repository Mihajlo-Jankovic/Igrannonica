from urllib.request import Request
import tensorflow as tf
import numpy as np
import pandas as pd
import csv
import category_encoders as ce
import urllib
import threading
import requests
import json
from keras.regularizers import L1, L2
from sklearn.preprocessing import LabelEncoder
from tensorflow import keras

ENDPOINT_PATH = 'https://localhost:7219/api/PythonComm/testLive' #https://localhost:7219/api/PythonComm/testLive http://147.91.204.115:10106/api/PythonComm/testLive

path = 'csv\movies.csv'
class CustomCallback(keras.callbacks.Callback):

    modelHistory = {}
    connId = ""
    epochs = 1

    def __init__(self, connID, numEpochs):
        self.connId = connID
        self.modelHistory = {}
        self.epochs = numEpochs

    def on_epoch_end(self, epoch, logs=None):
        keys = list(logs.keys())
        data = {}
        for key in keys:
            if(epoch == 0):
                self.modelHistory[key] = [logs[key]]
            else:
                self.modelHistory[key].append(logs[key])
        data['connID'] = self.connId
        data['epoch'] = epoch
        data['ended'] = 0
        data['trainingData'] = self.modelHistory
        headers = {'content-type': 'application/json'}
        r = requests.post(ENDPOINT_PATH, headers=headers, data=json.dumps(data), verify=False)

    def on_train_end(self, logs=None):
        data = {}
        data['connID'] = self.connId
        data['epoch'] = self.epochs
        data['ended'] = 1
        data['trainingData'] = self.modelHistory
        headers = {'content-type': 'application/json'}
        r = requests.post(ENDPOINT_PATH, headers=headers, data=json.dumps(data), verify=False)
        


# Citanje CSV fajla
def openCSV(path):
    with urllib.request.urlopen(path) as f: 
        header = csv.Sniffer().has_header(f.read().decode('utf-8')) # Proverava da li u fajlu postoji header

    if(header): 
        df = pd.read_csv(path, index_col = False, engine = 'python') 

        #df.columns = [col.lower() for col in df]
        #df.columns = [col.strip('-$%') for col in df]
        #df.columns = [col.strip() for col in df]
        #df.columns = [col.replace(' ','_') for col in df]
    else: 
        df = pd.read_csv(path, index_col = False, header = None, engine = 'python') 

    return df

# Pravljenje modela za treniranje
def build_model(layers, neurons, activation, regularizer, regRate, optimizerType, learningRate, problemType, inputs, outputs, lossFunction, metric):
    model = tf.keras.Sequential()
    # Namestanje regularizera
    if(regularizer == 'L1'):
        reg = L1(regRate)
    elif(regularizer == 'L2'):
        reg = L2(regRate)
    # Input layer
    if(regularizer != 'None'):
        model.add(tf.keras.layers.Dense(neurons[0], activation=activation[0], kernel_regularizer=reg, input_dim=inputs))
    else:
        model.add(tf.keras.layers.Dense(neurons[0], activation=activation[0], input_dim=inputs))
    # Hidden layers
    
    for i in range (1, len(neurons)):
        # Provera da li je izabran regularizer
        if(regularizer != 'None'):
            model.add(tf.keras.layers.Dense(neurons[i], activation=activation[i], kernel_regularizer=reg))
        else:
            model.add(tf.keras.layers.Dense(neurons[i], activation=activation[i]))
    # Output layer
    #model.add(tf.keras.layers.GlobalAveragePooling2D())
    if(problemType == 'Regression'):
        model.add(tf.keras.layers.Dense(1, activation='linear'))
    else:
        if(outputs == 2):
            model.add(tf.keras.layers.Dense(1, activation='sigmoid'))
        else:
            model.add(tf.keras.layers.Dense(outputs, activation='softmax'))
    # Odabir optimizera i podesavanje learning rate-a
    if(optimizerType == 'SGD'):
        optimizer = tf.keras.optimizers.SGD(learningRate)
    elif (optimizerType == 'RMSprop'):
        optimizer = tf.keras.optimizers.RMSprop(learningRate)
    elif (optimizerType == 'Adam'):
        optimizer = tf.keras.optimizers.Adam(learningRate)
    elif (optimizerType == 'Adadelta'):
        optimizer = tf.keras.optimizers.Adadelta(learningRate)
    elif (optimizerType == 'Adagrad'):
        optimizer = tf.keras.optimizers.Adagrad(learningRate)
    elif (optimizerType == 'Adamax'):
        optimizer = tf.keras.optimizers.Adamax(learningRate)
    elif (optimizerType == 'Nadam'):
        optimizer = tf.keras.optimizers.Nadam(learningRate)
    elif (optimizerType == 'Ftrl'):
        optimizer = tf.keras.optimizers.Ftrl(learningRate)
            
    model.compile(optimizer, loss=lossFunction , metrics=metric)

    return model

def encode(df, encodingList):
    for col in df:
        for colName in encodingList[0]:
            if(col == colName):
                index = encodingList[0].index(colName)
                encodingType = encodingList[1][index]
                
                # Label encoding
                if(encodingType == 'label'):
                    encoder = LabelEncoder()
                    df[col] = encoder.fit_transform(df[col])

                # One-hot encoding
                elif(encodingType == 'one-hot'):
                    df = pd.get_dummies(df, columns=[col], prefix = [col])

                # Binary encoding
                elif(encodingType == 'binary'):
                    encoder = ce.BinaryEncoder(cols=[col])
                    df = encoder.fit_transform(df)
                
                # Frequency encoding
                elif(encodingType == 'frequency'):
                    encoder = df.groupby(col).size()/len(df)
                    df.loc[:,col + '_freq'] = df[col].map(encoder)

                '''
                # Backward encoding (ima problem sa duplikatima indexa)
                elif(encodingType == 'backward'):
                    encoder = ce.BackwardDifferenceEncoder(cols=[col])
                    df = encoder.fit_transform(df)

                    print()
                    print()
                    print(df[df.index.duplicated()])
                    print()
                    print()
                
                #Mean encoder (Treba da bude poznat izlaz)
                elif(encodingType == 'mean'):
                        encoder = df.groupby(col)[IZLAZ].mean()
                        df.loc[:, col + '_mean'] = df[col].map(encoder)
                '''            
    return df

# Izbacivanje kolona koje nisu input i output
def input_output(df, inputList, outputList):
    df.drop(columns=[col for col in df if col not in (inputList + outputList)], inplace=True)

# Pripremanje podataka za trening
def prepare_data(df, inputList, outputList, encodingList, testSize):

    input_output(df, inputList, outputList)
    df = encode(df, encodingList)

    df = df.dropna()
    
    tmpTrain = df.sample(frac=1 - testSize, random_state=0)
    tmpTest = df.drop(tmpTrain.index)

    X_train = tmpTrain.copy()
    X_test = tmpTest.copy()

    y_train = X_train.pop(outputList[0])
    y_test = X_test.pop(outputList[0])

    return (X_train, X_test, y_train, y_test)

def output_unique_values(df,output):
    return df[output].nunique()

def startTraining(connid, fileName, inputList, output, encodingList, ratio1, ratio2, numLayers, layerList, activationFunctions, regularization, regularizationRate, optimizer, learningRate, problemType, lossFunction, metrics, numEpochs):
    PATH = 'http://127.0.0.1:10108/downloadFile/'
    headers = {'content-type': 'application/json'}
    data = {}
    data['connID'] = connid
    data['epoch'] = numEpochs
    data['ended'] = 2
    i = 0


    df = openCSV(PATH + fileName)
    X_train, X_test, y_train, y_test = prepare_data(df, inputList, [output], encodingList, ratio1)
    outputUniqueValues = output_unique_values(df,output)
    m = build_model(numLayers, layerList, activationFunctions, regularization, regularizationRate, optimizer, learningRate, problemType, len(X_train.columns), outputUniqueValues, lossFunction, metrics)
    m.summary()
    
    try:
        model = m.fit(x=X_train, y=y_train, validation_split=ratio2, epochs=numEpochs, callbacks=[CustomCallback(connid, numEpochs)])
        score = m.evaluate(X_test, y_test)
    
        data['trainingData'] = {"loss" : score[i]}
        i = i + 1

        for metric in metrics:
            data['trainingData'][metric] = score[i]
            i = i + 1
        r = requests.post(ENDPOINT_PATH, headers=headers, data=json.dumps(data), verify=False)
        return {"message" : "Training started successfully."}
    except: 
        data['trainingData'] = {}
        data['ended'] = 3
        print(data)
        r = requests.post(ENDPOINT_PATH, headers=headers, data=json.dumps(data), verify=False)
        return {"message" : "Training failed."}
    

# t1 = threading.Thread(target=testiranje)

# t1.start()