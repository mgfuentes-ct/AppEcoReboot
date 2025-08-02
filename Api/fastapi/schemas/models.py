# fastapi/schemas/models.py

from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional


# ---------- Usuario ----------
class Usuario(BaseModel):
    id_usuario: int
    nombre: str
    telefono: str
    correo: str
    rol: Optional[dict] = None

class UsuarioCreate(BaseModel):
    nombre: str
    telefono: str
    correo: str
    id_rol_usuario: int
    contraseña: str  # ✅ Añadido

class UsuarioUpdate(BaseModel):
    nombre: str
    telefono: str
    correo: str
    id_rol_usuario: int

# ---------- Donación ----------
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

class DonacionByUserCreate(BaseModel):
    id_tipo_electrodomestico: int
    id_estado_dispositivo: int
    fecha: datetime
    imperfecciones: Optional[str] = None
    telefono: Optional[str] = None
    total_dispositivos: int


# ---------- Dispositivo ----------
class Dispositivo(BaseModel):
    id_dispositivo: int
    id_donacion: int
    descripcion: Optional[str] = None
    modelo: Optional[str] = None
    nombre: Optional[str] = None

class DispositivoCreate(BaseModel):
    id_donacion: int
    descripcion: Optional[str] = None
    modelo: Optional[str] = None
    nombre: Optional[str] = None


# ---------- Reparación ----------
class Reparacion(BaseModel):
    id_reparacion: int
    fecha: date
    id_dispositivo: int
    descripcion: Optional[str] = None
    costo: Optional[float] = None
    id_detalles_reparacion: Optional[int] = None

class ReparacionCreate(BaseModel):
    fecha: date
    id_dispositivo: int
    descripcion: Optional[str] = None
    costo: Optional[float] = None
    id_detalles_reparacion: Optional[int] = None


# ---------- Institución ----------
class Institucion(BaseModel):
    id_institucion: int
    cantidad: Optional[int] = None
    telefono: Optional[str] = None
    nombre: str

class InstitucionCreate(BaseModel):
    cantidad: Optional[int] = None
    telefono: Optional[str] = None
    nombre: str


# ---------- Donativo ----------
class Donativo(BaseModel):
    id_donativo: int
    fecha: date
    id_institucion: int
    id_inventario: int

class DonativoCreate(BaseModel):
    fecha: date
    id_institucion: int
    id_inventario: int


# ---------- Reciclaje ----------
class Reciclaje(BaseModel):
    id_reciclaje: int
    fecha: date
    id_dispositivo: int
    descripcion: Optional[str] = None

class ReciclajeCreate(BaseModel):
    fecha: date
    id_dispositivo: int
    descripcion: Optional[str] = None


# ---------- Piezas nuevas ----------
class PiezaNueva(BaseModel):
    id_piezas_nuevas: int
    id_reparacion: Optional[int] = None
    id_reciclaje: Optional[int] = None
    precio: Optional[float] = None
    nombre: Optional[str] = None

class PiezaNuevaCreate(BaseModel):
    id_reparacion: Optional[int] = None
    id_reciclaje: Optional[int] = None
    precio: Optional[float] = None
    nombre: Optional[str] = None


# ---------- Historial de dispositivo ----------
class DispositivoHistorial(BaseModel):
    reparaciones: List[Reparacion]
    reciclajes: List[Reciclaje]


# ---------- Estadísticas ----------
class EstadisticaDonacion(BaseModel):
    tipo: str
    total: int

class EstadisticaEstado(BaseModel):
    estado: str
    total: int