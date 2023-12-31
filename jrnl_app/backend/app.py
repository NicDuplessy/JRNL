from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import Date
from datetime import datetime
from flask import request, jsonify

app = Flask(__name__)
CORS(app)

# Database configuration using PyMySQL
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "mysql+pymysql://Code:pQef-TSIW)Cgpw00@jessepaulwells.ddnsgeek.com:3306/jrnl_database"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Model(db.Model):
    __tablename__ = "model"
    ModelID = db.Column(db.Integer, primary_key=True)
    ModelName = db.Column(db.String(30))
    assets = db.relationship("Asset", backref="model", lazy=True)

    @property
    def serialize(self):
        return {"ModelID": self.ModelID, "ModelName": self.ModelName}


class Conditions(db.Model):
    __tablename__ = "conditions"
    condition_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    assets = db.relationship("Asset", backref="conditions", lazy=True)

    @property
    def serialize(self):
        return {"condition_id": self.condition_id, "name": self.name}


class Stockroom(db.Model):
    __tablename__ = "stockroom"
    stockroom_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    assets = db.relationship("Asset", backref="stockroom", lazy=True)

    @property
    def serialize(self):
        return {"stockroom_id": self.stockroom_id, "name": self.name}


class Status(db.Model):
    __tablename__ = "status"
    status_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    assets = db.relationship("Asset", backref="status", lazy=True)

    @property
    def serialize(self):
        return {"status_id": self.status_id, "name": self.name}


class Asset(db.Model):
    __tablename__ = "asset"
    SerialNumber = db.Column(db.Integer, primary_key=True)
    condition_id = db.Column(db.Integer, db.ForeignKey("conditions.condition_id"))
    ModelID = db.Column(db.Integer, db.ForeignKey("model.ModelID"))
    status_id = db.Column(db.Integer, db.ForeignKey("status.status_id"))
    stockroom_id = db.Column(db.Integer, db.ForeignKey("stockroom.stockroom_id"))

    @property
    def serialize(self):
        return {
            "SerialNumber": self.SerialNumber,
            "condition_id": self.condition_id,
            "ModelID": self.ModelID,
            "status_id": self.status_id,
            "stockroom_id": self.stockroom_id,
        }


class Employee(db.Model):
    __tablename__ = "employee"
    EmployeeNumber = db.Column(db.Integer, primary_key=True)
    FirstName = db.Column(db.Text)
    LastName = db.Column(db.Text)
    Phone = db.Column(db.BigInteger)
    Email = db.Column(db.String(255))
    accesslevel_id = db.Column(
        db.Integer
    )  # Assuming this is already defined in your model
    SerialNumber = db.Column(db.Integer, db.ForeignKey("asset.SerialNumber"))
    asset = db.relationship("Asset", backref="employees", lazy=True)

    @property
    def serialize(self):
        return {
            "EmployeeNumber": self.EmployeeNumber,
            "FirstName": self.FirstName,
            "LastName": self.LastName,
            "Phone": self.Phone,
            "Email": self.Email,
            "accesslevel_id": self.accesslevel_id,
            "SerialNumber": self.SerialNumber,
        }


class Request(db.Model):
    __tablename__ = "request"
    RequestNumber = db.Column(db.Integer, primary_key=True)
    EmployeeNumber = db.Column(db.Integer, db.ForeignKey("employee.EmployeeNumber"))
    SerialNumber = db.Column(db.Integer, db.ForeignKey("asset.SerialNumber"))
    Date = db.Column(Date)
    Issue = db.Column(db.String(255))
    status_id = db.Column(db.Integer, db.ForeignKey("status.status_id"))
    condition_id = db.Column(db.Integer, db.ForeignKey("conditions.condition_id"))

    @property
    def serialize(self):
        return {
            "RequestNumber": self.RequestNumber,
            "EmployeeNumber": self.EmployeeNumber,
            "SerialNumber": self.SerialNumber,
            "Date": self.Date,
            "Issue": self.Issue,
            "status_id": self.status_id,
            "condition_id": self.condition_id,
        }


# Routes
@app.route("/")
def index():
    return jsonify({"message": "Welcome to the Flask Backend!"})


@app.route("/next-serial-number", methods=["GET"])
def get_next_serial_number():
    max_serial = db.session.query(db.func.max(Asset.SerialNumber)).scalar()
    next_serial = (max_serial or 0) + 1
    return jsonify({"nextSerialNumber": next_serial})


@app.route("/next-request-number", methods=["GET"])
def get_next_request_number():
    max_request = db.session.query(db.func.max(Request.RequestNumber)).scalar()
    next_request = (max_request or 0) + 1
    return jsonify({"nextRequestNumber": next_request})


# Routes for Model Table
@app.route("/models", methods=["GET"])
def get_all_models():
    models = Model.query.all()
    return jsonify([model.serialize for model in models])


@app.route("/model", methods=["POST"])
def add_model():
    data = request.json
    new_model = Model(ModelName=data["ModelName"])
    db.session.add(new_model)
    db.session.commit()
    return jsonify(new_model.serialize), 201


@app.route("/model/<int:model_id>", methods=["PUT"])
def update_model(model_id):
    model = Model.query.get_or_404(model_id)
    data = request.json
    model.ModelName = data["ModelName"]
    db.session.commit()
    return jsonify(model.serialize)


@app.route("/model/<int:model_id>", methods=["DELETE"])
def delete_model(model_id):
    model = Model.query.get_or_404(model_id)
    db.session.delete(model)
    db.session.commit()
    return jsonify({"message": "Model deleted"}), 204


# Routes for Asset table
@app.route("/assets", methods=["GET"])
def get_all_assets():
    assets = Asset.query.all()
    return jsonify([asset.serialize for asset in assets])


@app.route("/asset", methods=["POST"])
def add_asset():
    data = request.json
    new_asset = Asset(
        condition_id=data["condition_id"],
        ModelID=data["ModelID"],
        status_id=data["status_id"],
        stockroom_id=data["stockroom_id"],
    )
    db.session.add(new_asset)
    db.session.commit()
    return jsonify(new_asset.serialize), 201


@app.route("/asset/<int:serial_number>", methods=["PUT"])
def update_asset(serial_number):
    asset = Asset.query.get_or_404(serial_number)
    data = request.json
    asset.Notes = data["Notes"]
    db.session.commit()
    return jsonify(asset.serialize)


@app.route("/asset/<int:serial_number>", methods=["DELETE"])
def delete_asset(serial_number):
    asset = Asset.query.get_or_404(serial_number)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({"message": "Asset deleted"}), 204


# Routes for Employee Table
@app.route("/employees", methods=["GET"])
def get_all_employees():
    employees = Employee.query.all()
    return jsonify([employee.serialize for employee in employees])


@app.route("/employee", methods=["POST"])
def add_employee():
    data = request.json
    new_employee = Employee(
        FirstName=data["FirstName"],
        LastName=data["LastName"],
        Phone=data["Phone"],
        Email=data["Email"],
        accesslevel_id=data["accesslevel_id"],
        SerialNumber=data["SerialNumber"],
    )
    db.session.add(new_employee)
    db.session.commit()
    return jsonify(new_employee.serialize), 201


@app.route("/employee/<int:employee_number>", methods=["PUT"])
def update_employee(employee_number):
    employee = Employee.query.get_or_404(employee_number)
    data = request.json
    employee.FirstName = data["FirstName"]
    # Update other fields as necessary
    db.session.commit()
    return jsonify(employee.serialize)


@app.route("/employee/<int:employee_number>", methods=["DELETE"])
def delete_employee(employee_number):
    employee = Employee.query.get_or_404(employee_number)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted"}), 204


@app.route("/api/employee/<int:serial_number>", methods=["GET"])
def get_employee(serial_number):
    print(f"Fetching employee with serial number {serial_number}")
    employee = Employee.query.filter_by(SerialNumber=serial_number).first()
    print(f"Found employee: {employee}")
    if employee:
        return jsonify({"name": f"{employee.FirstName} {employee.LastName}"})
    else:
        return jsonify({"error": "Employee not found"}), 404


# Routes for Condition Table
@app.route("/conditions", methods=["GET"])
def get_all_conditions():
    conditions = Conditions.query.all()
    return jsonify([conditions.serialize for conditions in conditions])


@app.route("/condition", methods=["POST"])
def add_condition():
    data = request.json
    new_condition = Condition(name=data["name"])
    db.session.add(new_condition)
    db.session.commit()
    return jsonify(new_condition.serialize), 201


@app.route("/condition/<int:condition_id>", methods=["PUT"])
def update_condition(condition_id):
    condition = Condition.query.get_or_404(condition_id)
    data = request.json
    condition.name = data["name"]
    db.session.commit()
    return jsonify(condition.serialize)


@app.route("/condition/<int:condition_id>", methods=["DELETE"])
def delete_condition(condition_id):
    condition = Condition.query.get_or_404(condition_id)
    db.session.delete(condition)
    db.session.commit()
    return jsonify({"message": "Condition deleted"}), 204


# Routes for Stockroom Table
@app.route("/stockrooms", methods=["GET"])
def get_all_stockrooms():
    stockrooms = Stockroom.query.all()
    return jsonify([stockroom.serialize for stockroom in stockrooms])


@app.route("/stockroom", methods=["POST"])
def add_stockroom():
    data = request.json
    new_stockroom = Stockroom(name=data["name"])
    db.session.add(new_stockroom)
    db.session.commit()
    return jsonify(new_stockroom.serialize), 201


@app.route("/stockroom/<int:stockroom_id>", methods=["PUT"])
def update_stockroom(stockroom_id):
    stockroom = Stockroom.query.get_or_404(stockroom_id)
    data = request.json
    stockroom.name = data["name"]
    db.session.commit()
    return jsonify(stockroom.serialize)


@app.route("/stockroom/<int:stockroom_id>", methods=["DELETE"])
def delete_stockroom(stockroom_id):
    stockroom = Stockroom.query.get_or_404(stockroom_id)
    db.session.delete(stockroom)
    db.session.commit()
    return jsonify({"message": "Stockroom deleted"}), 204


# Routes for Status table
@app.route("/statuses", methods=["GET"])
def get_all_statuses():
    statuses = Status.query.all()
    return jsonify([status.serialize for status in statuses])


@app.route("/status", methods=["POST"])
def add_status():
    data = request.json
    new_status = Status(name=data["name"])
    db.session.add(new_status)
    db.session.commit()
    return jsonify(new_status.serialize), 201


@app.route("/status/<int:status_id>", methods=["PUT"])
def update_status(status_id):
    status = Status.query.get_or_404(status_id)
    data = request.json
    status.name = data["name"]
    db.session.commit()
    return jsonify(status.serialize)


@app.route("/status/<int:status_id>", methods=["DELETE"])
def delete_status(status_id):
    status = Status.query.get_or_404(status_id)
    db.session.delete(status)
    db.session.commit()
    return jsonify({"message": "Status deleted"}), 204


# Routes for Request table
@app.route("/requests", methods=["GET"])
def get_all_requests():
    requests = Request.query.all()
    return jsonify([request.serialize for request in requests])


@app.route("/request", methods=["POST"])
def add_request():
    data = request.json
    date_obj = datetime.strptime(data["Date"], "%Y-%m-%d").date()

    new_request = Request(
        EmployeeNumber=data["EmployeeNumber"],
        SerialNumber=data["SerialNumber"],
        Date=date_obj,
        Issue=data["Issue"],
        status_id=data["status_id"],
        condition_id=data["condition_id"],
    )

    db.session.add(new_request)
    db.session.commit()
    return jsonify(new_request.serialize), 201


@app.route("/request-tickets", methods=["GET"])
def get_request_tickets():
    # Query the database for request tickets with status_id = 1 and sorted by date
    request_tickets = Request.query.filter_by(status_id=1).order_by(Request.Date).all()

    # Serialize the request tickets and return them as JSON
    return jsonify([request.serialize for request in request_tickets])


@app.route("/update-request-ticket/<int:request_number>", methods=["PUT"])
def update_request_ticket(request_number):
    request_ticket = Request.query.get_or_404(request_number)
    data = request.json

    if "status_id" in data:
        request_ticket.status_id = data["status_id"]

    if "condition_id" in data:
        request_ticket.condition_id = data["condition_id"]

    db.session.commit()
    return jsonify(request_ticket.serialize)


@app.route("/request/<int:request_number>", methods=["PUT"])
def update_request(request_number):
    request_record = Request.query.get_or_404(request_number)
    data = request.json

    if "Date" in data:
        request_record.Date = datetime.strptime(data["Date"], "%Y-%m-%d").date()

    request_record.EmployeeNumber = data.get(
        "EmployeeNumber", request_record.EmployeeNumber
    )
    request_record.SerialNumber = data.get("SerialNumber", request_record.SerialNumber)
    request_record.Date = data.get("Date", request_record.Date)
    request_record.Issue = data.get("Issue", request_record.Issue)
    request_record.status_id = data.get("status_id", request_record.status_id)
    request_record.condition_id = data.get("condition_id", request_record.condition_id)
    db.session.commit()
    return jsonify(request_record.serialize)


@app.route("/request/<int:request_number>", methods=["DELETE"])
def delete_request(request_number):
    request_record = Request.query.get_or_404(request_number)
    db.session.delete(request_record)
    db.session.commit()
    return jsonify({"message": "Request deleted"}), 204


@app.route("/serial-numbers", methods=["GET"])
def get_serial_numbers():
    serial_numbers = Asset.query.with_entities(Asset.SerialNumber).all()
    # Extracting serial numbers from the tuples
    serial_list = [num[0] for num in serial_numbers]
    return jsonify(serial_list)


@app.route("/employee-status/<int:employee_number>", methods=["GET"])
def get_employee_status(employee_number):
    # Join Employee with Asset and Status to get the current status of the employee's asset
    status = (
        db.session.query(Status.name)
        .join(Asset, Status.status_id == Asset.status_id)
        .join(Employee, Employee.SerialNumber == Asset.SerialNumber)
        .filter(Employee.EmployeeNumber == employee_number)
        .first()
    )
    return jsonify({"status": status.name if status else None})


@app.route("/employee-condition/<int:employee_number>", methods=["GET"])
def get_employee_condition(employee_number):
    # Join Employee with Asset and Condition to get the current condition of the employee's asset
    condition = (
        db.session.query(Condition.name)
        .join(Asset, Condition.condition_id == Asset.condition_id)
        .join(Employee, Employee.SerialNumber == Asset.SerialNumber)
        .filter(Employee.EmployeeNumber == employee_number)
        .first()
    )
    return jsonify({"condition": condition.name if condition else None})


@app.route("/employee/<int:employee_number>/asset", methods=["GET"])
def get_employee_asset(employee_number):
    employee_asset = (
        db.session.query(Asset.SerialNumber)
        .join(Employee, Employee.SerialNumber == Asset.SerialNumber)
        .filter(Employee.EmployeeNumber == employee_number)
        .first()
    )
    if employee_asset:
        return jsonify({"SerialNumber": employee_asset.SerialNumber})
    else:
        return jsonify({"error": "No asset found for the given employee"}), 404
    
@app.route("/employee/<int:employee_number>/name", methods=["GET"])
def get_employee_name(employee_number):
    employee = Employee.query.filter_by(EmployeeNumber=employee_number).first()
    if employee:
        return jsonify({"firstName": employee.FirstName, "lastName": employee.LastName})
    else:
        return jsonify({"error": "No employee found with the given number"}), 404
    
@app.route("/asset/<string:serial_number>", methods=["GET"])
def get_asset(serial_number):
    asset = Asset.query.filter_by(SerialNumber=serial_number).first()
    if asset:
        return jsonify({"ModelID": asset.ModelID})
    else:
        return jsonify({"error": "No asset found with the given serial number"}), 404

@app.route("/model/<int:model_id>", methods=["GET"])
def get_model(model_id):
    model = Model.query.get(model_id)
    if model:
        return jsonify({"ModelName": model.ModelName})
    else:
        return jsonify({"error": "No model found with the given ID"}), 404

# Routes for Tracking


@app.route("/employee-names", methods=["GET"])
def get_employee_names():
    employees = Employee.query.with_entities(
        Employee.FirstName, Employee.LastName
    ).all()
    # Combining first and last names
    employee_names = [f"{emp[0]} {emp[1]}" for emp in employees]
    return jsonify(employee_names)


@app.route("/serial-numbers", methods=["GET"])
def get_serial_numbers_list():
    serial_numbers = Asset.query.with_entities(Asset.SerialNumber).all()
    # Extracting serial numbers from the tuples
    serial_list = [num[0] for num in serial_numbers]
    return jsonify(serial_list)


@app.route("/api/search-asset", methods=["POST"])
def search_asset():
    data = request.json

    # Search by serial number
    if "serialNumber" in data:
        serial_number = data["serialNumber"]
        asset = Asset.query.filter_by(SerialNumber=serial_number).first()
        if asset:
            return jsonify(asset.serialize)

    # Search by employee name
    elif "employeeName" in data:
        employee_name = data["employeeName"]
        # Assuming employee name is in "FirstName LastName" format
        first_name, last_name = employee_name.split(" ", 1)
        employee = Employee.query.filter_by(
            FirstName=first_name, LastName=last_name
        ).first()
        if employee and employee.asset:
            return jsonify(employee.asset.serialize)

    return jsonify({"message": "Asset not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
