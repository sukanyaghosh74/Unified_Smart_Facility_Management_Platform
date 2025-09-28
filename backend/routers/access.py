from fastapi import APIRouter

router = APIRouter(prefix="/access", tags=["Access Control"])

@router.get("/visitors")
def list_visitors():
    return []
