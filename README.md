# E-Commerce Store - Django REST Framework & React

A modern and complete e-commerce platform built with Django REST Framework (DRF) and React.

---

## 📋 Project Overview

This is a full-stack e-commerce application featuring:
- **Backend**: RESTful API built with Django REST Framework
- **Frontend**: Modern responsive UI built with React + Vite
- **Database**: PostgreSQL with Django ORM
- **Authentication**: JWT-based user authentication
- **Styling**: Tailwind CSS for responsive design

---

## 🎯 Features

### Backend Features:
- ✅ RESTful API endpoints
- ✅ JWT Authentication & Authorization
- ✅ Product Management
- ✅ Shopping Cart System
- ✅ Order Management
- ✅ User Profiles
- ✅ CORS Support
- ✅ Admin Dashboard

### Frontend Features:
- ✅ Product Listing & Search
- ✅ Product Details Page
- ✅ Shopping Cart Management
- ✅ Checkout Process
- ✅ User Authentication (Login/Register)
- ✅ Responsive Design
- ✅ Modern React Router Navigation

---

## 🗂️ Project Structure

```
DRF and React project/
├── backend/                 # Django Backend
│   ├── manage.py
│   ├── .env                # Environment variables
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── store/              # Main app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   ├── urls.py
│   │   └── migrations/
│   └── media/              # User uploaded files
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── context/        # Context API
    │   ├── utils/          # Helper functions
    │   └── assets/
    ├── .env
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## 🗄️ Database Models

| Model | Purpose |
|-------|---------|
| **Product** | Stores product information (name, price, description, image, category) |
| **Category** | Product categories with slug |
| **Cart** | User shopping carts with session support |
| **CartItem** | Individual items in cart with quantity |
| **Order** | Customer orders with payment and shipping details |
| **OrderItem** | Individual items in orders |
| **UserProfile** | Extended user information (phone, address) |

---


### Products
- `GET /api/products/` - Get all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create product (Admin only)
- `PUT /api/products/{id}/` - Update product (Admin only)
- `DELETE /api/products/{id}/` - Delete product (Admin only)

### Categories
- `GET /api/categories/` - Get all categories
- `GET /api/categories/{id}/` - Get category details

### Cart
- `GET /api/cart/` - Get user cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{id}/` - Update cart item quantity
- `DELETE /api/cart/remove/{id}/` - Remove item from cart

### Orders
- `GET /api/orders/` - Get user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details

### Authentication
- `POST /api/auth/register/` - Register new account
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `POST /api/auth/refresh/` - Refresh JWT token

### User Profile
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile
---

## 🔐 Authentication 


### JWT Tokens

```javascript
// Login
POST /api/auth/login/
{
  "username": "user@example.com",
  "password": "password123"
}

// Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

// Include in all API requests
```

---


### Backend
```bash
python manage.py runserver          # Start dev server
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py test               # Run tests
python manage.py createsuperuser    # Create admin user
```

### Frontend
```bash
npm run dev                          # Start dev server
npm run build                        # Build for production
npm run preview                      # Preview production build
npm run lint                         # Run ESLint
```

---

## 📦 Dependencies

### Backend
- Django 6.0.1
- Django REST Framework
- django-rest-framework-jwt
- django-cors-headers
- python-dotenv
- Pillow

### Frontend
- React 19.2.0
- React Router DOM 7.12.0
- Axios 1.13.2
- Tailwind CSS 4.1.18
- Vite 7.2.4e 7.2.4
```




### CORS Error
**Problem**: API requests failing from frontend  
**Solution**: Update `CORS_ALLOWED_ORIGINS` in backend settings:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### Migration Errors
**Problem**: Database migration issues  
**Solution**:
```bash
python manage.py migrate --fake-initial
python manage.py migrate
```

### Port Already in Use
**Solution**: Use different ports:
```bash
# Backend
python manage.py runserver 8001

# Frontend
npm run dev -- --port 5174
```


**Last Updated: January 2026**