import tensorflow as tf
import numpy as np
import pandas as pd
import csv
from keras.regularizers import L1, L2
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import category_encoders as ce
import urllib.request

'''
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()
X_train.shape, y_train.shape, X_test.shape, y_test.shape

X_train = X_train / 255
X_test = X_test / 255
'''

#tf.enable_eager_execution()

#defaults = [tf.int32] * 55
#dataset = tf.contrib.data.CsvDataset(path, defaults)

'''
tmp = [21,22,-108,31,-1,32,34,31]
dataset = tf.data.Dataset.from_tensor_slices(tmp)

print()
print()
print()
print(dataset)

for i in dataset:
    print(i)
'''


'''
with open(path,'r') as infile:
    reader = csv.reader(infile, delimiter=',')
    header = next(reader)

    for row in reader:
        print(row[0])
'''

# Izracunavanje statistika za odredjenu kolonu iz tabele
def statistics(df,colIndex):
    col = df.columns[colIndex]

    rowsNum = df.shape[0] # Ukupan broj podataka za kolonu
    min = df[col].min() # Minimum
    max = df[col].max() # Maksimum
    avg = df[col].mean() # Srednja vrednost
    med = df[col].median() # Mediana
    firstQ, thirdQ = df[col].quantile([.25, .75]) # Prvi i treci kvartil
    corrMatrix = df.corr() # Korelaciona matrica

    return (rowsNum,min,max,avg,med,firstQ,thirdQ,corrMatrix)


path = 'csv\movies.csv'

def openCSV(path,rowNum):
    with urllib.request.urlopen(path) as f: 
        #print(f)
        #header = True
        header = csv.Sniffer().has_header(f.read().decode('utf-8')) # Proverava da li u fajlu postoji header

    if(header): 
        if(rowNum != 0): df = pd.read_csv(path, index_col = 0, nrows = rowNum) 
        else: df = pd.read_csv(path, index_col = 0) 

        df.columns = [col.lower() for col in df]
        df.columns = [col.strip('-$%') for col in df]
        df.columns = [col.strip() for col in df]
        df.columns = [col.replace(' ','_') for col in df]
    else: 
        if(rowNum != 0): df = pd.read_csv(path, header = None, nrows = rowNum) 
        else: df = pd.read_csv(path, header = None) 

    return df

def build_model(layers, neurons, activation, regularizer, regRate, optimizerType, learningRate, inputs, problemType, outputs, lossFunction, metric):
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
        model.add(tf.keras.layers.Dense(1, activation='linear'))
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
    
    tmpTrain = df.sample(frac=0.8, random_state=0)
    tmpTest = df.drop(tmpTrain.index)

    X_train = tmpTrain.copy()
    X_test = tmpTest.copy()

    y_train = X_train.pop(outputList[0])
    y_test = X_test.pop(outputList[0])

    return (X_train, X_test, y_train, y_test)

# Filtriranje CSV fajlova prema parametrima klijenta
def filterCSV(path, rowNum, dataType):
    df = openCSV(path,rowNum)

    if(dataType == 'not null'):
        df = df.dropna()

    elif(dataType == 'null'):
        na_free = df.dropna()
        df = df[~df.index.isin(na_free.index)]

    return df

'''
df = openCSV(path,0)
X_train, X_test, y_train, y_test = prepare_data(df, ['title','genre'], ['metascore'], 'label', 0.2)
print(X_train, X_test, y_train, y_test)

m = build_model(2, [10,10], 'linear', 'None', 0, 'Adam', 0.001, 2, 'Regression', 10, 'mean_squared_error', ['mse'])
print(m)
m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=10)
'''