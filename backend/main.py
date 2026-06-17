from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base

from jose import jwt, JWTError
from datetime import datetime, timedelta

# =========================================================
# CONFIG JWT
# =========================================================
SECRET_KEY = "secreto_super_seguro_tp7_final"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# =========================================================
# APP
# =========================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# DB
# =========================================================
DATABASE_URL = "sqlite:///./participantes.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# =========================================================
# TABLAS
# =========================================================
class ParticipanteDB(Base):
    __tablename__ = "participantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String)
    edad = Column(Integer)
    pais = Column(String)
    modalidad = Column(String)
    tecnologias = Column(String)
    nivel = Column(String)
    aceptaTerminos = Column(Boolean)


class UsuarioDB(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    rol = Column(String)

Base.metadata.create_all(bind=engine)

# =========================================================
# USERS DEMO
# =========================================================
db = SessionLocal()

if not db.query(UsuarioDB).first():
    db.add_all([
        UsuarioDB(username="admin", password="123", rol="ADMIN"),
        UsuarioDB(username="user", password="123", rol="CONSULTA"),
    ])
    db.commit()

# =========================================================
# MODELOS
# =========================================================
class Participante(BaseModel):
    id: int
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: list[str]
    nivel: str
    aceptaTerminos: bool


class LoginData(BaseModel):
    username: str
    password: str

# =========================================================
# JWT HELPERS
# =========================================================
def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# =========================================================
# AUTH HEADER
# =========================================================
def get_user_from_token(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")

    token = authorization.split(" ")[1]
    return decode_token(token)

# =========================================================
# ROLE CHECK
# =========================================================
def require_admin(user):
    if user.get("rol") != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN permitido")

# =========================================================
# LOGIN
# =========================================================
@app.post("/login")
def login(data: LoginData):

    user = db.query(UsuarioDB).filter(
        UsuarioDB.username == data.username
    ).first()

    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_token({
        "sub": user.username,
        "rol": user.rol
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "rol": user.rol
        }
    }

# =========================================================
# GET (ADMIN + CONSULTA)
# =========================================================
@app.get("/participantes")
def get_participantes(user=Depends(get_user_from_token)):

    data = db.query(ParticipanteDB).all()

    return [
        {
            "id": p.id,
            "nombre": p.nombre,
            "email": p.email,
            "edad": p.edad,
            "pais": p.pais,
            "modalidad": p.modalidad,
            "tecnologias": p.tecnologias.split(",") if p.tecnologias else [],
            "nivel": p.nivel,
            "aceptaTerminos": p.aceptaTerminos
        }
        for p in data
    ]

# =========================================================
# CREATE (SOLO ADMIN)
# =========================================================
@app.post("/participantes")
def create(p: Participante, user=Depends(get_user_from_token)):

    require_admin(user)

    nuevo = ParticipanteDB(
        id=p.id,
        nombre=p.nombre,
        email=p.email,
        edad=p.edad,
        pais=p.pais,
        modalidad=p.modalidad,
        tecnologias=",".join(p.tecnologias),
        nivel=p.nivel,
        aceptaTerminos=p.aceptaTerminos
    )

    db.add(nuevo)
    db.commit()

    return p

# =========================================================
# DELETE (SOLO ADMIN)
# =========================================================
@app.delete("/participantes/{id}")
def delete(id: int, user=Depends(get_user_from_token)):

    require_admin(user)

    p = db.query(ParticipanteDB).filter(ParticipanteDB.id == id).first()

    if not p:
        raise HTTPException(status_code=404, detail="No encontrado")

    db.delete(p)
    db.commit()

    return {"ok": True}

# =========================================================
# UPDATE (SOLO ADMIN)
# =========================================================
@app.put("/participantes/{id}")
def update(id: int, p: Participante, user=Depends(get_user_from_token)):

    require_admin(user)

    participante = db.query(ParticipanteDB).filter(
        ParticipanteDB.id == id
    ).first()

    if not participante:
        raise HTTPException(status_code=404, detail="No encontrado")

    participante.nombre = p.nombre
    participante.email = p.email
    participante.edad = p.edad
    participante.pais = p.pais
    participante.modalidad = p.modalidad
    participante.tecnologias = ",".join(p.tecnologias)
    participante.nivel = p.nivel
    participante.aceptaTerminos = p.aceptaTerminos

    db.commit()

    return p

