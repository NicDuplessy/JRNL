from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Database configuration using PyMySQL
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "mysql+pymysql://Code:pQef-TSIW)Cgpw00@jessepaulwells.ddnsgeek.com:3306/jrnl_database"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Model(db.Model):
    __tablename__ = 'model'
    ModelID = db.Column(db.Integer, primary_key=True)
    ModelName = db.Column(db.String(30))
    assets = db.relationship('Asset', backref='model', lazy=True)
    @property
    def serialize(self):
        return {
            "ModelID": self.ModelID,
            "ModelName": self.ModelName
        }

class Condition(db.Model):
    __tablename__ = 'condition'
    condition_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    assets = db.relationship('Asset', backref='condition', lazy=True)
    @property
    def serialize(self):
        return {
            "condition_id": self.condition_id,
            "name": self.name
        }

class Stockroom(db.Model):
    __tablename__ = 'stockroom'
    stockroom_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    assets = db.relationship('Asset', backref='stockroom', lazy=True)
    @property
    def serialize(self):
        return {
            "stockroom_id": self.stockroom_id,
            "name": self.name
        }

class Status(db.Model):
    __tablename__ = 'status'
    status_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    assets = db.relationship('Asset', backref='status', lazy=True)
    @property
    def serialize(self):
        return {
            "status_id": self.status_id,
            "name": self.name
        }

class Asset(db.Model):
    __tablename__ = 'asset'
    SerialNumber = db.Column(db.Integer, primary_key=True)
    Specs = db.Column(db.String(150))
    condition_id = db.Column(db.Integer, db.ForeignKey('condition.condition_id'))
    ModelID = db.Column(db.Integer, db.ForeignKey('model.ModelID'))
    status_id = db.Column(db.Integer, db.ForeignKey('status.status_id'))
    stockroom_id = db.Column(db.Integer, db.ForeignKey('stockroom.stockroom_id'))
    @property
    def serialize(self):
        return {
            "SerialNumber": self.SerialNumber,
            "Specs": self.Specs,
            "condition_id": self.condition_id,
            "ModelID": self.ModelID,
            "status_id": self.status_id,
            "stockroom_id": self.stockroom_id
        }

class Employee(db.Model):
    __tablename__ = 'employee'
    EmployeeNumber = db.Column(db.Integer, primary_key=True)
    FirstName = db.Column(db.Text)
    LastName = db.Column(db.Text)
    Phone = db.Column(db.BigInteger)
    Email = db.Column(db.String(255))
    accesslevel_id = db.Column(db.Integer)  # Assuming this is already defined in your model
    AssetSerialNumber = db.Column(db.Integer, db.ForeignKey('asset.SerialNumber'))
    asset = db.relationship('Asset', backref='employees', lazy=True)
    @property
    def serialize(self):
        return {
            "EmployeeNumber": self.EmployeeNumber,
            "FirstName": self.FirstName,
            "LastName": self.LastName,
            "Phone": self.Phone,
            "Email": self.Email,
            "accesslevel_id": self.accesslevel_id,
            "AssetSerialNumber": self.AssetSerialNumber
        }
    


# Routes
@app.route("/")
def index():
    return jsonify({"message": "Welcome to the Flask Backend!"})

# Routes for Model Table
@app.route('/models', methods=['GET'])
def get_all_models():
    models = Model.query.all()
    return jsonify([model.serialize for model in models])

@app.route('/model', methods=['POST'])
def add_model():
    data = request.json
    new_model = Model(ModelName=data['ModelName'])
    db.session.add(new_model)
    db.session.commit()
    return jsonify(new_model.serialize), 201

@app.route('/model/<int:model_id>', methods=['PUT'])
def update_model(model_id):
    model = Model.query.get_or_404(model_id)
    data = request.json
    model.ModelName = data['ModelName']
    db.session.commit()
    return jsonify(model.serialize)

@app.route('/model/<int:model_id>', methods=['DELETE'])
def delete_model(model_id):
    model = Model.query.get_or_404(model_id)
    db.session.delete(model)
    db.session.commit()
    return jsonify({'message': 'Model deleted'}), 204

#Routes for Asset table
@app.route('/assets', methods=['GET'])
def get_all_assets():
    assets = Asset.query.all()
    return jsonify([asset.serialize for asset in assets])

@app.route('/asset', methods=['POST'])
def add_asset():
    data = request.json
    new_asset = Asset(condition_id=data['condition_id'], ModelID=data['ModelID'], status_id=data['status_id'], stockroom_id=data['stockroom_id'])
    db.session.add(new_asset)
    db.session.commit()
    return jsonify(new_asset.serialize), 201

@app.route('/asset/<int:serial_number>', methods=['PUT'])
def update_asset(serial_number):
    asset = Asset.query.get_or_404(serial_number)
    data = request.json
    asset.Notes = data['Notes']
    db.session.commit()
    return jsonify(asset.serialize)

@app.route('/asset/<int:serial_number>', methods=['DELETE'])
def delete_asset(serial_number):
    asset = Asset.query.get_or_404(serial_number)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'Asset deleted'}), 204

#Routes for Employee Table
@app.route('/employees', methods=['GET'])
def get_all_employees():
    employees = Employee.query.all()
    return jsonify([employee.serialize for employee in employees])

@app.route('/employee', methods=['POST'])
def add_employee():
    data = request.json
    new_employee = Employee(FirstName=data['FirstName'], LastName=data['LastName'], Phone=data['Phone'], Email=data['Email'], accesslevel_id=data['accesslevel_id'], AssetSerialNumber=data['AssetSerialNumber'])
    db.session.add(new_employee)
    db.session.commit()
    return jsonify(new_employee.serialize), 201

@app.route('/employee/<int:employee_number>', methods=['PUT'])
def update_employee(employee_number):
    employee = Employee.query.get_or_404(employee_number)
    data = request.json
    employee.FirstName = data['FirstName']
    # Update other fields as necessary
    db.session.commit()
    return jsonify(employee.serialize)

@app.route('/employee/<int:employee_number>', methods=['DELETE'])
def delete_employee(employee_number):
    employee = Employee.query.get_or_404(employee_number)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'Employee deleted'}), 204

#Routes for Condition Table
@app.route('/conditions', methods=['GET'])
def get_all_conditions():
    conditions = Condition.query.all()
    return jsonify([condition.serialize for condition in conditions])

@app.route('/condition', methods=['POST'])
def add_condition():
    data = request.json
    new_condition = Condition(name=data['name'])
    db.session.add(new_condition)
    db.session.commit()
    return jsonify(new_condition.serialize), 201

@app.route('/condition/<int:condition_id>', methods=['PUT'])
def update_condition(condition_id):
    condition = Condition.query.get_or_404(condition_id)
    data = request.json
    condition.name = data['name']
    db.session.commit()
    return jsonify(condition.serialize)

@app.route('/condition/<int:condition_id>', methods=['DELETE'])
def delete_condition(condition_id):
    condition = Condition.query.get_or_404(condition_id)
    db.session.delete(condition)
    db.session.commit()
    return jsonify({'message': 'Condition deleted'}), 204

#Routes for Stockroom Table
@app.route('/stockrooms', methods=['GET'])
def get_all_stockrooms():
    stockrooms = Stockroom.query.all()
    return jsonify([stockroom.serialize for stockroom in stockrooms])

@app.route('/stockroom', methods=['POST'])
def add_stockroom():
    data = request.json
    new_stockroom = Stockroom(name=data['name'])
    db.session.add(new_stockroom)
    db.session.commit()
    return jsonify(new_stockroom.serialize), 201

@app.route('/stockroom/<int:stockroom_id>', methods=['PUT'])
def update_stockroom(stockroom_id):
    stockroom = Stockroom.query.get_or_404(stockroom_id)
    data = request.json
    stockroom.name = data['name']
    db.session.commit()
    return jsonify(stockroom.serialize)

@app.route('/stockroom/<int:stockroom_id>', methods=['DELETE'])
def delete_stockroom(stockroom_id):
    stockroom = Stockroom.query.get_or_404(stockroom_id)
    db.session.delete(stockroom)
    db.session.commit()
    return jsonify({'message': 'Stockroom deleted'}), 204

#Routes for Status table
@app.route('/statuses', methods=['GET'])
def get_all_statuses():
    statuses = Status.query.all()
    return jsonify([status.serialize for status in statuses])

@app.route('/status', methods=['POST'])
def add_status():
    data = request.json
    new_status = Status(name=data['name'])
    db.session.add(new_status)
    db.session.commit()
    return jsonify(new_status.serialize), 201

@app.route('/status/<int:status_id>', methods=['PUT'])
def update_status(status_id):
    status = Status.query.get_or_404(status_id)
    data = request.json
    status.name = data['name']
    db.session.commit()
    return jsonify(status.serialize)

@app.route('/status/<int:status_id>', methods=['DELETE'])
def delete_status(status_id):
    status = Status.query.get_or_404(status_id)
    db.session.delete(status)
    db.session.commit()
    return jsonify({'message': 'Status deleted'}), 204

if __name__ == "__main__":
    app.run(debug=True)
