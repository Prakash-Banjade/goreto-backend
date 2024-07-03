# `Product Entity`
The Product entity represents the products sold in your e-commerce store. Each product can have multiple SKUs (Stock Keeping Units) that define the specific variations of the product (e.g., different weights or packaging).

## Key fields and relationships:
name, slug, description: Basic details about the product.
Relationships to SubCategory, CutType, Preparation, Discount, CartItem, Review, OrderItem, and Sku.

# `Attribute Entity`
The Attribute entity represents different characteristics of a product that can have multiple options (e.g., color, size).

## Key fields and relationships:
1. `name`: Name of the attribute.
2. One-to-many relationship with `AttributeOption`.

# `AttributeOption Entity`
The AttributeOption entity represents the specific options available for an attribute (e.g., red, blue for the color attribute).

## Key fields and relationships:
1. `value`: The option value.
2. Many-to-one relationship with `Attribute`.
3. One-to-many relationship with `AttributeOptionSku`.

# `Sku Entity`
The Sku entity represents the specific variations of a product (e.g., 500g package, 1kg package).

## Key fields and relationships:
1. `code`: Unique code for the SKU.  
2. `price`: Price for the SKU.  
3. `images`: Array of image URLs.
4. Many-to-one relationship with `Product`.  
5. One-to-many relationship with `AttributeOptionSku`.  

# `AttributeOptionSku Entity`
The AttributeOptionSku entity is a join table that links SKUs to attribute options. This allows each SKU to be associated with multiple attribute options.

## Key fields and relationships:
1. Many-to-one relationship with `Sku`.
2. Many-to-one relationship with `AttributeOption`.