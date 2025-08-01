from fastapi import APIRouter, HTTPException
from typing import List
from db.database import database
from db.models import instituciones
from schemas.models import Institucion

router = APIRouter()

@router.get("/instituciones/", response_model=List[Institucion], tags=["Instituciones"])
async def listar_instituciones():
    query = instituciones.select()
    return await database.fetch_all(query)

@router.get("/instituciones/{institucion_id}", response_model=Institucion, tags=["Instituciones"])
async def obtener_institucion(institucion_id: int):
    query = instituciones.select().where(instituciones.c.id_institucion == institucion_id)
    institucion = await database.fetch_one(query)
    if not institucion:
        raise HTTPException(status_code=404, detail="Institución no encontrada")
    return institucion

@router.post("/instituciones/", response_model=Institucion, tags=["Instituciones"])
async def crear_institucion(institucion: Institucion):
    query = instituciones.insert().values(**institucion.dict())
    institucion_id = await database.execute(query)
    return {**institucion.dict(), "id_institucion": institucion_id}