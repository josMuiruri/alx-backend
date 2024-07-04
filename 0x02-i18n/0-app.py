#!/usr/bin/env python3
"""
simple Flask web application that displays a welcome message
"""
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    """
    View function for the root URL("/")
    Renders the index.html which displays a welcome message
    """
    return render_template('0-index.html')

if __name__ == '__main__':
    app.run(debug=True)
