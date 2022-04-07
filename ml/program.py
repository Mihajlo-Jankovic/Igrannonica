import tensorflow as tf
import numpy as np
import pandas as pd
import csv
from keras.regularizers import L1, L2
from sklearn.preprocessing import LabelEncoder
import category_encoders as ce
import urllib

path = 'csv\movies.csv'

# Proveravanje broja stranica
def numberOfPages(df,rowNum):
    numOfPages = len(df)
    
    if(numOfPages % rowNum != 0):
        numOfPages //= rowNum
        numOfPages += 1

    else:
        numOfPages /= rowNum
        numOfPages = int(numOfPages)

    return numOfPages

# Izracunavanje statistika za odredjenu kolonu iz tabele
def statistics(df,colIndex):
    col = df.columns[colIndex]

    rowsNum = df.shape[0] # Ukupan broj podataka za kolonu
    min = round(float(df[col].min()), 3) # Minimum
    max = round(float(df[col].max()), 3) # Maksimum
    avg = round(df[col].mean(), 3) # Srednja vrednost
    med = round(df[col].median(), 3) # Mediana
    firstQ, thirdQ = df[col].quantile([.25, .75]) # Prvi i treci kvartil
    firstQ = round(firstQ,3)
    thirdQ = round(thirdQ,3)
    corrMatrix = df.corr() # Korelaciona matrica

    iqr = thirdQ - firstQ

    lower_bound = firstQ - 1.5 * iqr
    upper_bound = thirdQ + 1.5 * iqr

    outliers = []
    for value in df[col]:
        if(value < lower_bound or value > upper_bound): 
            outliers.append(value)

    print(outliers)

    corrArr = []
    for value in corrMatrix[df.columns[colIndex]]:
        corrArr.append(round(value,3))

    colArr = []
    valArr = []
    for col in corrMatrix:
        colArr.append(col)

        tmpArr = []
        for value in corrMatrix[col]:
            tmpArr.append(round(value,3))
        
        valArr.append(tmpArr)

    return {"rowsNum": rowsNum, "min": min, "max": max, "avg": avg, "med": med,
            "firstQ": firstQ, "thirdQ": thirdQ, "outliers": outliers, 
            "corrMatrix": {colIndex: corrArr},
            "fullCorrMatrix": {"columns": colArr, "values": valArr}}


    '''
    colList = []
    jsonList = []

    for col in df:
        if(df[col].dtypes == object): continue

        rowsNum = df.shape[0] # Ukupan broj podataka za kolonu
        min = round(float(df[col].min()), 3) # Minimum
        max = round(float(df[col].max()), 3) # Maksimum
        avg = round(df[col].mean(), 3) # Srednja vrednost
        med = round(df[col].median(), 3) # Mediana
        firstQ, thirdQ = df[col].quantile([.25, .75]) # Prvi i treci kvartil
        firstQ = round(firstQ,3)
        thirdQ = round(thirdQ,3)
        corrMatrix = df.corr() # Korelaciona matrica

        iqr = thirdQ - firstQ

        lower_bound = firstQ - 1.5 * iqr
        upper_bound = thirdQ + 1.5 * iqr

        outliers = []
        for value in df[col]:
            if(value < lower_bound or value > upper_bound): 
                outliers.append(value)
                
        corrArr = []
        for value in corrMatrix[col]:
            corrArr.append(round(value,3))
        
        colArr = []
        valArr = []
        for column in corrMatrix:
            colArr.append(column)

            tmpArr = []
            for value in corrMatrix[column]:
                tmpArr.append(round(value,3))
            
            valArr.append(tmpArr)
        
        colList.append(col)
        jsonList.append({"rowsNum": rowsNum, "min": min, "max": max, "avg": avg, "med": med,
                         "firstQ": firstQ, "thirdQ": thirdQ, "outliers": outliers, 
                         "corrMatrix": {col: corrArr},
                         "fullCorrMatrix": {"columns": colArr, "values": valArr}})
    
    return { "colList:": colList, "jsonList": jsonList }
    '''

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
def build_model(layers, neurons, activation, regularizer, regRate, optimizerType, learningRate, problemType, outputs, lossFunction, metric):
    model = tf.keras.Sequential()
    # Namestanje regularizera
    if(regularizer == 'L1'):
        reg = L1(regRate)
    elif(regularizer == 'L2'):
        reg = L2(regRate)
    # Input layer
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

''' 
df = openCSV(path)

df.dropna()

stats = statistics(df,8)

# Konvertovanje dataFrame-a iz Pandasa u TensorFlow test v1
print(df.columns)

print(df.dtypes)

numeric_feature_names = ['runtime_(minutes)', 'rating', 'votes',  'revenue_(millions)']
numeric_features = df[numeric_feature_names]

tf.convert_to_tensor(numeric_features)
'''

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

def paging(df,rowNum,pageNum):
    row = rowNum * (pageNum - 1)   
    return df.loc[np.r_[row:row+rowNum], :]

# Filtriranje CSV fajlova prema parametrima klijenta
def filterCSV(path, rowNum, dataType, pageNum):
    df = openCSV(path)
    
    numOfPages = numberOfPages(df,rowNum)

    df = paging(df,rowNum,pageNum)

    if(dataType == 'not null'):
        df = df.dropna()

    elif(dataType == 'null'):
        na_free = df.dropna()
        df = df[~df.index.isin(na_free.index)]

    

    return [df,numOfPages]

# Odredjivanje numerickih kolona
def numericValues(path):
    colList = []
    indexList = []

    df = openCSV(path)

    for col in df:
        if(df[col].dtypes != object):
            colList.append(col)
            indexList.append(df.columns.get_loc(col))

    return {'index': indexList, 'col': colList}

# Izmena reda u CSV fajlu
def editCell(df, rowNum, colName, value):
    print(rowNum)
    df.at[rowNum,colName] = value

    return df

#Brisanje reda iz CSV fajl-a
def deleteRow(df,rowNum):
    df.drop(rowNum, axis = 0, inplace=True)

    return df

#df = pd.read_csv(path, index_col = 0, nrows = 10) 
#editCell(df,2,'Votes',21)
#print(df)

'''
df = openCSV(path,0)
X_train, X_test, y_train, y_test = prepare_data(df, ['title','genre'], ['metascore'], 'label', 0.2)
print(X_train, X_test, y_train, y_test)

m = build_model(2, [10,10], 'linear', 'None', 0, 'Adam', 0.001, 2, 'Regression', 10, 'mean_squared_error', ['mse'])
print(m)
m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=10)
'''

def testiranje():
    df = pd.read_csv(path)
    X_train, X_test, y_train, y_test = prepare_data(df, ['Title','Genre'], ['Metascore'], 'label', 0.2)
    print(X_train, X_test, y_train, y_test)

    m = build_model(6, [8,8,8,8,8,8], 'relu', 'None', 0, 'Adam', 0.001, 'Regression', 10, 'mean_squared_error', ['mse', 'mae'])
    print(m)
    model = m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=10)
    return model.history

def startTraining(fileName, inputList, output, encodingType, ratio, numLayers, layerList, activationFunction, regularization, regularizationRate, optimizer, learningRate, problemType, lossFunction, metrics, numEpochs):
    PATH = 'https://localhost:7219/api/Csv/'
    df = openCSV(PATH + fileName)
    X_train, X_test, y_train, y_test = prepare_data(df, inputList, [output], encodingType, ratio)

    m = build_model(numLayers, layerList, activationFunction, regularization, regularizationRate, optimizer, learningRate, problemType, 10, lossFunction, metrics)
    model = m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=numEpochs)
    return model.history
