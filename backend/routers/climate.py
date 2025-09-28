from fastapi import APIRouter

router = APIRouter(prefix="/climate", tags=["Climate Monitoring"])

@router.get("/sensors")
def list_sensors():
    return []
