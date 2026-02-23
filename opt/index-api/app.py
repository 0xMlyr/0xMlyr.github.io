#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import threading
import time

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

def rotate_log():
    if os.path.exists(LOG_FILE) and os.path.getsize(LOG_FILE) > 0:
        yesterday = datetime.now() - timedelta(days=1)
        new_name = f"{LOG_FILE}.{yesterday.strftime('%Y.%m.%d')}"
        os.rename(LOG_FILE, new_name)
    open(LOG_FILE, 'w').close()

def schedule_rotation():
    while True:
        now = datetime.now()
        next_run = now.replace(hour=4, minute=0, second=0, microsecond=0)
        if now.hour >= 4:
            next_run += timedelta(days=1)
        time.sleep((next_run - now).total_seconds())
        rotate_log()

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
        data = request.get_json() or {}
        ip = data.get('ip', 'unknown')
        user_agent = data.get('userAgent') or request.headers.get('User-Agent', 'unknown')
        
        count = get_count() + 1
        set_count(count)
        
        log_message(f"IP: {ip} | UA: {user_agent}")
        
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
    threading.Thread(target=schedule_rotation, daemon=True).start()
    app.run(host='0.0.0.0', port=5099, debug=False)
