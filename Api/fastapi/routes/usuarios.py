# fastapi/routes/usuarios.py

from fastapi import APIRouter, HTTPException
from typing import List
from sqlalchemy import select
from db.database import database
from db.models import usuarios, rol_usuarios
from schemas.models import Usuario, UsuarioCreate, UsuarioUpdate  # ✅ Importación corregida

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/", response_model=List[Usuario])
async def obtener_usuarios():
    query = select(
        usuarios.c.id_usuario,
        usuarios.c.nombre,
        usuarios.c.telefono,
        usuarios.c.correo,
        usuarios.c.id_rol_usuario,
        rol_usuarios.c.nombre.label("rol_nombre")
    ).select_from(
        usuarios.join(rol_usuarios, usuarios.c.id_rol_usuario == rol_usuarios.c.id_rol_usuario)
    )
    rows = await database.fetch_all(query)
    usuarios_list = []
    for row in rows:
        user = {
            "id_usuario": row["id_usuario"],
            "nombre": row["nombre"],
            "telefono": row["telefono"],
            "correo": row["correo"],
            "rol": {
                "id_rol_usuario": row["id_rol_usuario"],
                "nombre": row["rol_nombre"]
            }
        }
        usuarios_list.append(user)
    return usuarios_list


@router.get("/{usuario_id}", response_model=Usuario)
async def obtener_usuario(usuario_id: int):
    query = select(
        usuarios.c.id_usuario,
        usuarios.c.nombre,
        usuarios.c.telefono,
        usuarios.c.correo,
        usuarios.c.id_rol_usuario,
        rol_usuarios.c.nombre.label("rol_nombre")
    ).select_from(
        usuarios.join(rol_usuarios, usuarios.c.id_rol_usuario == rol_usuarios.c.id_rol_usuario)
    ).where(usuarios.c.id_usuario == usuario_id)
    row = await database.fetch_one(query)
    if not row:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user = {
        "id_usuario": row["id_usuario"],
        "nombre": row["nombre"],
        "telefono": row["telefono"],
        "correo": row["correo"],
        "rol": {
            "id_rol_usuario": row["id_rol_usuario"],
            "nombre": row["rol_nombre"]
        }
    }
    return user


@router.post("/", response_model=Usuario)
async def crear_usuario(usuario: UsuarioCreate):
    query = usuarios.insert().values(
        nombre=usuario.nombre,
        telefono=usuario.telefono,
        correo=usuario.correo,
        id_rol_usuario=usuario.id_rol_usuario,
        contraseña=usuario.contraseña  # ✅ Incluida correctamente
    )
    usuario_id = await database.execute(query)
    return await obtener_usuario(usuario_id)


@router.put("/{usuario_id}", response_model=Usuario)
async def editar_usuario(usuario_id: int, usuario: UsuarioUpdate):  # ✅ Modelo correcto
    query = usuarios.update().where(usuarios.c.id_usuario == usuario_id).values(
        nombre=usuario.nombre,
        telefono=usuario.telefono,
        correo=usuario.correo,
        id_rol_usuario=usuario.id_rol_usuario
    )
    await database.execute(query)
    return await obtener_usuario(usuario_id)


@router.delete("/{usuario_id}")
async def eliminar_usuario(usuario_id: int):
    query = usuarios.delete().where(usuarios.c.id_usuario == usuario_id)
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "¡Usuario eliminado con éxito!"}