import urllib.request
import json
import time

API_BASE_URL = "http://localhost:8000/api"

PRODUCTS = [
    {"name": "MacBook Pro M3", "sku": "LAP-MBP-01", "price": 1999.99, "quantity_in_stock": 50},
    {"name": "Dell XPS 15", "sku": "LAP-DXPS-15", "price": 1799.50, "quantity_in_stock": 30},
    {"name": "Keychron Q1 Pro", "sku": "KBD-KEY-Q1", "price": 199.00, "quantity_in_stock": 100},
    {"name": "Logitech MX Master 3S", "sku": "MOU-LOG-MX3S", "price": 99.99, "quantity_in_stock": 150},
    {"name": "LG UltraFine 4K", "sku": "MON-LG-4K", "price": 699.99, "quantity_in_stock": 25}
]

CUSTOMERS = [
    {"full_name": "Alice Smith", "email": "alice@example.com", "phone": "555-0100"},
    {"full_name": "Bob Johnson", "email": "bob@example.com", "phone": "555-0200"},
    {"full_name": "Charlie Brown", "email": "charlie@example.com", "phone": "555-0300"}
]

def seed_data(endpoint, data_list):
    url = f"{API_BASE_URL}/{endpoint}"
    for item in data_list:
        req = urllib.request.Request(url, data=json.dumps(item).encode('utf-8'))
        req.add_header('Content-Type', 'application/json')
        try:
            with urllib.request.urlopen(req) as response:
                print(f"Successfully added to {endpoint}: {item.get('name', item.get('email'))}")
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8')
            print(f"Failed to add to {endpoint} - {item.get('name', item.get('email'))}: {e.code} {err_msg}")
        except Exception as e:
             print(f"Error connecting: {e}")

if __name__ == "__main__":
    print("Waiting for backend to start...")
    max_retries = 30
    for i in range(max_retries):
        try:
            urllib.request.urlopen(f"{API_BASE_URL}/products", timeout=2)
            print("Backend is up!")
            break
        except:
            time.sleep(2)
    else:
        print("Backend didn't start in time.")
        exit(1)
        
    print("Seeding Products...")
    seed_data("products", PRODUCTS)
    
    print("Seeding Customers...")
    seed_data("customers", CUSTOMERS)
    
    print("Seeding complete!")
