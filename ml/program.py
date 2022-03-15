import tensorflow as tf
import pandas as pd
import csv
from keras.regularizers import L1, L2

(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()
X_train.shape, y_train.shape, X_test.shape, y_test.shape

X_train = X_train / 255
X_test = X_test / 255


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


#path = 'csv\movies.csv'

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

def build_model(layers, neurons, activation, regularizer, regRate, optimizerType, learningRate, inputs, problemType, outputs, lossFunction, metric):
    model = tf.keras.Sequential()
    # Namestanje regularizera
    if(regularizer == 'L1'):
        reg = L1(regRate)
    elif(regularizer == 'L2'):
        reg = L2(regRate)
    # Input layer
    model.add(tf.keras.layers.Input((inputs, 28)))
    model.add(tf.keras.layers.Flatten())
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

m = build_model(2, [10,10], 'relu', 'None', 0, 'SGD', 0.001, 28, 'Classification', 10, 'sparse_categorical_crossentropy', ['binary_accuracy', 'categorical_accuracy'])
print(m)
m.fit(x=X_train, y=y_train, validation_data=(X_test, y_test), epochs=10)

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