from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas, auth, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Routes
@app.post("/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db=db, user=user)
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Product Routes
@app.get("/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

# Order Routes
@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    # Verify user
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = crud.get_user_by_email(db, email=email)
    if not user:
         raise HTTPException(status_code=401, detail="User not found")

    return crud.create_order(db=db, order=order, user_id=user.id)

# Payment Route
@app.post("/payments", status_code=200)
def process_payment(payment: schemas.PaymentCreate):
    # Mock payment processing
    return {"status": "coming_soon", "message": "Payment gateway integration coming soon", "data": payment}

# Seed Data Endpoint (For development convenience)
@app.post("/seed_products")
def seed_products(db: Session = Depends(get_db)):
    existing = crud.get_products(db, limit=1)
    if existing:
        return {"message": "Data already seeded"}
    
    mock_products = [
      {
        "name": 'Audífonos Premium',
        "price": 299.99,
        "image": 'https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc2MzM4ODUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Audífonos inalámbricos con cancelación de ruido',
        "category": 'Audio'
      },
      {
        "name": 'Smart Watch Pro',
        "price": 449.99,
        "image": 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNofGVufDF8fHx8MTc2MzM0MDQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Reloj inteligente con monitor de salud',
        "category": 'Wearables'
      },
      {
        "name": 'Laptop Ultra',
        "price": 1299.99,
        "image": 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjMzMzg4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Laptop de alto rendimiento',
        "category": 'Computadoras'
      },
      {
        "name": 'Auriculares Wireless',
        "price": 199.99,
        "image": 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYzMzA1ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Auriculares inalámbricos compactos',
        "category": 'Audio'
      },
      {
        "name": 'Smartphone Pro',
        "price": 899.99,
        "image": 'https://images.unsplash.com/photo-1543525469-65b61cc2bc06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGNhbWVyYXxlbnwxfHx8fDE3NjMzMDkyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Teléfono con cámara profesional',
        "category": 'Smartphones'
      },
      {
        "name": 'Tablet Max',
        "price": 699.99,
        "image": 'https://images.unsplash.com/photo-1714071803623-9594e3b77862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzYzMjk3NDA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Tablet de alta resolución',
        "category": 'Tablets'
      },
      {
        "name": 'Teclado Gaming RGB',
        "price": 149.99,
        "image": 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjMzMTU4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Teclado mecánico para gaming',
        "category": 'Accesorios'
      },
      {
        "name": 'Mouse Inalámbrico',
        "price": 79.99,
        "image": 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2MzM5NjA0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        "description": 'Mouse ergonómico inalámbrico',
        "category": 'Accesorios'
      }
    ]

    for p in mock_products:
        crud.create_product(db, schemas.ProductCreate(**p))
    
    return {"message": "Data seeded successfully"}
