from flask import Flask, jsonify
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

CLOUDINARY_API_KEY = '299577896415263'
CLOUDINARY_API_SECRET = 'RM1cUhocCcFoQOeDrZCMVnGuYL4'
CLOUD_NAME = 'djoxmw3hw'

@app.route('/api/cloudinary/images', methods=['GET'])
def get_cloudinary_images():
    url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image?&max_results=36'
    response = requests.get(url, auth=HTTPBasicAuth(CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET))
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch images', 'details': response.text}), response.status_code

if __name__ == '__main__':
    app.run(port=5001, debug=True) 