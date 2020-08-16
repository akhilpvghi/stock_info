
#!flask/bin/python
from flask import Flask, jsonify, abort, request, make_response, url_for,session
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.http import dump_cookie
# from flask_httpauth import HTTPBasicAuth
import csv
from datetime import date,datetime
from functools import wraps
from collections import defaultdict

app = Flask(__name__, static_url_path = "/static")
app.secret_key = 'akhilpandey'
global list_of_items_in_stock
 
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
  white_origin = ['http://localhost:3000','null']
  if 'HTTP_ORIGIN' in request.environ and request.environ['HTTP_ORIGIN'] in white_origin:
    response.headers.add('Access-Control-Allow-Origin', request.headers['Origin'])
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    # response.set_cookie('name', 'World', secure=True,samesite=None)
    # response.headers.add('Set-Cookie','cross-site-cookie=bar; SameSite=None;')
    response.headers.add('Set-Cookie','cross-site-cookie=bar; SameSite=None; Secure')
    # response.set_cookie('somekey', 'someval', domain='127.0.0.1', samesite=None,secure=True)
    # cookie = dump_cookie(*args, **kwargs)

    # if 'samesite' in kwargs and kwargs['samesite'] is None:
    #     cookie = "{}; {}".format(cookie, b'SameSite=None'.decode('latin1'))
    # response.headers.add(
    #     'Set-Cookie',
    #     cookie
    # )
    # response.headers.add('Set-Cookie','cross-site-cookie=bar; SameSite=None; Secure')
    # response.headers.add('cookie','SameSite=None')
    # response.headers.add('Set-Cookie', 'access_token_cookie=bar; SameSite="Lax"; ')
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
    # global list_of_items_in_stock
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        session['list_of_items_in_stock'] = readData;
    return jsonify(readData)
# map(make_public_task, tasks)

# @auth.login_required

# def getMaxSNoOnDate():
    
# def filter_date(date_to_check):
        
#     m1, d1, y1 = [int(x) for x in date_to_check.split('/')]
#     # m2, d2, y2 = [int(x) for x in firstItemAddedOn.split('/')]
#     dateToCheck_date = date(y1, m1, d1)
#     # firstDate_date = date(y2, m2, d2)
#     return lambda item:  item['lastUpdatedOn'] == date_to_check


    # return data['lastUpdatedOn'] == date_to_check
    
@app.route('/getDataInBetweenDates', methods = ['GET'])
@login_required
def get_data_in_between_dates():
    filename = "currentstocktable.csv"
    from_date = datetime.strptime(request.args.get("date_from"), "%m/%d/%Y")
    to_date = datetime.strptime(request.args.get("date_to"), "%m/%d/%Y")
    
    
    def filter_in_between_dates(every_date):
        everyDate_date = datetime.strptime(every_date['lastUpdatedOn'], "%m/%d/%Y")
        return everyDate_date>=from_date and everyDate_date<=to_date
    
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        extracted_list = list(filter(filter_in_between_dates,readData))
        return jsonify(extracted_list)
            
    
    


@app.route('/getDataByDate', methods = ['GET'])
@login_required
def get_data_by_date():
    filename = "currentstocktable.csv"
    list_of_items = session['list_of_items_in_stock']
    date_to_check = request.args.get("date_to_check")
    firstItemAddedOn=session['firstItemAddedOn']
    dateToCheck_date = datetime.strptime(date_to_check, "%m/%d/%Y")
    resultedData=[]
    
    def filter_date(every_date):
        everyDate_date = datetime.strptime(every_date['lastUpdatedOn'], "%m/%d/%Y")
        return everyDate_date<=dateToCheck_date

    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        extracted_list = list(filter(filter_date,readData))
        firstDate_date = datetime.strptime(firstItemAddedOn, "%m/%d/%Y")
        print("extracted_list single date {} {}".format(extracted_list,dateToCheck_date>=firstDate_date))
        
        if len(extracted_list) != 0 and dateToCheck_date>=firstDate_date:
            resu = max(extracted_list, key=lambda d: int(d['s_no']))
            max_s_no = int(resu['s_no'])
            print("max_s_no {} len(list_of_items) {}".format(max_s_no,len(list_of_items)))
            while len(list_of_items)!=0 and max_s_no!=0:
                for moreData in readData:
                    if any(d['item_name'] == moreData['item_name'] for d in list_of_items) and int(moreData['s_no'])==max_s_no and moreData['action']!="reduced":
                        resultedData.append(moreData)
                    elif any(d['item_name'] == moreData['item_name'] for d in list_of_items) and int(moreData['s_no'])==max_s_no and moreData['action']=="reduced":
                        list_of_items[:] = [d for d in list_of_items if d.get('item_name') != moreData['item_name']]
                        resultedData.append(moreData)
                max_s_no-=1
    return jsonify(resultedData)


def updateIt(dataToBeAppended):
    filename = "currentstocktable.csv"
    headerForCurrentStock = ("s_no","item_id","item_name","item_unit","item_per_unit_price","lastUpdatedQty","action","lastUpdatedOn","curr_qty_in_stock","is_last_updated")
    files = open(filename, "r")
    idForCurrentStock=0
    line=files.readlines()
    idForCurrentStock=len(line)
    files.seek(0)
    files.close()
    # print("dataImp dataImp {}".format(dataImp))
    for data in dataToBeAppended:
        data["s_no"]= idForCurrentStock
        # print("dataTobeApppw {}",format(data))
        writer(headerForCurrentStock, data, filename, "append")
        idForCurrentStock+=1
    return  get_task(), 201


@app.route('/updateCurrentStockTable', methods = ['PUT'])
@login_required
def updatecurrentstocktable():
    filename = "currentstocktable.csv"
    dataToBeAppended = []
    updateCurrentQty=0
    updatePerUnitPrice = 0
    prevSno = 0
    tempDataDict = {}
    files = open(filename, "r")
    idForCurrentStock=0
    line=files.readlines()
    idForCurrentStock=len(line)
    files.seek(0)
    files.close()
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        for data in readData:
            for dataFromReq in request.json['itemsToSupply']:
                if data['item_id']==dataFromReq['item_id'] and data['item_name']==dataFromReq['item_name'] and data['is_last_updated']=="true":
                    prevSno = int(data['s_no'])
                    data['lastUpdatedOn'] = date.today().strftime('%m/%d/%Y')
                    tempDataDict = data
                    if data['action']!="reduced":
                        while tempDataDict['action']!="reduced" and tempDataDict['item_id']==dataFromReq['item_id'] and tempDataDict['item_name']==dataFromReq['item_name'] and tempDataDict['s_no']!='1' and tempDataDict['item_per_unit_price']!='0' and tempDataDict['lastUpdatedQty']!='0':
                            for tempData in readData:
                                if tempData['s_no'] == str(prevSno) and tempData['item_id']==dataFromReq['item_id'] and tempData['item_name']==dataFromReq['item_name']:
                                    if tempData['action']=="reduced":
                                        updatePerUnitPrice += float(tempData['item_per_unit_price'])*float(tempData['curr_qty_in_stock'])
                                    else:
                                        updatePerUnitPrice += float(tempData['item_per_unit_price'])*float(tempData['lastUpdatedQty'])
                                    tempDataDict = tempData
                            prevSno-=1
                        updatePerUnitPrice=updatePerUnitPrice/float(data['curr_qty_in_stock'])
                        data['item_per_unit_price'] = round(updatePerUnitPrice,0)
                    else:
                        updatePerUnitPrice = float(data['item_per_unit_price'])
                        
                    # data['lastUpdatedQty']=float(data['curr_qty_in_stock'])-float(dataFromReq['amountToSupply'])
                    # data['curr_qty_in_stock'] = float(data['curr_qty_in_stock'])-float(dataFromReq['amountToSupply'])
                    data['is_last_updated']="false"
                    dataForCurrentStock = {
                    's_no':  idForCurrentStock,
                    'item_id': dataFromReq['item_id'],
                    'item_name': dataFromReq['item_name'],
                    'item_unit': tempDataDict['item_unit'],
                    'item_per_unit_price': round(updatePerUnitPrice,0),
                    'lastUpdatedQty': float(dataFromReq['amountToSupply']),
                    'action': "reduced",
                    'lastUpdatedOn': str(date.today().strftime('%m/%d/%Y')),
                    'curr_qty_in_stock': float(data['curr_qty_in_stock'])-float(dataFromReq['amountToSupply']),
                    'is_last_updated':"true"
    }
                        
                    dataToBeAppended.append(dataForCurrentStock)
                    # dataFromReq['lastUpdatedOn']
    readHeader = readData[0].keys()
    writer(readHeader, readData, filename, "update")
    
    # writer(readHeader, dataForCurrentStock, filename, "append")
    file.close()
    return updateIt(dataToBeAppended)




@app.route('/addInCurrentStockTable', methods = ['PUT'])
@login_required
def addInCurrentStockTable():
    headerForCurrentStock = ("s_no","item_id","item_name","item_unit","item_per_unit_price","lastUpdatedQty","action","lastUpdatedOn","curr_qty_in_stock","is_last_updated")
  
    filename = "currentstocktable.csv"
    # dataImp=request.json['items_to_add']
    # dataToBeAppended = defaultdict(object)
    dataToBeAppended = []
    files = open(filename, "r")
    idForCurrentStock=0
    line=files.readlines()
    idForCurrentStock=len(line)
    files.seek(0)
    files.close()
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
        for data in readData:
            for dataFromReq in request.json['items_to_add']:
                if data['item_id']==dataFromReq['item_id'] and data['item_name']==dataFromReq['item_name']:
                    if float(dataFromReq['lastUpdatedQty']) > 0 and data['is_last_updated']=='true':
                        data['is_last_updated']="false"
                        dataForCurrentStock = {
                            
                            'item_id': dataFromReq['item_id'],
                            'item_name': dataFromReq['item_name'],
                            'item_unit': dataFromReq['item_unit'],
                            'item_per_unit_price': dataFromReq['item_per_unit_price'],
                            'lastUpdatedQty': dataFromReq['lastUpdatedQty'],
                            'lastUpdatedOn': str(date.today().strftime('%m/%d/%Y')), 
                            'curr_qty_in_stock': float(data['curr_qty_in_stock'])+float(dataFromReq['lastUpdatedQty']),
                            'action': "added",
                            'is_last_updated':"true"
                        }
                        dataToBeAppended.append(dataForCurrentStock)
                        # readHeader = readData[0].keys()
                        writer(headerForCurrentStock, readData, filename, "update")
                        
                        # data['lastUpdatedQty'] = float(data['lastUpdatedQty'])+float(dataFromReq['lastUpdatedQty'])
                        # data['lastUpdatedOn']=dataFromReq['lastUpdatedOn']
                        # data['is_last_updated']=True
    file.close()
    
    return updateIt(dataToBeAppended)


def get_filter_by_last_updated_status(data):
    return data['is_last_updated']=="true"
    
    


@app.route('/currentStockTable', methods = ['GET'])
# # @cross_origin(origins="http://localhost:3000")
# # @cross_origin(origin='*')
# # @cross_origin(origin='localhost')
# # ,headers=['Content- Type','Authorization']
# # @cross_origin(origin='localhost:3000',headers=['Content-Type','Authorization'])
# # @crossdomain(origin='localhost')
# # @cross_origin(origin='localhost:3000',supports_credentials=True)
# # @login_required
def get_task():
    # response.headers.add('Access-Control-Allow-Origin', '*')
    createdData=[]
    filename = "currentstocktable.csv"
    with open(filename, newline= "") as file:
        readData = [row for row in csv.DictReader(file)]
    createdData = list(filter(get_filter_by_last_updated_status,readData))
    # print("createdData createdData {}".format(createdData))
    file.close()
    return jsonify(createdData)


@app.route('/postIntoStockManagement', methods = ['POST'])
@login_required
# @cross_origin(supports_credentials=True)
def create_task():
    filenameForStockManagement = "stockManagement.csv"
    filenameForCurrentStock = "currentstocktable.csv"
    # with open(filename, newline= "") as file:
        # readData = [row for row in csv.DictReader(file)]
        # readHeader = readData[0].keys()
    headerForStockManagement = ("s_no","item_id", "item_name", "item_unit")
    headerForCurrentStock = ("s_no","item_id","item_name","item_unit","item_per_unit_price","lastUpdatedQty","action","lastUpdatedOn","curr_qty_in_stock","is_last_updated")
    
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
    # if not request.json or not 'item_name' in request.json:
    #     abort(400)
        
    # data = [
    #     (5, request.json['item_name'], request.json['qtyMeasure'],request.json['price'])
    # ]
    
    if idForStockManagement==1:
        filename = "auth.csv"
        with open(filename, newline= "") as fileAuth:
            readData = [row for row in csv.DictReader(fileAuth)]
            readHeader = readData[0].keys()
            for data in readData:
                data['firstItemAddedOn'] = str(date.today().strftime('%m/%d/%Y'))
                writer(readHeader, readData, filename, "update")
        fileAuth.close()
            # if  data['username']==request.json['username'] and check_password_hash(data['password'],currPassword):
            #     data['password']=generate_password_hash(request.json['newPassword'], method='sha256')
            #     return "pasword changed successfully"
        # else:
        #     return "old password did not match"
        
    
    dataForCurrentStock = {
        's_no':  idForCurrentStock,
        'item_id': idForStockManagement,
        'item_name': request.json['item_name'],
        'item_unit': request.json['item_unit'],
        'item_per_unit_price': 0,
        'lastUpdatedQty': 0,
        'action': "added",
        'lastUpdatedOn': str(date.today().strftime('%m/%d/%Y')),
        'curr_qty_in_stock': 0,
        'is_last_updated':"true"
    }
    
    dataForStockManagement = {
        's_no':  idForStockManagement,
        'item_id': idForStockManagement,
        'item_name': request.json['item_name'],
        'item_unit': request.json['item_unit']
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
                    session['firstItemAddedOn']=data['firstItemAddedOn']
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
                return "pasword changed successfully"
        else:
            return "old password did not match"
    file.close()

    
if __name__ == '__main__':
    app.run(debug = True)
    
    
    # put //changePassword
    # {"userName":"",
    #  "oldPassword":""",
    #  "newPassword":""}