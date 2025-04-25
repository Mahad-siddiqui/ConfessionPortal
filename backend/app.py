from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize the Flask application and set up database and login manager
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///confessions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key'

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# User model


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Confession model


class Confession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.String(1000), nullable=False)
    user = db.relationship(
        'User', backref=db.backref('confessions', lazy=True))

    def __repr__(self):
        return f'<Confession {self.id}>'

# User loader for Flask-Login


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Registration route


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = generate_password_hash(
            request.form['password'], method='pbkdf2:sha256')

        new_user = User(username=username, email=email, password=password)

        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except:
            flash('Error! User already exists.', 'danger')
            return redirect(url_for('register'))

    return render_template('register.html')

# Login route


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('profile'))
        else:
            flash('Login Unsuccessful. Please check email and password.', 'danger')

    return render_template('login.html')

# Profile route (Logged in user view)


@app.route('/profile')
@login_required
def profile():
    user_confessions = Confession.query.filter_by(
        user_id=current_user.id).all()
    return render_template('profile.html', confessions=user_confessions)

# Logout route


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/create_confession', methods=['GET', 'POST'])
@login_required
def create_confession():
    if request.method == 'POST':
        confession_text = request.form['confession']

        # Create a new Confession object and store it in the database
        new_confession = Confession(
            user_id=current_user.id, text=confession_text)

        try:
            db.session.add(new_confession)
            db.session.commit()
            flash('Your confession has been submitted!', 'success')
            return redirect(url_for('profile'))
        except:
            flash('Error submitting your confession. Try again.', 'danger')
            return redirect(url_for('create_confession'))

    return render_template('create_confession.html')


@app.route('/all_confessions', methods=['GET'])
def all_confessions():
    # Retrieve all confessions from the database
    confessions = Confession.query.all()
    return render_template('all_confessions.html', confessions=confessions)


@app.route('/edit_confession/<int:confession_id>', methods=['GET', 'POST'])
@login_required
def edit_confession(confession_id):
    confession = Confession.query.get_or_404(confession_id)

    # Check if the logged-in user is the owner of the confession
    if confession.user_id != current_user.id:
        flash('You are not authorized to edit this confession.', 'danger')
        return redirect(url_for('profile'))

    if request.method == 'POST':
        confession.text = request.form['confession']
        try:
            db.session.commit()
            flash('Confession updated successfully!', 'success')
            return redirect(url_for('profile'))
        except:
            flash('Error updating your confession. Try again.', 'danger')
            return redirect(url_for('edit_confession', confession_id=confession.id))

    return render_template('edit_confession.html', confession=confession)


@app.route('/delete_confession/<int:confession_id>', methods=['GET', 'POST'])
@login_required
def delete_confession(confession_id):
    confession = Confession.query.get_or_404(confession_id)

    # Check if the logged-in user is the owner of the confession
    if confession.user_id != current_user.id:
        flash('You are not authorized to delete this confession.', 'danger')
        return redirect(url_for('profile'))

    try:
        db.session.delete(confession)
        db.session.commit()
        flash('Confession deleted successfully!', 'success')
    except:
        flash('Error deleting your confession. Try again.', 'danger')

    return redirect(url_for('profile'))


if __name__ == '__main__':
    app.run(debug=True)
