from flask import Flask
from time import sleep
import random

app = Flask(__name__)

@app.route('/')
def homepage():

  sleep_time = random.randrange(7)
  sleep(sleep_time)

  return """
<p>I waited {0}[s].</p>
""".format(str(sleep_time))

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80, debug=True, use_reloader=True)
