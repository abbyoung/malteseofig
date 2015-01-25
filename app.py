import os
from flask import Flask, render_template, redirect, request, session, url_for, flash

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.jade")



if __name__ == "__main__":
    app.run(debug=True)