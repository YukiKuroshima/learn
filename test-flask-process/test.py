from flask import Flask
from time import sleep
if __name__ == '__main__':
  app = Flask(__name__)
  app.config.update(PROPAGATE_EXCEPTIONS = True)

  @app.route('/')
  def greet():
    n = 3 
    sleep(n)
    return 'Hello world! I slept {0}[s].'.format(str(n))

  app.run()
