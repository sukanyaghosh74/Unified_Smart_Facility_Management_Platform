from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    admin = "admin"
    security = "security"
    facility_manager = "facility_manager"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.facility_manager)

class Visitor(Base):
    __tablename__ = "visitors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    face_id = Column(String, unique=True)
    qr_code = Column(String)

class AccessLog(Base):
    __tablename__ = "access_logs"
    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"))
    timestamp = Column(DateTime)
    entry = Column(String)  # 'in' or 'out'

class Sensor(Base):
    __tablename__ = "sensors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    type = Column(String)  # e.g., CO2, temp, humidity, AQI

class ClimateData(Base):
    __tablename__ = "climate_data"
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    timestamp = Column(DateTime)
    value = Column(Float)
    metric = Column(String)  # e.g., CO2, temp, humidity, AQI

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)

class ServerMetric(Base):
    __tablename__ = "server_metrics"
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    timestamp = Column(DateTime)
    cpu = Column(Float)
    memory = Column(Float)
    uptime = Column(Float)
    anomaly = Column(Integer, default=0)
