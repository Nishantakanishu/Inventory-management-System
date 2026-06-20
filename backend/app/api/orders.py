from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.order import Order
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    return OrderService.create_order(db, order_in)

@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    # Order items relation is eagerly fetched or lazy-loaded; we can query and return
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    # Explicitly load product relationships inside order items to ensure they are available in serialization
    # Pydantic is configured to read nested attributes
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    return order

@router.delete("/{order_id}", status_code=status.HTTP_200_OK)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    # This also cancels order and restores product stocks
    OrderService.cancel_order(db, order_id)
    return {"detail": "Order cancelled and deleted successfully, and product stocks restored"}
