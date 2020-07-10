
#!flask/bin/python
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_cors import CORS
# from flask_httpauth import HTTPBasicAuth
import csv
from datetime import date

app = Flask(__name__, static_url_path = "")
CORS(app)
# auth = HTTPBasicAuth()

# # @auth.get_password
# def get_password(username):
#     if username == 'miguel':
#         return 'python'
#     return None

# @auth.error_handler
# def unauthorized():
#     return make_response(jsonify( { 'error': 'Unauthorized access' } ), 403)
#     # return 403 instead of 401 to prevent browsers from displaying the default auth dialog
    
@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)


# tasks = [
#     {
#         'id': 1,
#         'title': u'Buy groceries',
#         'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
#         'done': False
#     },
#     {
#         'id': 2,
#         'title': u'Learn Python',
#         'description': u'Need to find a good Python tutorial on the web', 
#         'done': False
#     }
# ]


def writer(header, data, filename, option):
            if option == "append":
                with open(filename, 'a+', newline = "") as csvfile:
                    writer = csv.DictWriter(csvfile, fieldnames = header)
                    writer.writerow(data)
                    csvfile.close
            elif option == "update":
                with open (filename, "w", newline = "") as csvfile:
                    writer = csv.DictWriter(csvfile, fieldnames = header)
                    writer.writeheader()
                    writer.writerows(data)
                    csvfile.close
            else:
                print("Option is not known")
            # csvfile.close

# def make_public_task(task):
#     new_task = {}
#     for field in task:  
#         if field == 'id':
#             new_task['uri'] = url_for('get_task', task_id = task['id'], _external = True)
#         else:
#             new_task[field] = task[field]
#     return new_task
    
@app.route('/stockManagement', methods = ['GET'])
# @auth.login_required
def get_tasks():
    filename = "stockManagement.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
    return jsonify(readData)
# map(make_public_task, tasks)

# @auth.login_required

@app.route('/updateCurrentStockTable', methods = ['PUT'])
def updatecurrentstocktable():
    filename = "currentstocktable.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        for data in readData:
            for dataFromReq in request.json['itemsToSupply']:
                if data['id']==dataFromReq['id'] and data['itemName']==dataFromReq['itemName']:
                    data['currentQtyInStock'] = float(data['currentQtyInStock'])-float(dataFromReq['amountToSupply'])
                    data['lastUpdatedOn']=dataFromReq['lastUpdatedOn']
                    data['lastUpdatedQty']="-"+dataFromReq['amountToSupply']
    readHeader = readData[0].keys()
    writer(readHeader, readData, filename, "update")
    file.close()
    return jsonify(readData)

@app.route('/addInCurrentStockTable', methods = ['PUT'])
def addInCurrentStockTable():
    filename = "currentstocktable.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        for data in readData:
            if data['id']==request.json['id'] and data['itemName']==request.json['itemName']:
                if float(request.json['addInCurrentStock']) > 0:
                    data['currentQtyInStock'] = float(data['currentQtyInStock'])+float(request.json['addInCurrentStock'])
                    data['lastUpdatedOn']=request.json['lastUpdatedOn']
                    data['lastUpdatedQty']="+"+request.json['addInCurrentStock']
    readHeader = readData[0].keys()
    writer(readHeader, readData, filename, "update")
    file.close()
    return jsonify(readData)


@app.route('/currentStockTable', methods = ['GET'])
def get_task():
    filename = "currentstocktable.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
    file.close()
    return jsonify(readData)

@app.route('/postIntoStockManagement', methods = ['POST'])
# @auth.login_required
def create_task():
    filenameForStockManagement = "stockManagement.csv"
    filenameForCurrentStock = "currentstocktable.csv"
    # with open(filename, newline= "") as file:
        # readData = [row for row in csv.DictReader(file)]
        # readHeader = readData[0].keys()
    headerForStockManagement = ("id", "itemName", "qtyMeasure", "price")
    headerForCurrentStock = ("id", "itemName", "qtyMeasure","currentQtyInStock", "lastUpdatedOn","lastUpdatedQty","price")
    
    f = open(filenameForStockManagement, "r")
    idForStockManagement=0
    lines=f.readlines()
    idForStockManagement=len(lines)
    f.seek(0)
    f.close()
    
    files = open(filenameForCurrentStock, "r")
    idForCurrentStock=0
    line=files.readlines()
    idForCurrentStock=len(line)
    files.seek(0)
    files.close()
    # if not request.json or not 'itemName' in request.json:
    #     abort(400)
        
    # data = [
    #     (5, request.json['itemName'], request.json['qtyMeasure'],request.json['price'])
    # ]
    
    dataForCurrentStock = {
        'id':  idForCurrentStock,
        'itemName': request.json['itemName'],
        'qtyMeasure': request.json['qtyMeasure'],
        'currentQtyInStock': 0,
        'lastUpdatedOn': str(date.today()),
        'lastUpdatedQty': 0,
        'price': request.json['price']
    }
    
    dataForStockManagement = {
        'id':  idForStockManagement,
        'itemName': request.json['itemName'],
        'qtyMeasure': request.json['qtyMeasure'],
        'price': request.json['price']
    }
    writer(headerForStockManagement, dataForStockManagement, filenameForStockManagement, "append")
    writer(headerForCurrentStock, dataForCurrentStock, filenameForCurrentStock, "append")
    # tasks.append(task)
    return jsonify( { 'status': 'done' } ), 201

    
if __name__ == '__main__':
    app.run(debug = True)