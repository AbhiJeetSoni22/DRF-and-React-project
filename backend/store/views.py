
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.db import DatabaseError
from rest_framework.permissions import IsAuthenticated
from .models import Category, Product,CartItem,Cart,Order,OrderItem
from .serializers import ProductSerializer,CategorySerializer,RegisterSerializer,UserSerializer,CartSerializer,CartItemSerializer
import logging
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import AllowAny, IsAuthenticated
from django.template.context_processors import request
from django.contrib.auth import authenticate


logger = logging.getLogger(__name__)
# Create your views here.

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()

    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories,many=True)
    return Response(serializer.data)
    
@api_view(['GET'])
def get_product(request,pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request':request},many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    
def get_cart_object(request):
    """Helper function to get or create cart for both authenticated and anonymous users"""
    if request.user.is_authenticated:
        logger.info(f"Authenticated user: {request.user}")
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        # Ensure session exists for anonymous users
        if not request.session.session_key:
            request.session.create()
        logger.info(f"Anonymous user with session key: {request.session.session_key}")
        cart, created = Cart.objects.get_or_create(session_key=request.session.session_key)
    logger.info(f"Cart: {cart.id}, Items: {cart.items.count()}")
    return cart

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()

        cart, _ = Cart.objects.get_or_create(
            session_key=request.session.session_key
        )
    return cart



@api_view(["POST"])

def add_to_cart(request):
    print("ADD TO CART HIT")

    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))

    if not product_id:
        return Response({"error": "Product ID required"}, status=400)

    cart = get_or_create_cart(request)

    print("SESSION KEY:", request.session.session_key)
    print("CART ID:", cart.id)

    product = Product.objects.get(id=product_id)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({
        "items": CartItemSerializer(
            cart.items.all(),
            many=True,
            context={"request": request}
        ).data,
        "total": cart.total
    })




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = get_or_create_cart(request)   # 🔥 SAME CART ALWAYS
    print('cart get',cart)
    items = []
    total = 0

    for item in cart.items.all():
        total += item.subtotal

        items.append({
            "id": item.product.id,
            "name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "image": item.product.image.url if item.product.image else None,
        })

    return Response({
        "items": items,
        "total": total
    })



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_cart(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))

    cart = get_or_create_cart(request)

    item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
    if not item:
        return Response({"message": "Item not found"})

    if quantity <= 0:
        item.delete()
    else:
        item.quantity = quantity
        item.save()

    return Response({"message": "Cart updated"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get("product_id")

    cart = get_or_create_cart(request)
    CartItem.objects.filter(cart=cart, product_id=product_id).delete()

    return Response({"message": "Item removed"})


@api_view(["POST"])
def clear_cart(request):
    cart = get_or_create_cart(request)
    cart.items.all().delete()

    return Response({"message": "Cart cleared"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data

        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')
        if not phone.isdigit() or len(phone) < 10 or len(phone) > 15:
            return Response({"error": "Invalid phone number."}, status=400)
        # 🔥 IMPORTANT FIX
        cart = get_or_create_cart(request)

        print("CART ID:", cart.id)
        print("CART ITEMS COUNT:", cart.items.count())

        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total = sum(
            float(item.product.price) * item.quantity
            for item in cart.items.all()
        )

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            total_amount=total,
            name=name,
            address=address,
            phone=phone,
            payment_method=payment_method
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart.items.all().delete()

        return Response(
            {
                "message": "Order created successfully!",
                "order_id": order.id
            },
            status=201
        )

    except DatabaseError as e:
        logger.error(f"Database error during order creation: {e}")
        return Response(
            {"error": "Database error during order creation."},
            status=500
        )

    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return Response(
            {"error": str(e)},
            status=500
        )

    
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "message": "User created successfully",
            "user": UserSerializer(user).data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "message": "Login successful",
            "user": UserSerializer(user).data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        },
        status=status.HTTP_200_OK
    )

