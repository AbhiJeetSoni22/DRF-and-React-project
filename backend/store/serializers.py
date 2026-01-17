from django.forms import CharField
from rest_framework.fields import ReadOnlyField
from rest_framework import serializers
from .models import Category, Product,Cart,CartItem
from django.contrib.auth.models import User
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            image_url = obj.image.url
            if request:
                return request.build_absolute_uri(image_url)
            return image_url
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'product_name', 'product_price', 'product_image', 'subtotal']
    
    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            image_url = obj.product.image.url
            if request:
                return request.build_absolute_uri(image_url)
            return image_url
        return None
    
    def get_subtotal(self, obj):
        return obj.subtotal

class CartSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    total = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = '__all__'
    
    def get_items(self, obj):
        request = self.context.get('request')
        items = obj.items.all()
        serializer = CartItemSerializer(items, many=True, context={'request': request})
        return serializer.data
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = [ 'username', 'email', 'password','password2']
       
    def validate(self,data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user