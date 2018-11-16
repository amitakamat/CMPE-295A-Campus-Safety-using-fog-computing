#!/usr/bin/env python

import csv
import json
import pymongo

connection = pymongo.MongoClient()
db = connection.people
collection = db.criminals

with open('Criminal-dataset.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    rows = list(reader)
    # some rows are empty but are included in output
    with open('mapper.json', 'w') as json_file:
        for row in rows:
            flag = True
            for x in row.items():
                if(x[0] == 'First Name' and x[1] == ''):
                    # if First Name is empty skip the row
                    flag = False
                    break
            if flag:
                json.dump(row, json_file)
                collection.insert(row)
                
for items in collection.find():
    print(items)
