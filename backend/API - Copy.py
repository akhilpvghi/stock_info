
#!flask/bin/python
from flask import Flask, jsonify, abort, request, make_response, url_for,session
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
# from flask_httpauth import HTTPBasicAuth
import csv
from datetime import date
from functools import wraps

app = Flask(__name__, static_url_path = "/static")
app.secret_key = 'akhilpandey'

# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#     return response
# cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# app.config['CORS_ORIGINS'] = ['http://localhost:3000',]
# CORS(app)

# config = {
#   'ORIGINS': [
#     'http://localhost:3000',  # React
#     'http://127.0.0.1:3000',  # React
#   ]
# #   ,

# #   'SECRET_KEY': 'akhilpandey'
# }

# CORS(app, support_credentials=True)
# CORS(app, origins=["http://localhost:3000"], headers=['Content-Type'], expose_headers=['Access-Control-Allow-Origin'], supports_credentials=True)
# CORS(app, resources={ r'/*': {'origins': config['ORIGINS']}}, supports_credentials=True)
# app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app, resources={r"localhost": {"origins": "localhost:3000"}},support_credentials=True)
# app.config.update(
#             SECRET_KEY='foo',
#             SERVER_NAME='localhost:5000',
#             APPLICATION_ROOT='/',
#             SESSION_COOKIE_DOMAIN='localhost',
#             SESSION_COOKIE_HTTPONLY=False,
#             SESSION_COOKIE_SECURE=True,
#             SESSION_COOKIE_PATH='/'
#         )
# app.config['CORS_ALLOW_HEADERS','CORS_EXPOSE_HEADERS',"CORS_SUPPORTS_CREDENTIALS"] = 'Content-Type'

# cors = CORS(app)
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

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response


    
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

def login_required(test):
    @wraps(test)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return test(*args, **kwargs)
        else:
            return 'fail'
    return wrap
    
@app.route('/stockManagement', methods = ['GET'])
@login_required
def get_tasks():
    filename = "stockManagement.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
    return jsonify(readData)
# map(make_public_task, tasks)

# @auth.login_required

@app.route('/updateCurrentStockTable', methods = ['PUT'])
@login_required
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
@login_required
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
# @cross_origin(origins="http://localhost:3000")
# @cross_origin(origin='*')
# @cross_origin(origin='localhost')
# ,headers=['Content- Type','Authorization']
# @cross_origin(origin='localhost:3000',headers=['Content-Type','Authorization'])
# @crossdomain(origin='localhost')
# @cross_origin(origin='localhost:3000',supports_credentials=True)
@login_required
def get_task():
    # response.headers.add('Access-Control-Allow-Origin', '*')
    filename = "currentstocktable.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
    file.close()
    return jsonify(readData)


@app.route('/postIntoStockManagement', methods = ['POST'])
@login_required
# @cross_origin(supports_credentials=True)
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


@app.route('/login',methods=['POST'])

# @cross_origin(supports_credentials=True)
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def login():
    filename = "auth.csv"
    if request.method == 'POST':
        with open(filename, newline= "") as file:
            readData = [row for row in csv.DictReader(file)]
            for data in readData:
                if data['username'] == request.json['username'] and check_password_hash(data['password'],request.json['password']):
                    session["logged_in"] = True
                    return "successfully logged in"
            else:
                return "authentication failed"
    elif request.method == 'GET':
        return "success"
    file.close()
    
@app.route('/login',methods=['GET'])
@login_required
def checklIfLogin():
    return "success"
    
@app.route('/logout')
@login_required
def logout():
    session.clear()
    return "successfully logged out"

@app.route('/changePassword', methods = ['PUT'])
@login_required
def changepassword():
    filename = "auth.csv"
    currPassword = request.json['currentPassword']
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        readHeader = readData[0].keys()
        for data in readData:
            if  data['username']==request.json['username'] and check_password_hash(data['password'],currPassword):
                data['password']=generate_password_hash(request.json['newPassword'], method='sha256')
                writer(readHeader, readData, filename, "update")
                return jsonify(readData)
        else:
            return "old password did not match"
    file.close()

    
if __name__ == '__main__':
    app.run(debug = True)
    
    
    # put //changePassword
    # {"userName":"",
    #  "oldPassword":""",
    #  "newPassword":""}