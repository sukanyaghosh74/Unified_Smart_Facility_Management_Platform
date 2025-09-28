import time
import random
import requests
import paho.mqtt.publish as publish
import os

API_URL = os.getenv('API_URL', 'http://localhost:8000/api/climate/sensors')
MQTT_BROKER = os.getenv('MQTT_BROKER', 'localhost')

SENSOR_IDS = [1, 2, 3, 4]
METRICS = ['CO2', 'Temperature', 'Humidity', 'AQI']

# Generate random sensor data
def generate_data():
    return {
        'CO2': random.randint(400, 600),
        'Temperature': round(random.uniform(22, 28), 1),
        'Humidity': random.randint(40, 70),
        'AQI': random.randint(30, 80),
    }

def send_rest(sensor_id, metric, value):
    payload = {
        'sensor_id': sensor_id,
        'metric': metric,
        'value': value,
    }
    try:
        requests.post(API_URL, json=payload)
    except Exception as e:
        print('REST error:', e)

def send_mqtt(sensor_id, metric, value):
    topic = f"usfmp/climate/{sensor_id}/{metric}"
    payload = str(value)
    try:
        publish.single(topic, payload, hostname=MQTT_BROKER)
    except Exception as e:
        print('MQTT error:', e)

if __name__ == '__main__':
    while True:
        for sensor_id in SENSOR_IDS:
            data = generate_data()
            for metric, value in data.items():
                send_rest(sensor_id, metric, value)
                send_mqtt(sensor_id, metric, value)
        print('Sent fake IoT data')
        time.sleep(5)
