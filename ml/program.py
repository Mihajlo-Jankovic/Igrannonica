#import tensorflow as tf
import numpy as np
import pandas as pd
import csv
import keras as ks
from keras.layers import Dense, Input
from keras.regularizers import L1, L2
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import category_encoders as ce

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

def openCSV(path):
    with open(path) as f: 
        header = csv.Sniffer().has_header(f.read(1024)) # Proverava da li u fajlu postoji header

    if(header): 
        df = pd.read_csv(path, index_col = 0) 
        df.columns = [col.lower() for col in df]
        df.columns = [col.strip('-$%') for col in df]
        df.columns = [col.strip() for col in df]
        df.columns = [col.replace(' ','_') for col in df]
    else: 
        df = pd.read_csv(path, header = None) 

    return df

def build_model(layers, neurons, activation, regularizer, regRate, optimizer, optRate, inputs, problemType, outputs):
    model = ks.Sequential()
    # Namestanje regularizera
    if(regularizer == 'L1'):
        reg = L1(regRate)
    elif(regularizer == 'L2'):
        reg = L2(regRate)
    # Input layer
    model.add(Input((inputs, )))
    # Hidden layers
    for i in range(layers):
        # Provera da li je izabran regularizer
        if(regularizer != 'None'):
            model.add(Dense(neurons[i], activation=activation, kernel_regularizer=reg))
        else:
            model.add(Dense(neurons[i], activation=activation))
    # Output layer
    if(problemType == 'Regression'):
        model.add(Dense(1, activation='linear'))
    else:
        model.add(Dense(outputs, activation='softmax'))
    
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

def input_output():
    pass

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

    x = df.drop(inputList, axis=1)
    X = x.values

    y = df.drop(outputList, axis=1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = testSize, random_state=0)

    return (X_train, X_test, y_train, y_test)

'''
df = openCSV(path)
print(prepare_data(df, ['title','genre'], ['metascore'], 'label', 0.2))
'''