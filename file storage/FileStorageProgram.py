import numpy as np
import pandas as pd
import csv
import urllib

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


def openCSV(path):
    #with open(path) as f: 
        #header = csv.Sniffer().has_header(f.read().decode('utf-8')) # Proverava da li u fajlu postoji header

    if(True): 
        df = pd.read_csv(path, index_col = False, engine = 'python') 

        #df.columns = [col.lower() for col in df]
        #df.columns = [col.strip('-$%') for col in df]
        #df.columns = [col.strip() for col in df]
        #df.columns = [col.replace(' ','_') for col in df]
    else: 
        df = pd.read_csv(path, index_col = False, header = None, engine = 'python') 

    return df



def paging(df,rowNum,pageNum):
    row = rowNum * (pageNum - 1)
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
    print(df)
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




