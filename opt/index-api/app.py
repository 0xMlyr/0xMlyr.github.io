#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
NUM_FILE = os.path.join(BASE_DIR, 'num.txt')
LOG_FILE = os.path.join(BASE_DIR, 'customer.log')

def init_files():
    if not os.path.exists(NUM_FILE):
        with open(NUM_FILE, 'w') as f:
            f.write('0')
    if not os.path.exists(LOG_FILE):
        open(LOG_FILE, 'w').close()

def log_message(msg):
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
    except Exception as e:
        print(f"Log error: {e}")

def get_count():
    try:
        with open(NUM_FILE, 'r') as f:
            return int(f.read().strip())
    except:
        return 0

def set_count(count):
    with open(NUM_FILE, 'w') as f:
        f.write(str(count))

@app.route('/api/visit', methods=['POST'])
def record_visit():
    try:
        data = request.get_json()
        ip = data.get('ip', 'unknown')
        
        count = get_count() + 1
        set_count(count)
        
        log_message(f"IP: {ip}")
        
        return jsonify({'success': True, 'count': count})
    except Exception as e:
        log_message(f"ERROR: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/count', methods=['GET'])
def get_visit_count():
    try:
        count = get_count()
        return jsonify({'success': True, 'count': count})
    except Exception as e:
        log_message(f"ERROR: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    init_files()
    app.run(host='0.0.0.0', port=5099, debug=False)
