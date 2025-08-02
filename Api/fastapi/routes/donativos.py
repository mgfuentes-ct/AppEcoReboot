from fastapi import APIRouter, HTTPException
from typing import List
from db.database import database
from db.models import donativos
from schemas.models import Donativo

router = APIRouter()

@router.get("/donativos/", response_model=List[Donativo], tags=["Donativos"])
async def listar_donativos():
    query = donativos.select()
    return await database.fetch_all(query)

@router.get("/donativos/{donativo_id}", response_model=Donativo, tags=["Donativos"])
async def obtener_donativo(donativo_id: int):
    query = donativos.select().where(donativos.c.id_donativo == donativo_id)
    donativo = await database.fetch_one(query)
    if not donativo:
        raise HTTPException(status_code=404, detail="Donativo no encontrado")
    return donativo

@router.post("/donativos/", response_model=Donativo, tags=["Donativos"])
async def crear_donativo(donativo: Donativo):
    query = donativos.insert().values(**donativo.dict())
    donativo_id = await database.execute(query)
    return {**donativo.dict(), "id_donativo": donativo_id}