# fastapi/db/models.py

import sqlalchemy
from db.database import metadata

# Tablas
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