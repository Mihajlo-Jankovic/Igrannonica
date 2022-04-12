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
    round(firstQ,3)
    round(thirdQ,3)
    corrMatrix = df.corr() # Korelaciona matrica

    corrArr = []
    for value in corrMatrix[df.columns[colIndex]]:
        corrArr.append(round(value,3))

    return {"rowsNum": rowsNum, "min": min, "max": max, "avg": avg, "med": med,
                "firstQ": firstQ, "thirdQ": thirdQ, "corrMatrix": {colIndex: corrArr}}



def openCSV(path):
    with urllib.request.urlopen(path) as f: 
        header = csv.Sniffer().has_header(f.read().decode('utf-8')) # Proverava da li u fajlu postoji header

    if(header): 
        df = pd.read_csv(path, index_col = 0) 

        #df.columns = [col.lower() for col in df]
        #df.columns = [col.strip('-$%') for col in df]
        #df.columns = [col.strip() for col in df]
        #df.columns = [col.replace(' ','_') for col in df]
    else: 
        df = pd.read_csv(path, header = None) 

    return df



def paging(df,rowNum,pageNum):
    row = rowNum * (pageNum - 1) + 1    
    return df.loc[np.r_[row:row+rowNum], :]

# Filtriranje CSV fajlova prema parametrima klijenta
def filterCSV(path, rowNum, dataType, pageNum):
    df = openCSV(path)
    
    if(dataType == 'not null'):
        df = df.dropna()

    elif(dataType == 'null'):
        na_free = df.dropna()
        df = df[~df.index.isin(na_free.index)]

    numOfPages = numberOfPages(df,rowNum)

    df = paging(df,rowNum,pageNum)

    return [df,numOfPages]

def numericValues(path):
    colList = []
    indexList = []

    df = openCSV(path)

    for col in df:
        if(df[col].dtypes != object):
            colList.append(col)
            indexList.append(df.columns.get_loc(col))

    return {'index': indexList, 'col': colList}

def editCell(df, rowNum, colName, value):
    df.at[rowNum,colName] = value

    return df

def deleteRow(df,rowNum):
    df.drop(rowNum, axis = 0, inplace=True)
    return df




