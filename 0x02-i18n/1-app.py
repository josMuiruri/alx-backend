#!/usr/bin/env python3
"""
A simple Flask web app with internationalization and localization support.
"""

from flask import Flask, render_template
from flask_babel import Babel

"""
configure the available languages ('en', 'fr')
Set default locale('en') & default timezone('UTC')
"""
class Config:
    LANGUAGES =["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)

# instantiate the Babel object with the Flask app
babel = Babel(app)


@app.route('/')
def index():
    """
    View function for the root URL ("/").
    Renders the index.html which displays a welcome message.
    """
    return render_template('1-index.html')

if __name__ == '__main__':
    app.run(debug=True)
