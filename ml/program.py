import tensorflow as tf
import pandas as pd
import csv

#tf.enable_eager_execution()

path = 'csv\movies.csv'

#defaults = [tf.int32] * 55
#dataset = tf.contrib.data.CsvDataset(path, defaults)

tmp = [21,22,-108,31,-1,32,34,31]
dataset = tf.data.Dataset.from_tensor_slices(tmp)

print()
print()
print()
print(dataset)

for i in dataset:
    print(i)

'''
with open(path,'r') as infile:
    reader = csv.reader(infile, delimiter=',')
    header = next(reader)

    for row in reader:
        print(row[0])
'''

df = pd.read_csv(path, index_col=0)

print()
print()
print()
print(df)