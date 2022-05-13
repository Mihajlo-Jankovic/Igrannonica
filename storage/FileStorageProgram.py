import numpy as np
import pandas as pd
import statistics
import scipy.stats as stats
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

def numeric_column_statistics(df,col):
    rowsNum = df.shape[0] # Ukupan broj podataka za kolonu
    #min = round(float(df[col].min()), 3) # Minimum
    #max = round(float(df[col].max()), 3) # Maksimum
    avg = round(df[col].mean(), 3) # Srednja vrednost
    med = round(df[col].median(), 3) # Mediana
    firstQ, thirdQ = df[col].quantile([.25, .75]) # Prvi i treci kvartil
    firstQ = round(firstQ,3)
    thirdQ = round(thirdQ,3)
    stdev = statistics.stdev(df)
    zscore = stats.zscore(df)

    iqr = thirdQ - firstQ

    min = round(firstQ - 1.5 * iqr,3)
    max = round(thirdQ + 1.5 * iqr,3)

    numOfNulls = df[col].isnull().sum()

    return (rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, zscore, iqr, numOfNulls)

def not_numeric_column_statistics(df,col):
    rowsNum = df.shape[0]
    unique = df[col].nunique()
    mostFrequent = df['Genre'].mode()[0]
    frequency = df['Genre'].value_counts()[0]
    numOfNulls = df[col].isnull().sum()

    return(rowsNum, unique, mostFrequent, frequency, numOfNulls)
    

# Izracunavanje statistika za odredjenu kolonu iz tabele
def statistics(df,colIndex):
    numericFlagList = []
    colList = []
    jsonList = []

    for col in df:
        if(df[col].dtypes == object):
            rowsNum, unique, mostFrequent, frequency, numOfNulls = not_numeric_column_statistics(df,col)
            numericFlagList.append(0)
            jsonList.append({"rowsNum": rowsNum, "unique": unique, "mostFrequent": mostFrequent, 
                            "frequency": frequency, "numOfNulls": numOfNulls})

        else:
            rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, zscore, iqr, numOfNulls = numeric_column_statistics(df,col)
            corrMatrix = df.corr() # Korelaciona matrica

            outliers = []
            for value in df[col]:
                if(value < min or value > max): 
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
            
            numericFlagList.append(1)
            
            jsonList.append({"rowsNum": rowsNum, "min": min, "max": max, "avg": avg, "med": med,
                            "firstQ": firstQ, "thirdQ": thirdQ, "stdev": stdev, "zscore": zscore,
                            "iqr": iqr, "outliers": outliers, "corrMatrix": {col: corrArr},
                            "numOfNulls": {col: numOfNulls},
                            "fullCorrMatrix": {"columns": colArr, "values": valArr}})
        
        colList.append(col)
    
    return {"numericFlagList": numericFlagList, "colList": colList, "jsonList": jsonList }

def missing_values(df, colName, fillMethod, specificVal):

    if(df[colName].dtypes == object):
        pass

    else:
        rowsNum, min, max, avg, med, firstQ, thirdQ, stdev, zscore, iqr = numeric_column_statistics(df,colName)

        if(fillMethod == "none"):
            df[colName].fillna(specificVal, inplace=True)

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

        elif(fillMethod == "zscore"):
            df[colName].fillna(zscore, inplace=True)

        elif(fillMethod == "iqr"):
            df[colName].fillna(iqr, inplace=True)

    return df

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

    numOfPages = numberOfPages(df,rowNum)
    
    df = paging(df,rowNum,pageNum)
    
    if(dataType == 'not null'):
        df = df.dropna()

    elif(dataType == 'null'):
        na_free = df.dropna()
        df = df[~df.index.isin(na_free.index)]

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



#df = pd.read_csv("movies.csv", index_col = False, engine = 'python') 