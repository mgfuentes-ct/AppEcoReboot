from fastapi import APIRouter, HTTPException
from typing import List
from db.database import database
from db.models import reparaciones
from schemas.models import Reparacion

router = APIRouter()

@router.get("/reparaciones/", response_model=List[Reparacion], tags=["Reparaciones"])
async def listar_reparaciones():
    query = reparaciones.select()
    return await database.fetch_all(query)

@router.get("/reparaciones/{reparacion_id}", response_model=Reparacion, tags=["Reparaciones"])
async def obtener_reparacion(reparacion_id: int):
    query = reparaciones.select().where(reparaciones.c.id_reparacion == reparacion_id)
    reparacion = await database.fetch_one(query)
    if not reparacion:
        raise HTTPException(status_code=404, detail="Reparación no encontrada")
    return reparacion

@router.post("/reparaciones/", response_model=Reparacion, tags=["Reparaciones"])
async def crear_reparacion(reparacion: Reparacion):
    query = reparaciones.insert().values(**reparacion.dict())
    reparacion_id = await database.execute(query)
    return {**reparacion.dict(), "id_reparacion": reparacion_id}