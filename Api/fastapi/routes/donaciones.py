from fastapi import APIRouter, HTTPException
from typing import List
from sqlalchemy import select
from db.database import database
from db.models import donaciones, usuarios, tipo_electrodomestico, estado_dispositivo
from schemas.models import Donacion, DonacionUpdate, DonacionByUserCreate

router = APIRouter(prefix="/donaciones", tags=["Donaciones"])

@router.get("/", response_model=List[Donacion])
async def listar_donaciones():
    query = select(
        donaciones.c.id_donacion,
        donaciones.c.id_usuario,
        donaciones.c.id_tipo_electrodomestico,
        donaciones.c.id_estado_dispositivo,
        donaciones.c.fecha,
        donaciones.c.imperfecciones,
        donaciones.c.telefono,
        donaciones.c.total_dispositivos,
        donaciones.c.activo,
        usuarios.c.nombre.label("usuario_nombre"),
        usuarios.c.telefono.label("usuario_telefono"),
        usuarios.c.correo.label("usuario_correo"),
        tipo_electrodomestico.c.nombre.label("tipo_nombre"),
        estado_dispositivo.c.nombre.label("estado_nombre")
    ).select_from(
        donaciones.join(usuarios, donaciones.c.id_usuario == usuarios.c.id_usuario)
                  .join(tipo_electrodomestico, donaciones.c.id_tipo_electrodomestico == tipo_electrodomestico.c.id_tipo_electrodomestico)
                  .join(estado_dispositivo, donaciones.c.id_estado_dispositivo == estado_dispositivo.c.id_estado_dispositivo)
    ).where(donaciones.c.activo == True).order_by(donaciones.c.id_donacion)

    rows = await database.fetch_all(query)
    donaciones_list = []
    for row in rows:
        donacion = {
            "id_donacion": row["id_donacion"],
            "id_usuario": row["id_usuario"],
            "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
            "id_estado_dispositivo": row["id_estado_dispositivo"],
            "fecha": row["fecha"],
            "imperfecciones": row["imperfecciones"],
            "telefono": row["telefono"],
            "total_dispositivos": row["total_dispositivos"],
            "activo": row["activo"],
            "usuario": {
                "id_usuario": row["id_usuario"],
                "nombre": row["usuario_nombre"],
                "telefono": row["usuario_telefono"],
                "correo": row["usuario_correo"],
                "rol": None
            },
            "tipo": {
                "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
                "nombre": row["tipo_nombre"]
            },
            "estado": {
                "id_estado_dispositivo": row["id_estado_dispositivo"],
                "nombre": row["estado_nombre"]
            }
        }
        donaciones_list.append(donacion)
    return donaciones_list

@router.get("/{donation_id}", response_model=Donacion)
async def obtener_donacion(donation_id: int):
    query = select(
        donaciones.c.id_donacion,
        donaciones.c.id_usuario,
        donaciones.c.id_tipo_electrodomestico,
        donaciones.c.id_estado_dispositivo,
        donaciones.c.fecha,
        donaciones.c.imperfecciones,
        donaciones.c.telefono,
        donaciones.c.total_dispositivos,
        donaciones.c.activo,
        usuarios.c.nombre.label("usuario_nombre"),
        usuarios.c.telefono.label("usuario_telefono"),
        usuarios.c.correo.label("usuario_correo"),
        tipo_electrodomestico.c.nombre.label("tipo_nombre"),
        estado_dispositivo.c.nombre.label("estado_nombre")
    ).select_from(
        donaciones.join(usuarios, donaciones.c.id_usuario == usuarios.c.id_usuario)
                  .join(tipo_electrodomestico, donaciones.c.id_tipo_electrodomestico == tipo_electrodomestico.c.id_tipo_electrodomestico)
                  .join(estado_dispositivo, donaciones.c.id_estado_dispositivo == estado_dispositivo.c.id_estado_dispositivo)
    ).where(donaciones.c.id_donacion == donation_id)

    row = await database.fetch_one(query)
    if row is None:
        raise HTTPException(status_code=404, detail="Donación no encontrada")
    return {
        "id_donacion": row["id_donacion"],
        "id_usuario": row["id_usuario"],
        "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
        "id_estado_dispositivo": row["id_estado_dispositivo"],
        "fecha": row["fecha"],
        "imperfecciones": row["imperfecciones"],
        "telefono": row["telefono"],
        "total_dispositivos": row["total_dispositivos"],
        "activo": row["activo"],
        "usuario": {
            "id_usuario": row["id_usuario"],
            "nombre": row["usuario_nombre"],
            "telefono": row["usuario_telefono"],
            "correo": row["usuario_correo"],
            "rol": None
        },
        "tipo": {
            "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
            "nombre": row["tipo_nombre"]
        },
        "estado": {
            "id_estado_dispositivo": row["id_estado_dispositivo"],
            "nombre": row["estado_nombre"]
        }
    }

@router.put("/{donation_id}", response_model=Donacion)
async def editar_donacion(donation_id: int, datos: DonacionUpdate):
    update_query = donaciones.update().where(donaciones.c.id_donacion == donation_id).values(
        id_tipo_electrodomestico=datos.id_tipo_electrodomestico,
        id_estado_dispositivo=datos.id_estado_dispositivo,
        fecha=datos.fecha,
        imperfecciones=datos.imperfecciones,
        telefono=datos.telefono,
        total_dispositivos=datos.total_dispositivos
    )
    result = await database.execute(update_query)
    if not result:
        raise HTTPException(status_code=404, detail="Donación no encontrada")
    return await obtener_donacion(donation_id)

@router.delete("/{donation_id}")
async def eliminar_donacion(donation_id: int):
    update_query = donaciones.update().where(donaciones.c.id_donacion == donation_id).values(activo=False)
    result = await database.execute(update_query)
    if not result:
        raise HTTPException(status_code=404, detail="Donación no encontrada")
    return {"message": "¡Donación desactivada con éxito!"}


@router.post("/usuario/{id_usuario}")
async def crear_donacion(id_usuario: int, donacion: DonacionByUserCreate):
    query = donaciones.insert().values(
        id_usuario=id_usuario,
        id_tipo_electrodomestico=donacion.id_tipo_electrodomestico,
        id_estado_dispositivo=donacion.id_estado_dispositivo,
        fecha=donacion.fecha,
        imperfecciones=donacion.imperfecciones,
        telefono=donacion.telefono,
        total_dispositivos=donacion.total_dispositivos,
        activo=True
    )
    nueva_id = await database.execute(query)
    return {"message": "Donación registrada correctamente", "id_donacion": nueva_id}

@router.get("/usuarios/{usuario_id}/donaciones", response_model=List[Donacion])
async def listar_donaciones_usuario(usuario_id: int):
    query = select(
        donaciones.c.id_donacion,
        donaciones.c.id_usuario,
        donaciones.c.id_tipo_electrodomestico,
        donaciones.c.id_estado_dispositivo,
        donaciones.c.fecha,
        donaciones.c.imperfecciones,
        donaciones.c.telefono,
        donaciones.c.total_dispositivos,
        donaciones.c.activo,
        tipo_electrodomestico.c.nombre.label("tipo_nombre"),
        estado_dispositivo.c.nombre.label("estado_nombre")
    ).select_from(
        donaciones.join(tipo_electrodomestico)
                  .join(estado_dispositivo)
    ).where(donaciones.c.id_usuario == usuario_id, donaciones.c.activo == True)

    rows = await database.fetch_all(query)
    donaciones_list = []
    for row in rows:
        donacion = {
            "id_donacion": row["id_donacion"],
            "id_usuario": row["id_usuario"],
            "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
            "id_estado_dispositivo": row["id_estado_dispositivo"],
            "fecha": row["fecha"],
            "imperfecciones": row["imperfecciones"],
            "telefono": row["telefono"],
            "total_dispositivos": row["total_dispositivos"],
            "activo": row["activo"],
            "usuario": None,
            "tipo": {
                "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
                "nombre": row["tipo_nombre"]
            },
            "estado": {
                "id_estado_dispositivo": row["id_estado_dispositivo"],
                "nombre": row["estado_nombre"]
            }
        }
        donaciones_list.append(donacion)
    return donaciones_list

@router.get("/usuario/{usuario_id}", response_model=List[Donacion])
async def listar_donaciones_por_usuario(usuario_id: int):
    query = select(
        donaciones.c.id_donacion,
        donaciones.c.id_usuario,
        donaciones.c.id_tipo_electrodomestico,
        donaciones.c.id_estado_dispositivo,
        donaciones.c.fecha,
        donaciones.c.imperfecciones,
        donaciones.c.telefono,
        donaciones.c.total_dispositivos,
        donaciones.c.activo,
        tipo_electrodomestico.c.nombre.label("tipo_nombre"),
        estado_dispositivo.c.nombre.label("estado_nombre")
    ).select_from(
        donaciones.join(tipo_electrodomestico)
                  .join(estado_dispositivo)
    ).where(donaciones.c.id_usuario == usuario_id, donaciones.c.activo == True)

    rows = await database.fetch_all(query)
    donaciones_list = []
    for row in rows:
        donacion = {
            "id_donacion": row["id_donacion"],
            "id_usuario": row["id_usuario"],
            "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
            "id_estado_dispositivo": row["id_estado_dispositivo"],
            "fecha": row["fecha"],
            "imperfecciones": row["imperfecciones"],
            "telefono": row["telefono"],
            "total_dispositivos": row["total_dispositivos"],
            "activo": row["activo"],
            "usuario": None,
            "tipo": {
                "id_tipo_electrodomestico": row["id_tipo_electrodomestico"],
                "nombre": row["tipo_nombre"]
            },
            "estado": {
                "id_estado_dispositivo": row["id_estado_dispositivo"],
                "nombre": row["estado_nombre"]
            }
        }
        donaciones_list.append(donacion)

    return donaciones_list