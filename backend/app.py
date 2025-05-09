from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///confessions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key'

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


class Confession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.String(1000), nullable=False)
    user = db.relationship(
        'User', backref=db.backref('confessions', lazy=True))

    def __repr__(self):
        return f'<Confession {self.id}>'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register route (API version)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(username=username, email=email, password=password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Registration successful!', 'user': {'username': new_user.username, 'email': new_user.email}}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Login route (API version)


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Login successful', 'user': {'username': user.username, 'email': user.email}}), 200
    return jsonify({'error': 'Invalid credentials'}), 400

# Logout route (API version)


@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Check auth status (API version)


@app.route('/api/check_auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({'user': {'username': current_user.username, 'email': current_user.email}}), 200
    return jsonify({'user': None}), 200

# Create confession (API version)


@app.route('/api/create_confession', methods=['POST'])
@login_required
def create_confession():
    data = request.get_json()
    confession_text = data['confession']

    new_confession = Confession(user_id=current_user.id, text=confession_text)

    try:
        db.session.add(new_confession)
        db.session.commit()
        return jsonify({'message': 'Confession submitted successfully!', 'confession': {'id': new_confession.id, 'text': new_confession.text}}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Get all confessions (API version)


@app.route('/api/all_confessions', methods=['GET'])
def all_confessions():
    confessions = Confession.query.all()
    return jsonify([{'id': confession.id, 'text': confession.text} for confession in confessions]), 200

# Edit confession (API version)


@app.route('/api/edit_confession/<int:confession_id>', methods=['PUT'])
@login_required
def edit_confession(confession_id):
    confession = Confession.query.get_or_404(confession_id)

    if confession.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to edit this confession'}), 403

    data = request.get_json()
    confession.text = data['confession']

    try:
        db.session.commit()
        return jsonify({'message': 'Confession updated successfully!', 'confession': {'id': confession.id, 'text': confession.text}}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Delete confession (API version)


@app.route('/api/delete_confession/<int:confession_id>', methods=['DELETE'])
@login_required
def delete_confession(confession_id):
    confession = Confession.query.get_or_404(confession_id)

    if confession.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete this confession'}), 403

    try:
        db.session.delete(confession)
        db.session.commit()
        return jsonify({'message': 'Confession deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Allow all domains for testing purposes
CORS(app)


if __name__ == '__main__':
    app.run(debug=True)
