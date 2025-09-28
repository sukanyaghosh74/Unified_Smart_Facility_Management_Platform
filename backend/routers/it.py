from fastapi import APIRouter

router = APIRouter(prefix="/it", tags=["IT Infra"])

@router.get("/servers")
def list_servers():
    return []
