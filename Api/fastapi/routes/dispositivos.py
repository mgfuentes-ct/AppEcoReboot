# routes/dispositivos.py
from fastapi import APIRouter, HTTPException
from typing import List
from db.models import dispositivos
from db import database
from schemas.models import Dispositivo

router = APIRouter(prefix="/dispositivos", tags=["Dispositivos"])

@router.get("/", response_model=List[Dispositivo])
async def listar_dispositivos():
    query = dispositivos.select()
    return await database.fetch_all(query)

@router.get("/{dispositivo_id}", response_model=Dispositivo)
async def obtener_dispositivo(dispositivo_id: int):
    query = dispositivos.select().where(dispositivos.c.id_dispositivo == dispositivo_id)
    dispositivo = await database.fetch_one(query)
    if not dispositivo:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return dispositivo

@router.post("/", response_model=Dispositivo)
async def crear_dispositivo(dispositivo: Dispositivo):
    query = dispositivos.insert().values(**dispositivo.dict())
    dispositivo_id = await database.execute(query)
    return {**dispositivo.dict(), "id_dispositivo": dispositivo_id}

@router.put("/{dispositivo_id}", response_model=Dispositivo)
async def actualizar_dispositivo(dispositivo_id: int, dispositivo: Dispositivo):
    update_query = dispositivos.update().where(dispositivos.c.id_dispositivo == dispositivo_id).values(
        id_donacion=dispositivo.id_donacion,
        descripcion=dispositivo.descripcion,
        modelo=dispositivo.modelo,
        nombre=dispositivo.nombre
    )
    result = await database.execute(update_query)
    if not result:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return await obtener_dispositivo(dispositivo_id)

@router.delete("/{dispositivo_id}")
async def eliminar_dispositivo(dispositivo_id: int):
    query = dispositivos.delete().where(dispositivos.c.id_dispositivo == dispositivo_id)
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return {"message": "¡Dispositivo eliminado con éxito!"}

@router.get("/donaciones/{donacion_id}", response_model=List[Dispositivo])
async def dispositivos_por_donacion(donacion_id: int):
    query = dispositivos.select().where(dispositivos.c.id_donacion == donacion_id)
    return await database.fetch_all(query)