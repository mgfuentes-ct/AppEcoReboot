from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import databases
import sqlalchemy
from sqlalchemy import select, func
from datetime import datetime, date
import os

# Configuración de la base de datos con variables de entorno
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "ecoreboot")
DB_PORT = os.getenv("DB_PORT", "3306")

DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# Definición de todas las tablas
donaciones = sqlalchemy.Table(
    "donaciones",
    metadata,
    sqlalchemy.Column("id_donacion", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("id_usuario", sqlalchemy.Integer, sqlalchemy.ForeignKey("usuarios.id_usuario")),
    sqlalchemy.Column("id_tipo_electrodomestico", sqlalchemy.Integer, sqlalchemy.ForeignKey("tipo_electrodomestico.id_tipo_electrodomestico")),
    sqlalchemy.Column("id_estado_dispositivo", sqlalchemy.Integer, sqlalchemy.ForeignKey("estado_dispositivo.id_estado_dispositivo")),
    sqlalchemy.Column("fecha", sqlalchemy.DateTime),
    sqlalchemy.Column("imperfecciones", sqlalchemy.String(255)),
    sqlalchemy.Column("telefono", sqlalchemy.String(20)),
    sqlalchemy.Column("total_dispositivos", sqlalchemy.Integer),
    sqlalchemy.Column("activo", sqlalchemy.Boolean, default=True)
)

usuarios = sqlalchemy.Table(
    "usuarios",
    metadata,
    sqlalchemy.Column("id_usuario", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("nombre", sqlalchemy.String(100)),
    sqlalchemy.Column("telefono", sqlalchemy.String(20)),
    sqlalchemy.Column("correo", sqlalchemy.String(100)),
    sqlalchemy.Column("id_rol_usuario", sqlalchemy.Integer),
    sqlalchemy.Column("contraseña", sqlalchemy.String(255))
)

tipo_electrodomestico = sqlalchemy.Table(
    "tipo_electrodomestico",
    metadata,
    sqlalchemy.Column("id_tipo_electrodomestico", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

estado_dispositivo = sqlalchemy.Table(
    "estado_dispositivo",
    metadata,
    sqlalchemy.Column("id_estado_dispositivo", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

rol_usuarios = sqlalchemy.Table(
    "rol_usuarios",
    metadata,
    sqlalchemy.Column("id_rol_usuario", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

dispositivos = sqlalchemy.Table(
    "dispositivos",
    metadata,
    sqlalchemy.Column("id_dispositivo", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("id_donacion", sqlalchemy.Integer),
    sqlalchemy.Column("descripcion", sqlalchemy.String(255)),
    sqlalchemy.Column("modelo", sqlalchemy.String(100)),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

reparaciones = sqlalchemy.Table(
    "reparaciones",
    metadata,
    sqlalchemy.Column("id_reparacion", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("fecha", sqlalchemy.Date),
    sqlalchemy.Column("id_dispositivo", sqlalchemy.Integer),
    sqlalchemy.Column("descripcion", sqlalchemy.String(255)),
    sqlalchemy.Column("costo", sqlalchemy.DECIMAL(10, 2)),
    sqlalchemy.Column("id_detalles_reparacion", sqlalchemy.Integer)
)

detalles_reparacion = sqlalchemy.Table(
    "detalles_reparacion",
    metadata,
    sqlalchemy.Column("id_detalles_reparacion", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("descripcion", sqlalchemy.String(255)),
    sqlalchemy.Column("id_piezas_nuevas", sqlalchemy.Integer)
)

instituciones = sqlalchemy.Table(
    "instituciones",
    metadata,
    sqlalchemy.Column("id_institucion", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("cantidad", sqlalchemy.Integer),
    sqlalchemy.Column("telefono", sqlalchemy.String(20)),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

inventario = sqlalchemy.Table(
    "inventario",
    metadata,
    sqlalchemy.Column("id_inventario", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("id_reparacion", sqlalchemy.Integer)
)

donativos = sqlalchemy.Table(
    "donativos",
    metadata,
    sqlalchemy.Column("id_donativo", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("fecha", sqlalchemy.Date),
    sqlalchemy.Column("id_institucion", sqlalchemy.Integer),
    sqlalchemy.Column("id_inventario", sqlalchemy.Integer)
)

reciclajes = sqlalchemy.Table(
    "reciclajes",
    metadata,
    sqlalchemy.Column("id_reciclaje", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("fecha", sqlalchemy.Date),
    sqlalchemy.Column("id_dispositivo", sqlalchemy.Integer),
    sqlalchemy.Column("descripcion", sqlalchemy.String(255))
)

piezas_nuevas = sqlalchemy.Table(
    "piezas_nuevas",
    metadata,
    sqlalchemy.Column("id_piezas_nuevas", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("id_reparacion", sqlalchemy.Integer),
    sqlalchemy.Column("id_reciclaje", sqlalchemy.Integer),
    sqlalchemy.Column("precio", sqlalchemy.DECIMAL(10, 2)),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

mat_reciclados = sqlalchemy.Table(
    "mat_reciclados",
    metadata,
    sqlalchemy.Column("id_mat_reciclados", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("id_reciclaje", sqlalchemy.Integer),
    sqlalchemy.Column("nombre", sqlalchemy.String(100))
)

# Modelos Pydantic
class Usuario(BaseModel):
    id_usuario: int
    nombre: str
    telefono: str
    correo: str
    rol: Optional[dict] = None

class TipoElectrodomestico(BaseModel):
    id_tipo_electrodomestico: int
    nombre: str

class EstadoDispositivo(BaseModel):
    id_estado_dispositivo: int
    nombre: str

class Donacion(BaseModel):
    id_donacion: int
    id_usuario: int
    id_tipo_electrodomestico: int
    id_estado_dispositivo: int
    fecha: datetime
    imperfecciones: Optional[str] = None
    telefono: Optional[str] = None
    total_dispositivos: int
    activo: Optional[bool] = True
    usuario: Optional[Usuario] = None
    tipo: Optional[TipoElectrodomestico] = None
    estado: Optional[EstadoDispositivo] = None

class DonacionUpdate(BaseModel):
    id_tipo_electrodomestico: int
    id_estado_dispositivo: int
    fecha: datetime
    imperfecciones: Optional[str] = None
    telefono: Optional[str] = None
    total_dispositivos: int

class UsuarioCreate(BaseModel):
    nombre: str
    telefono: str
    correo: str
    id_rol_usuario: int

class DonacionByUserCreate(BaseModel):
    id_tipo_electrodomestico: int
    id_estado_dispositivo: int
    fecha: datetime
    imperfecciones: Optional[str] = None
    telefono: Optional[str] = None
    total_dispositivos: int

class Dispositivo(BaseModel):
    id_dispositivo: int
    id_donacion: int
    descripcion: Optional[str] = None
    modelo: Optional[str] = None
    nombre: Optional[str] = None

class Reparacion(BaseModel):
    id_reparacion: int
    fecha: date
    id_dispositivo: int
    descripcion: Optional[str] = None
    costo: Optional[float] = None
    id_detalles_reparacion: Optional[int] = None

class Institucion(BaseModel):
    id_institucion: int
    cantidad: Optional[int] = None
    telefono: Optional[str] = None
    nombre: str

class Donativo(BaseModel):
    id_donativo: int
    fecha: date
    id_institucion: int
    id_inventario: int

class Reciclaje(BaseModel):
    id_reciclaje: int
    fecha: date
    id_dispositivo: int
    descripcion: Optional[str] = None

class PiezaNueva(BaseModel):
    id_piezas_nuevas: int
    id_reparacion: Optional[int] = None
    id_reciclaje: Optional[int] = None
    precio: Optional[float] = None
    nombre: Optional[str] = None

class EstadisticaDonacion(BaseModel):
    tipo: str
    total: int

class EstadisticaEstado(BaseModel):
    estado: str
    total: int

class DispositivoHistorial(BaseModel):
    reparaciones: List[Reparacion]
    reciclajes: List[Reciclaje]

# Configuración de FastAPI
app = FastAPI(
    title="EcoReboot API",
    description="API completa para gestionar el sistema EcoReboot",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Eventos de conexión a la base de datos
@app.on_event("startup")
async def startup():
    try:
        await database.connect()
        print(f"✅ Conectado a la base de datos: {DATABASE_URL}")
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
    print("🔌 Desconectado de la base de datos")

# ---------------------------
# ENDPOINTS PRINCIPALES
# ---------------------------

@app.get("/", tags=["Sistema"])
async def root():
    return {"message": "EcoReboot API funcionando correctamente", "status": "OK"}

# ---------------------------
# ENDPOINTS PARA USUARIOS
# ---------------------------

@app.get("/usuarios/", response_model=List[Usuario], tags=["Usuarios"])
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

@app.get("/usuarios/{usuario_id}", response_model=Usuario, tags=["Usuarios"])
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

@app.post("/usuarios/", response_model=Usuario, tags=["Usuarios"])
async def crear_usuario(usuario: UsuarioCreate):
    query = usuarios.insert().values(
        nombre=usuario.nombre,
        telefono=usuario.telefono,
        correo=usuario.correo,
        id_rol_usuario=usuario.id_rol_usuario
    )
    usuario_id = await database.execute(query)
    return await obtener_usuario(usuario_id)

@app.put("/usuarios/{usuario_id}", response_model=Usuario, tags=["Usuarios"])
async def editar_usuario(usuario_id: int, usuario: UsuarioCreate):
    query = usuarios.update().where(usuarios.c.id_usuario == usuario_id).values(
        nombre=usuario.nombre,
        telefono=usuario.telefono,
        correo=usuario.correo,
        id_rol_usuario=usuario.id_rol_usuario
    )
    await database.execute(query)
    return await obtener_usuario(usuario_id)

@app.delete("/usuarios/{usuario_id}", tags=["Usuarios"])
async def eliminar_usuario(usuario_id: int):
    query = usuarios.delete().where(usuarios.c.id_usuario == usuario_id)
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "¡Usuario eliminado con éxito!"}

# ---------------------------
# ENDPOINTS PARA DONACIONES
# ---------------------------

@app.get("/donaciones/", response_model=List[Donacion], tags=["Donaciones"])
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

@app.get("/donaciones/{donation_id}", response_model=Donacion, tags=["Donaciones"])
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
    return donacion

@app.put("/donaciones/{donation_id}", response_model=Donacion, tags=["Donaciones"])
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

@app.delete("/donaciones/{donation_id}", tags=["Donaciones"])
async def eliminar_donacion(donation_id: int):
    # Eliminación lógica
    update_query = donaciones.update().where(donaciones.c.id_donacion == donation_id).values(activo=False)
    result = await database.execute(update_query)
    if not result:
        raise HTTPException(status_code=404, detail="Donación no encontrada")
    return {"message": "¡Donación desactivada con éxito!"}

@app.post("/usuarios/{usuario_id}/donaciones", response_model=Donacion, tags=["Donaciones"])
async def crear_donacion_por_usuario(usuario_id: int, datos: DonacionByUserCreate):
    insert_query = donaciones.insert().values(
        id_usuario=usuario_id,
        id_tipo_electrodomestico=datos.id_tipo_electrodomestico,
        id_estado_dispositivo=datos.id_estado_dispositivo,
        fecha=datos.fecha,
        imperfecciones=datos.imperfecciones,
        telefono=datos.telefono,
        total_dispositivos=datos.total_dispositivos
    )
    new_id = await database.execute(insert_query)
    return await obtener_donacion(new_id)

# ---------------------------
# ENDPOINTS PARA DISPOSITIVOS
# ---------------------------

@app.get("/dispositivos/", response_model=List[Dispositivo], tags=["Dispositivos"])
async def listar_dispositivos():
    query = dispositivos.select()
    return await database.fetch_all(query)

@app.get("/dispositivos/{dispositivo_id}", response_model=Dispositivo, tags=["Dispositivos"])
async def obtener_dispositivo(dispositivo_id: int):
    query = dispositivos.select().where(dispositivos.c.id_dispositivo == dispositivo_id)
    dispositivo = await database.fetch_one(query)
    if not dispositivo:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return dispositivo

@app.post("/dispositivos/", response_model=Dispositivo, tags=["Dispositivos"])
async def crear_dispositivo(dispositivo: Dispositivo):
    query = dispositivos.insert().values(**dispositivo.dict())
    dispositivo_id = await database.execute(query)
    return {**dispositivo.dict(), "id_dispositivo": dispositivo_id}

@app.put("/dispositivos/{dispositivo_id}", response_model=Dispositivo, tags=["Dispositivos"])
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

@app.delete("/dispositivos/{dispositivo_id}", tags=["Dispositivos"])
async def eliminar_dispositivo(dispositivo_id: int):
    query = dispositivos.delete().where(dispositivos.c.id_dispositivo == dispositivo_id)
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return {"message": "¡Dispositivo eliminado con éxito!"}

@app.get("/donaciones/{donacion_id}/dispositivos", response_model=List[Dispositivo], tags=["Donaciones"])
async def dispositivos_por_donacion(donacion_id: int):
    query = dispositivos.select().where(dispositivos.c.id_donacion == donacion_id)
    return await database.fetch_all(query)

# ---------------------------
# ENDPOINTS PARA REPARACIONES
# ---------------------------

@app.get("/reparaciones/", response_model=List[Reparacion], tags=["Reparaciones"])
async def listar_reparaciones():
    query = reparaciones.select()
    return await database.fetch_all(query)

@app.get("/reparaciones/{reparacion_id}", response_model=Reparacion, tags=["Reparaciones"])
async def obtener_reparacion(reparacion_id: int):
    query = reparaciones.select().where(reparaciones.c.id_reparacion == reparacion_id)
    reparacion = await database.fetch_one(query)
    if not reparacion:
        raise HTTPException(status_code=404, detail="Reparación no encontrada")
    return reparacion

@app.post("/reparaciones/", response_model=Reparacion, tags=["Reparaciones"])
async def crear_reparacion(reparacion: Reparacion):
    query = reparaciones.insert().values(**reparacion.dict())
    reparacion_id = await database.execute(query)
    return {**reparacion.dict(), "id_reparacion": reparacion_id}

# ---------------------------
# ENDPOINTS PARA INSTITUCIONES
# ---------------------------

@app.get("/instituciones/", response_model=List[Institucion], tags=["Instituciones"])
async def listar_instituciones():
    query = instituciones.select()
    return await database.fetch_all(query)

@app.get("/instituciones/{institucion_id}", response_model=Institucion, tags=["Instituciones"])
async def obtener_institucion(institucion_id: int):
    query = instituciones.select().where(instituciones.c.id_institucion == institucion_id)
    institucion = await database.fetch_one(query)
    if not institucion:
        raise HTTPException(status_code=404, detail="Institución no encontrada")
    return institucion

@app.post("/instituciones/", response_model=Institucion, tags=["Instituciones"])
async def crear_institucion(institucion: Institucion):
    query = instituciones.insert().values(**institucion.dict())
    institucion_id = await database.execute(query)
    return {**institucion.dict(), "id_institucion": institucion_id}

# ---------------------------
# ENDPOINTS PARA DONATIVOS
# ---------------------------

@app.get("/donativos/", response_model=List[Donativo], tags=["Donativos"])
async def listar_donativos():
    query = donativos.select()
    return await database.fetch_all(query)

@app.get("/donativos/{donativo_id}", response_model=Donativo, tags=["Donativos"])
async def obtener_donativo(donativo_id: int):
    query = donativos.select().where(donativos.c.id_donativo == donativo_id)
    donativo = await database.fetch_one(query)
    if not donativo:
        raise HTTPException(status_code=404, detail="Donativo no encontrado")
    return donativo

@app.post("/donativos/", response_model=Donativo, tags=["Donativos"])
async def crear_donativo(donativo: Donativo):
    query = donativos.insert().values(**donativo.dict())
    donativo_id = await database.execute(query)
    return {**donativo.dict(), "id_donativo": donativo_id}



# ---------------------------
# ENDPOINTS PARA HISTORIAL
# ---------------------------

@app.get("/dispositivos/{dispositivo_id}/historial", response_model=DispositivoHistorial, tags=["Dispositivos"])
async def historial_dispositivo(dispositivo_id: int):
    # Obtener reparaciones
    query_reparaciones = reparaciones.select().where(reparaciones.c.id_dispositivo == dispositivo_id)
    reparaciones_list = await database.fetch_all(query_reparaciones)
    
    # Obtener reciclajes
    query_reciclajes = reciclajes.select().where(reciclajes.c.id_dispositivo == dispositivo_id)
    reciclajes_list = await database.fetch_all(query_reciclajes)
    
    return {
        "reparaciones": reparaciones_list,
        "reciclajes": reciclajes_list
    }

# ---------------------------
# ENDPOINTS PARA TIPOS Y ESTADOS
# ---------------------------

@app.get("/tipos-electrodomesticos/", response_model=List[TipoElectrodomestico], tags=["Catálogos"])
async def listar_tipos_electrodomesticos():
    query = tipo_electrodomestico.select()
    return await database.fetch_all(query)

@app.get("/estados-dispositivo/", response_model=List[EstadoDispositivo], tags=["Catálogos"])
async def listar_estados_dispositivo():
    query = estado_dispositivo.select()
    return await database.fetch_all(query)

@app.get("/roles-usuarios/", response_model=List[dict], tags=["Catálogos"])
async def listar_roles_usuarios():
    query = rol_usuarios.select()
    roles = await database.fetch_all(query)
    return [{"id_rol_usuario": r["id_rol_usuario"], "nombre": r["nombre"]} for r in roles]

# Ejecutar con: uvicorn main:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)








# ---------------------------
# ENDPOINT DE LOGIN
# ---------------------------
class LoginData(BaseModel):
    correo: str
    password: str

@app.post("/login", tags=["Autenticación"])
async def login(data: LoginData):
    query = select(
        usuarios.c.id_usuario,
        usuarios.c.nombre,
        usuarios.c.correo,
        usuarios.c.telefono,
        usuarios.c.id_rol_usuario,
        usuarios.c.contraseña,  # ✅ Añadido
        rol_usuarios.c.nombre.label("rol_nombre")
    ).select_from(
        usuarios.join(rol_usuarios, usuarios.c.id_rol_usuario == rol_usuarios.c.id_rol_usuario)
    ).where(usuarios.c.correo == data.correo)

    user = await database.fetch_one(query)

    if not user:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    # ✅ Validar contraseña directamente (temporal, sin hash)
    if data.password == user["contraseña"]:
        return {
            "id_usuario": user["id_usuario"],
            "nombre": user["nombre"],
            "rol": {"nombre": user["rol_nombre"]}
        }

    raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")








@app.get("/usuarios/{usuario_id}/donaciones", response_model=List[Donacion], tags=["Donaciones"])
async def listar_donaciones_usuario(usuario_id: int):
    query = select(
        donaciones.c.id_donacion,
        donaciones.c.id_usuario,  # ✅ Añadido
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
            "id_usuario": row["id_usuario"],  # ✅ Ahora existe
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