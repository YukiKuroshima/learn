from flask import Flask, jsonify, send_from_directory, request
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp


app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret'
app.config['JWT_AUTH_USERNAME_KEY'] = 'email'


class User(object):
    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id


users = [
        User(1, '1@1.com', 'abcxyz'),
        User(2, 'user2', 'abcxyz'),
        ]

email_table = {u.email: u for u in users}
userid_table = {u.id: u for u in users}


def authenticate(email, password):
    user = email_table.get(email, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user


def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)


jwt = JWT(app, authenticate, identity)


@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

# Execute when HTTPrequest calls 'GET /hello'
# Or
# Execute when browser access to localhost:5000/hello
@app.route('/hello', methods=['GET'])
def say_hello():
    # Return the json file
    # {
    #   "message": "Hello from API server"
    # }
    return jsonify(message="Hello from API server")


# Execute when HTTPrequest calls 'POST /message'
@app.route('/message', methods=['POST'])
def post_message():
    content = request.get_json()
    print(content)
    return jsonify(content)


# Execute when browser access to localhost:5000/static
# Used for serving satic files javascript, css
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('./static', filename)


# Execute when browser access to localhost:5000
@app.route('/')
def serve_html_file():
    return send_from_directory('./', 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
