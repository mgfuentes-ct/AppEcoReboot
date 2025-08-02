from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from db.database import database
from db.models import usuarios, rol_usuarios

router = APIRouter()

class LoginData(BaseModel):
    correo: str
    password: str

@router.post("/login", tags=["Autenticación"])
async def login(data: LoginData):
    query = select(
        usuarios.c.id_usuario,
        usuarios.c.nombre,
        usuarios.c.correo,
        usuarios.c.telefono,
        usuarios.c.id_rol_usuario,
        usuarios.c.contraseña,
        rol_usuarios.c.nombre.label("rol_nombre")
    ).select_from(
        usuarios.join(rol_usuarios, usuarios.c.id_rol_usuario == rol_usuarios.c.id_rol_usuario)
    ).where(usuarios.c.correo == data.correo)

    user = await database.fetch_one(query)

    if not user:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if data.password == user["contraseña"]:
        return {
            "id_usuario": user["id_usuario"],
            "nombre": user["nombre"],
            "rol": {"nombre": user["rol_nombre"]}
        }

    raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")