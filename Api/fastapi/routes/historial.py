from fastapi import APIRouter
from typing import List
from db.database import database
from db.models import reparaciones, reciclajes
from schemas.models import DispositivoHistorial

router = APIRouter()

@router.get("/dispositivos/{dispositivo_id}/historial", response_model=DispositivoHistorial, tags=["Dispositivos"])
async def historial_dispositivo(dispositivo_id: int):
    query_reparaciones = reparaciones.select().where(reparaciones.c.id_dispositivo == dispositivo_id)
    reparaciones_list = await database.fetch_all(query_reparaciones)
    
    query_reciclajes = reciclajes.select().where(reciclajes.c.id_dispositivo == dispositivo_id)
    reciclajes_list = await database.fetch_all(query_reciclajes)
    
    return {
        "reparaciones": reparaciones_list,
        "reciclajes": reciclajes_list
    }