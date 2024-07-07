#!/usr/bin/env python3
from flask import Flask, request, render_template
from flask_babel import Babel, _
from typing import Optional

app = Flask(__name__)

class Config:
    """
    Configuration class for the Flask app.
    Contains language and timezone settings for Babel.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

# applying config to the flask app
app.config.from_object(Config)

# Initializing Babel with the Flask app
babel = Babel(app)


@babel.localeselector
def get_locale() -> Optional[str]:
    """
    Func to select the best match locale from the request
    It uses the Accept-Language header sent by the browser to determine
    the best match from the supported languages.
    Returns:
        Optional[str]: The best match locale
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/')
def index() -> str:
    """
    Route for the home page of the Flask app.
    Renders the index.html template.
    Returns:
        str: Rendered HTML content of the home page.
    """
    return render_template('3-index.html')

if __name__ == '__main__':
    app.run(debug=True)
