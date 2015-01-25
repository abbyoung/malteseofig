import os
from flask import Flask, render_template, redirect, request, session, url_for, flash


app = Flask(__name__)

# Adding PyJade because Jade is wonderful
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

@app.route("/")
def index():
    return render_template("index.jade")



if __name__ == "__main__":
    app.run(debug=True)