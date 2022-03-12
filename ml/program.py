import tensorflow as tf
import pandas as pd
import csv

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

df.dropna()

stats = statistics(df,8)

# Konvertovanje dataFrame-a iz Pandasa u TensorFlow test v1
print(df.columns)

print(df.dtypes)

numeric_feature_names = ['runtime_(minutes)', 'rating', 'votes',  'revenue_(millions)']
numeric_features = df[numeric_feature_names]

tf.convert_to_tensor(numeric_features)