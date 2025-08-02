from fastapi import APIRouter
from typing import List
from db.database import database
from db.models import tipo_electrodomestico, estado_dispositivo, rol_usuarios
from schemas.models import TipoElectrodomestico, EstadoDispositivo

router = APIRouter()

@router.get("/tipos-electrodomesticos/", response_model=List[TipoElectrodomestico], tags=["Catálogos"])
async def listar_tipos_electrodomesticos():
    query = tipo_electrodomestico.select()
    return await database.fetch_all(query)

@router.get("/estados-dispositivo/", response_model=List[EstadoDispositivo], tags=["Catálogos"])
async def listar_estados_dispositivo():
    query = estado_dispositivo.select()
    return await database.fetch_all(query)

@router.get("/roles-usuarios/", response_model=List[dict], tags=["Catálogos"])
async def listar_roles_usuarios():
    query = rol_usuarios.select()
    roles = await database.fetch_all(query)
    return [{"id_rol_usuario": r["id_rol_usuario"], "nombre": r["nombre"]} for r in roles]