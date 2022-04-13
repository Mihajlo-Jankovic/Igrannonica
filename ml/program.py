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


path = 'csv\movies.csv'

class CustomCallback(keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        keys = list(logs.keys())
        modelHistory = {}
        print(" ")
        for key in keys:
            modelHistory[key] = logs[key]
        print(modelHistory)

        headers = {'content-type': 'application/json'}
        r = requests.post("https://localhost:7219/api/PythonComm/testLive", headers=headers, data=json.dumps(modelHistory), verify=False)
        print(r)

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
    tf.keras.layers.InputLayer(input_shape=(inputs,)),
    #model.add(tf.keras.layers.Input((inputs,)))
    #model.add(tf.keras.layers.Flatten())
    # Hidden layers
    for i in range(layers):
        # Provera da li je izabran regularizer
        if(regularizer != 'None'):
            model.add(tf.keras.layers.Dense(neurons[i], activation=activation, kernel_regularizer=reg))
        else:
            model.add(tf.keras.layers.Dense(neurons[i], activation=activation))
    # Output layer
    if(problemType == 'Regression'):
        model.add(tf.keras.layers.Dense(1, activation='sigmoid'))
    else:
        model.add(tf.keras.layers.Dense(outputs, activation='softmax'))
    # Odabir optimizera i podesavanje learning rate-a
    match optimizerType:
        case 'SGD':
            optimizer = tf.keras.optimizers.SGD(learningRate)
        case 'RMSprop':
            optimizer = tf.keras.optimizers.RMSprop(learningRate)
        case 'Adam':
            optimizer = tf.keras.optimizers.Adam(learningRate)
        case 'Adadelta':
            optimizer = tf.keras.optimizers.Adadelta(learningRate)
        case 'Adagrad':
            optimizer = tf.keras.optimizers.Adagrad(learningRate)
        case 'Adamax':
            optimizer = tf.keras.optimizers.Adamax(learningRate)
        case 'Nadam':
            optimizer = tf.keras.optimizers.Nadam(learningRate)
        case 'Ftrl':
            optimizer = tf.keras.optimizers.Ftrl(learningRate)
            
    model.compile(optimizer, loss=lossFunction , metrics=metric)

    return model

def encode(df, encodingType):
    for col in df:
        
        # Provera da li je kolona kategorijska
        if(df[col].dtypes == object):
            
            # Label encoding
            if(encodingType == 'label'):
                encoder = LabelEncoder()
                df[col] = encoder.fit_transform(df[col])

            # One-hot encoding
            elif(encodingType == 'one-hot'):
                df = pd.get_dummies(df, columns=[col], prefix = [col])
                print(df.head)

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
def prepare_data(df, inputList, outputList, encodingType, testSize):

    input_output(df, inputList, outputList)
    df = encode(df, encodingType)

    df = df.dropna()
    
    tmpTrain = df.sample(frac=1 - testSize, random_state=0)
    tmpTest = df.drop(tmpTrain.index)

    X_train = tmpTrain.copy()
    X_test = tmpTest.copy()

    y_train = X_train.pop(outputList[0])
    y_test = X_test.pop(outputList[0])

    return (X_train, X_test, y_train, y_test)

def testiranje():
    df = pd.read_csv(path)
    X_train, X_test, y_train, y_test = prepare_data(df, ['Title','Genre'], ['Metascore'], 'label', 0.2)
    #print(X_train, X_test, y_train, y_test)

    m = build_model(6, [8,8,8,8,8,8], 'relu', 'None', 0, 'Adam', 0.001, 'Regression', 10, 'mean_squared_error', ['mse', 'mae'])
    #print(m)
    model = m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=10, callbacks=[CustomCallback()])
    return model.history

def startTraining(fileName, inputList, output, encodingType, ratio, numLayers, layerList, activationFunction, regularization, regularizationRate, optimizer, learningRate, problemType, lossFunction, metrics, numEpochs):
    PATH = 'http://127.0.0.1:8000/downloadFile/'
    df = openCSV(PATH + fileName)
    X_train, X_test, y_train, y_test = prepare_data(df, inputList, [output], encodingType, ratio)

    m = build_model(numLayers, layerList, activationFunction, regularization, regularizationRate, optimizer, learningRate, problemType, len(inputList), 10, lossFunction, metrics)
    model = m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=numEpochs)
    return model.history

# t1 = threading.Thread(target=testiranje)

# t1.start()

