import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppSettingsModule } from "src/app-settings/app-settings.module";
import { AuthModule } from "src/auth/auth.module";
import { CartItemsModule } from "src/cart-items/cart-items.module";
import { CartsModule } from "src/carts/carts.module";
import { CategoriesModule } from "src/categories/categories.module";
import { ContactRequestsModule } from "src/contact-requests/contact-requests.module";
import { OrdersModule } from "src/orders/orders.module";
import { PaymentsModule } from "src/payments/payments.module";
import { AttributeOptionsModule } from "src/products/attribute-options/attribute-options.module";
import { AttributesModule } from "src/products/attributes/attributes.module";
import { ProductsModule } from "src/products/products.module";
import { SkusModule } from "src/products/skus/skus.module";
import { ReviewsModule } from "src/reviews/reviews.module";
import { ShippingAddressesModule } from "src/shipping-addresses/shipping-addresses.module";
import { UsersModule } from "src/users/users.module";

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Goreto - A meat shop')
        .setDescription('Backend API documentation for Goreto.')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            }
        )
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        include: [
            AuthModule,
            UsersModule,
            ProductsModule,
            CategoriesModule,
            ShippingAddressesModule,
            CartsModule,
            CartItemsModule,
            ReviewsModule, OrdersModule,
            PaymentsModule,
            SkusModule,
            AttributesModule,
            AttributeOptionsModule,
            AppSettingsModule,
            ContactRequestsModule,
        ],
    });

    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Goreto - A meat shop',
        customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
        ],
    });
}