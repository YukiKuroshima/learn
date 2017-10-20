from flask import Flask, jsonify, send_from_directory, request

app = Flask(__name__)


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
