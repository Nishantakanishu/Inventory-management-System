from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate
from decimal import Decimal

class OrderService:
    @staticmethod
    def create_order(db: Session, order_data: OrderCreate) -> Order:
        # Start a transaction block (explicitly, or rely on active session transaction)
        # Note: db.begin() can be used or we can use try/except/rollback
        try:
            # 1. Validate customer exists
            customer = db.query(Customer).filter(Customer.id == order_data.customer_id).first()
            if not customer:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Customer with ID {order_data.customer_id} not found"
                )

            # 2. Track total amount
            total_amount = Decimal("0.00")
            order_items_to_create = []

            # 3. Process items and validate stock/existence
            # To avoid duplicate product processing issues and race conditions,
            # we query products using select-for-update (pessimistic locking) to ensure correct stock updates
            product_ids = [item.product_id for item in order_data.items]
            
            # Fetch products with locking
            products = db.query(Product).filter(Product.id.in_(product_ids)).with_for_update().all()
            product_map = {p.id: p for p in products}

            for item in order_data.items:
                product = product_map.get(item.product_id)
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Product with ID {item.product_id} not found"
                    )

                # Validate stock availability
                if product.quantity_in_stock < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Insufficient stock for product '{product.name}' (SKU: {product.sku}). Requested: {item.quantity}, Available: {product.quantity_in_stock}"
                    )

                # Reduce inventory automatically
                product.quantity_in_stock -= item.quantity

                # Calculate item cost and update total
                item_price = product.price
                item_total = item_price * Decimal(str(item.quantity))
                total_amount += item_total

                # Create OrderItem object
                order_item = OrderItem(
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=item_price
                )
                order_items_to_create.append(order_item)

            # 4. Create the Order
            order = Order(
                customer_id=order_data.customer_id,
                total_amount=total_amount
            )
            db.add(order)
            db.flush() # Generate order ID

            # 5. Link items to order and save
            for order_item in order_items_to_create:
                order_item.order_id = order.id
                db.add(order_item)

            # Commit the transaction
            db.commit()
            
            # Refresh to load relations
            db.refresh(order)
            return order

        except HTTPException as he:
            db.rollback()
            raise he
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create order: {str(e)}"
            )

    @staticmethod
    def cancel_order(db: Session, order_id: int) -> bool:
        try:
            # Fetch order with locking
            order = db.query(Order).filter(Order.id == order_id).with_for_update().first()
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Order with ID {order_id} not found"
                )

            # Return quantities back to products (RESTORE STOCK)
            for item in order.items:
                product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
                if product:
                    product.quantity_in_stock += item.quantity

            db.delete(order)
            db.commit()
            return True
        except HTTPException as he:
            db.rollback()
            raise he
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete order: {str(e)}"
            )
