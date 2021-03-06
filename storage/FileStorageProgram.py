from re import L
import numpy as np
import pandas as pd
import statistics
import scipy.stats as stats
import csv
import urllib
from collections import Counter


def numberOfPages(df,rowNum):
    numOfPages = len(df)
    
    if(numOfPages % rowNum != 0):
        numOfPages //= rowNum
        numOfPages += 1

    else:
        numOfPages /= rowNum
        numOfPages = int(numOfPages)

    return numOfPages

def numeric_column_statistics(df,col):
    rowsNum = df.shape[0] # Ukupan broj podataka za kolonu
    #min = round(float(df[col].min()), 3) # Minimum
    #max = round(float(df[col].max()), 3) # Maksimum
    avg = round(df[col].mean(), 3) # Srednja vrednost
    med = round(df[col].median(), 3) # Mediana
    firstQ, thirdQ = df[col].quantile([.25, .75]) # Prvi i treci kvartil
    firstQ = round(firstQ,3)
    thirdQ = round(thirdQ,3)
    stdev = round(df[col].std(), 3)
    
    iqr = thirdQ - firstQ
    iqr = round(iqr, 3)

    min = round(firstQ - 1.5 * iqr,3)
    max = round(thirdQ + 1.5 * iqr,3)

    numOfNulls = (int)(df[col].isnull().sum())
    unique = df[col].nunique()
    uniqueList = Counter(df[col])

    return (rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, iqr, numOfNulls, unique, uniqueList)

def not_numeric_column_statistics(df,col):
    rowsNum = df.shape[0]
    unique = df[col].nunique()
    mostFrequent = df[col].mode()[0]
    frequency = (int)(df[col].value_counts()[0])
    numOfNulls = (int)(df[col].isnull().sum())
    uniqueList = Counter(df[col])

    return(rowsNum, unique, mostFrequent, frequency, numOfNulls, uniqueList)
    

# Izracunavanje statistika za odredjenu kolonu iz tabele
def statistics(df,colIndex):
    colList = []
    jsonList = []
    fullCorMatrix = []

    for col in df:
        if(df[col].dtypes == object):
            rowsNum, unique, mostFrequent, frequency, numOfNulls, uniqueList = not_numeric_column_statistics(df,col)
            jsonList.append({"rowsNum": rowsNum, "unique": unique, "mostFrequent": mostFrequent, 
                            "isNumeric": 0, "frequency": frequency, "numOfNulls": numOfNulls, "uniqueList" : uniqueList})

        else:
            rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, iqr, numOfNulls, unique, uniqueList = numeric_column_statistics(df,col)
            corrMatrix = df.corr() # Korelaciona matrica
            numOfOutliers = 0

            outliers = []
            for value in df[col]:
                if(value < min or value > max): 
                    outliers.append(value)
                    numOfOutliers += 1
                    
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
            
            jsonList.append({"rowsNum": rowsNum, "min": min, "max": max, "avg": avg, "med": med, 'numOfOutliers': numOfOutliers,
                            "firstQ": firstQ, "thirdQ": thirdQ, "stdev": stdev, "iqr": iqr, "isNumeric": 1,
                            "outliers": outliers, "corrMatrix": {col: corrArr}, "numOfNulls": numOfNulls, "unique" : unique, "uniqueList" : uniqueList,
                            "fullCorrMatrix": {"columns": colArr, "values": valArr}})
            
        colList.append(col)
    
    return {"colList": colList, "jsonList": jsonList, "fullCorrelationMatrix": {"columns": colArr, "values": valArr}}

def missing_values(df, colName, fillMethod, specificVal):

    if(df[colName].dtypes == object):
        rowsNum, unique, mostFrequent, frequency, numOfNulls, uniqueList = not_numeric_column_statistics(df,colName)

        if(fillMethod == "none"):
            df[colName].fillna(specificVal, inplace=True)

        elif(fillMethod == "deleteAll"):
            df[colName].dropna()

        elif(fillMethod == "mostFrequent"):
            df[colName].fillna(mostFrequent, inplace=True)


    else:
        rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, iqr, numOfNulls, unique, uniqueList = numeric_column_statistics(df,colName)

        if(fillMethod == "none"):
            df[colName].fillna(specificVal, inplace=True)

        elif(fillMethod == "deleteAll"):
            df.dropna(subset=[colName], inplace=True)

        elif(fillMethod == "min"):
            df[colName].fillna(min, inplace=True)

        elif(fillMethod == "max"):
            df[colName].fillna(max, inplace=True)

        elif(fillMethod == "avg"):
            df[colName].fillna(avg, inplace=True)

        elif(fillMethod == "med"):
            df[colName].fillna(med, inplace=True)

        elif(fillMethod == "firstQ"):
            df[colName].fillna(firstQ, inplace=True)

        elif(fillMethod == "thirdQ"):
            df[colName].fillna(thirdQ, inplace=True)

        elif(fillMethod == "stdev"):
            df[colName].fillna(stdev, inplace=True)

        elif(fillMethod == "iqr"):
            df[colName].fillna(iqr, inplace=True)

    return df

def z_score(df,colName):
    mean = df[colName].mean()
    stdev = df[colName].std()

    z_scores = [np.abs((el - mean) / stdev) for el in df[colName]]

    return z_scores

def outliers(df,colName,fillMethod,specificVal):
    rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, iqr, numOfNulls, unique, uniqueList = numeric_column_statistics(df,colName)

    #threshold = 3
    #z_scores = z_score(df,colName)

    #i = 0
    for i in range(0,df.shape[0]): #for score in z_scores:
        if(df[colName][i] < min or df[colName][i] > max): #if(score > threshold):

            if(fillMethod == "none"):
                df[colName][i] = specificVal

            elif(fillMethod == "deleteAll"):
                df.drop(i, axis=0, inplace=True)

            elif(fillMethod == "min"):
                df[colName][i] = min

            elif(fillMethod == "max"):
                df[colName][i] = max

            elif(fillMethod == "avg"):
                df[colName][i] = avg

            elif(fillMethod == "med"):
                df[colName][i] = med

            elif(fillMethod == "firstQ"):
                df[colName][i] = firstQ

            elif(fillMethod == "thirdQ"):
                df[colName][i] = thirdQ

            elif(fillMethod == "stdev"):
                df[colName][i] = stdev

            elif(fillMethod == "iqr"):
                df[colName][i] = iqr

        #i = i + 1

    return df

def openCSV(path):
    #with open(path) as f: 
        #header = csv.Sniffer().has_header(f.read().decode('utf-8')) # Proverava da li u fajlu postoji header

    if(True): 
        df = pd.read_csv(path, index_col = False, engine = 'python', sep = None) 

        #df.columns = [col.lower() for col in df]
        #df.columns = [col.strip('-$%') for col in df]
        #df.columns = [col.strip() for col in df]
        #df.columns = [col.replace(' ','_') for col in df]
    else: 
        df = pd.read_csv(path, index_col = False, header = None, engine = 'python') 

    return df



def paging(df,rowNum,pageNum):
    row = rowNum * (pageNum - 1)
    
    if(len(df.index) <= rowNum):
        return df
    elif(len(df.index) <= row+rowNum):
        return df.loc[np.r_[row:len(df.index)], :]
    else:
        return df.loc[np.r_[row:row+rowNum], :]

# Filtriranje CSV fajlova prema parametrima klijenta
def filterCSV(path, rowNum, dataType, pageNum, colName):
    df = openCSV(path)
    
    colList = []
    for col in df:
        colList.append(col)
    
    # Dodavanje novog id reda
    hidden_id = [i for i in range(0,df.shape[0])]
    df['hidden_id'] = hidden_id
    
    if(dataType == 'not null'):
        df = df.dropna()
        df.reset_index(drop=True, inplace=True)

    elif(dataType == 'null'):
        na_free = df.dropna()
        df = df[~df.index.isin(na_free.index)]
        df.reset_index(drop=True, inplace=True)
    
    elif(dataType == 'outlier'):
        firstQ, thirdQ = df[colName].quantile([.25, .75])
        iqr = thirdQ - firstQ
        min = round(firstQ - 1.5 * iqr,3)
        max = round(thirdQ + 1.5 * iqr,3)

        tmp = pd.DataFrame()
        for i in range(0,df.shape[0]):
            if(df[colName][i] < min or df[colName][i] > max):
                tmp = pd.concat([df.iloc[[i]],tmp.loc[:]]).reset_index(drop=True)
        
        df = tmp
        df.reset_index(drop=True, inplace=True)

    numOfPages = numberOfPages(df,rowNum)
    
    df = paging(df,rowNum,pageNum)

    return [df,numOfPages,colList]

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

#df = pd.read_csv('Movies.csv', index_col = False, engine = 'python') 
#outliers(df,'Revenue (Millions)')
