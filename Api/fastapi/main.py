from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import database

# Routers importados
from routes.auth import router as auth_router
from routes.usuarios import router as usuarios_router
from routes.donaciones import router as donaciones_router
from routes.dispositivos import router as dispositivos_router
from routes.reparaciones import router as reparaciones_router
from routes.instituciones import router as instituciones_router
from routes.donativos import router as donativos_router
from routes.historial import router as historial_router
from routes.catalogos import router as catalogos_router

app = FastAPI(
    title="EcoReboot API",
    description="API para gestionar donaciones, dispositivos, usuarios e instituciones del sistema EcoReboot.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes restringir esto a tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a la base de datos
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Ruta raíz
@app.get("/", tags=["Sistema"])
async def root():
    return {"message": "EcoReboot API funcionando correctamente", "status": "OK"}

# Incluir routers
app.include_router(auth_router)
app.include_router(usuarios_router)
app.include_router(donaciones_router)
app.include_router(dispositivos_router)
app.include_router(reparaciones_router)
app.include_router(instituciones_router)
app.include_router(donativos_router)
app.include_router(historial_router)
app.include_router(catalogos_router)

# Ejecutar con: uvicorn main:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)