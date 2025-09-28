import asyncio
import asyncpg
import os

DB_URL = os.getenv('DATABASE_URL', 'postgresql://usfmp:usfmp_pass@localhost:5432/usfmp_db')

USERS = [
    ('admin', 'adminpass', 'admin'),
    ('security', 'securitypass', 'security'),
    ('manager', 'managerpass', 'facility_manager'),
]
VISITORS = [
    ('John Doe', 'faceid1', 'qr1'),
    ('Jane Smith', 'faceid2', 'qr2'),
]
SENSORS = [
    ('CO2 Sensor', 'Lobby', 'CO2'),
    ('Temp Sensor', 'Server Room', 'Temperature'),
    ('Humidity Sensor', 'Office', 'Humidity'),
    ('AQI Sensor', 'Parking', 'AQI'),
]
SERVERS = [
    ('Server 1', 'Datacenter'),
    ('Server 2', 'Datacenter'),
]

async def main():
    conn = await asyncpg.connect(DB_URL)
    # Users
    for username, password, role in USERS:
        await conn.execute("""
            INSERT INTO users (username, hashed_password, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (username) DO NOTHING
        """, username, password, role)
    # Visitors
    for name, face_id, qr_code in VISITORS:
        await conn.execute("""
            INSERT INTO visitors (name, face_id, qr_code)
            VALUES ($1, $2, $3)
            ON CONFLICT (face_id) DO NOTHING
        """, name, face_id, qr_code)
    # Sensors
    for name, location, type_ in SENSORS:
        await conn.execute("""
            INSERT INTO sensors (name, location, type)
            VALUES ($1, $2, $3)
            ON CONFLICT (name) DO NOTHING
        """, name, location, type_)
    # Servers
    for name, location in SERVERS:
        await conn.execute("""
            INSERT INTO servers (name, location)
            VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING
        """, name, location)
    await conn.close()
    print('Seeded demo data.')

if __name__ == '__main__':
    asyncio.run(main())
