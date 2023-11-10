from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database configuration using PyMySQL
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "mysql+pymysql://Code:pQef-TSIW)Cgpw00@jessepaulwells.ddnsgeek.com:3306/jrnl_database"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# Asset model definition
class Asset(db.Model):
    __tablename__ = "asset"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    location = db.Column(db.String(255))
    status = db.Column(db.String(255))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# Routes
@app.route("/")
def index():
    return jsonify({"message": "Welcome to the Flask Backend!"})


@app.route("/assets", methods=["GET"])
def get_all_assets():
    assets = Asset.query.all()
    return jsonify([asset.as_dict() for asset in assets])


@app.route("/assets", methods=["POST"])
def insert_asset():
    data = request.json
    new_asset = Asset(
        name=data["name"],
        description=data["description"],
        location=data["location"],
        status=data["status"],
    )
    db.session.add(new_asset)
    db.session.commit()
    return jsonify(message="Asset added successfully!", id=new_asset.id)


@app.route("/assets/<int:id>", methods=["PUT"])
def update_asset(id):
    asset = Asset.query.get(id)
    if not asset:
        return jsonify(message="Asset not found!"), 404

    data = request.json
    asset.name = data["name"]
    asset.description = data["description"]
    asset.location = data["location"]
    asset.status = data["status"]
    db.session.commit()
    return jsonify(message="Asset updated successfully!")


@app.route("/assets/<int:id>", methods=["DELETE"])
def delete_asset(id):
    asset = Asset.query.get(id)
    if not asset:
        return jsonify(message="Asset not found!"), 404

    db.session.delete(asset)
    db.session.commit()
    return jsonify(message="Asset deleted successfully!")


if __name__ == "__main__":
    app.run(debug=True)
