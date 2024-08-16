# ArtistSite

## [See the App!] https://artistsite.netlify.app/

## Description

Web dedicated to both show the portfolio works of an artist, and be able to sell the artworks in a store.

#### [Repository Link Client] https://github.com/Huanye98/ArtistShop-Client

#### [Repository Link Server] https://github.com/Huanye98/ArtistShop-Server

## Backlog Functionalities

- Email users with nodemailer
- Some sort of Shippment api like fedex api

## Technologies used

NodeJS, Javascript, Express, JsonWebtoken, bcrypt.

# Server Structure

## Models

Payment model

```javascript
{
  price: Number,
  paymentIntentId: String,
  clientSecret: String,
  status: {
    type: String,
    enum: ["incomplete", "succeeded"],
    default: "incomplete",
  },
  product: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}
```

Product model

```javascript
 {
  name: { type: String, required: [true, "name is required."] },
  price: { type: Number, required: [true, "price is required."], min: 0 },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  discountValue: { type: Number, default: 100, min: 0 },
  imageUrl: { type: String },
  category: {
    type: [String],
    enum: ["Print", "Apparel", "Home Goods"],
  },
}
```

User Model

```javascript
{
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    address: { type: String },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
```

## API Endpoints (backend routes)

| HTTP Method | URL                               | Request Body                                                                 | Success status | Error Status  | Description                                                         |
| ----------- | --------------------------------- | ---------------------------------------------------------------------------- | -------------- | ------------- | ------------------------------------------------------------------- |
| POST        | `/auth/signup`                    | `{email, username, password}`                                                | 201            | 400           | Registers the user in the Database                                  |
| POST        | `/auth/login`                     | `{email, password}`                                                          | 200            | 400           | Validates credentials, creates and sends Token                      |
| GET         | `/auth/verify`                    | `N/A`                                                                        | 200            | 401           | Verifies the user’s authentication token                            |
| POST        | `/payments/create-payment-intent` | `{amount, products, user}`                                                   | 200            | 400           | Creates a payment intent using Stripe and stores it in the database |
| PATCH       | `/payments/update-payment-intent` | `{clientSecret, paymentIntentId}`                                            | 200            | 400           | Updates the payment status to "succeeded"                           |
| GET         | `/payments/`                      | `N/A`                                                                        | 200            | 404           | Retrieves all payments with product details                         |
| GET         | `/products/all`                   | `N/A`                                                                        | 200            | 404           | Retrieves all products with basic details                           |
| GET         | `/products/all/images`            | `N/A`                                                                        | 200            | 404           | Retrieves all product images for the category "Print"               |
| GET         | `/products`                       | `{page, limit, category}` (Query Params)                                     | 200            | 404           | Retrieves products with pagination and optional category filter     |
| POST        | `/products`                       | `{name, price, imageUrl, description, category, isAvailable, discountValue}` | 201            | 400           | Creates a new product                                               |
| GET         | `/products/:productId`            | `N/A`                                                                        | 200            | 404           | Retrieves a specific product by its ID                              |
| PATCH       | `/products/:productId`            | `{name, price, imageUrl, description, category, isAvailable, discountValue}` | 200            | 404           | Updates a specific product by its ID                                |
| DELETE      | `/products/:productId`            | `N/A`                                                                        | 202            | 404           | Deletes a specific product by its ID                                |
| POST        | `/upload`                         | `{image}` (File Upload)                                                      | 200            | 400           | Uploads an image using Cloudinary                                   |
| GET         | `/user/own`                       | `N/A`                                                                        | 200            | 404           | Retrieves the authenticated user's profile                          |
| PATCH       | `/user/own/address`               | `{address}`                                                                  | 200            | 400, 404      | Updates the authenticated user's address                            |
| PATCH       | `/user/own`                       | `{item}`                                                                     | 200            | 400, 404      | Adds an item to the authenticated user's cart                       |
| PATCH       | `/user/own/delete`                | `{itemId}`                                                                   | 200            | 400, 404      | Removes an item from the authenticated user's cart                  |
| GET         | `/user/admin`                     | `N/A`                                                                        | 200            | 403           | Admin-only route for accessing protected resources                  |
| GET         | `/user/admin/users`               | `N/A`                                                                        | 200            | 403, 404      | Retrieves a list of users with their carts                          |
| POST        | `/user/admin/product`             | `{name, price, imageUrl, description, category, isAvailable, discountValue}` | 201            | 400, 403      | Creates a new product (Admin only)                                  |
| DELETE      | `/user/admin/product/:productId`  | `N/A`                                                                        | 200            | 403, 404      | Deletes a product by its ID (Admin only)                            |
| PATCH       | `/user/admin/product/:productId`  | `{name, price, imageUrl, description, category, isAvailable, discountValue}` | 200            | 400, 403, 404 | Updates a product by its ID (Admin only)                            |

## Links

### Collaborators

[Huanye zhu]
https://github.com/Huanye98?tab=repositories

### Project

[Repository Link Client] https://github.com/Huanye98/ArtistShop-Client

[Repository Link Server] https://github.com/Huanye98/ArtistShop-Server

[Deploy Link] https://artistsite.netlify.app/

### Slides

[Slides Link] https://docs.google.com/presentation/d/1suHZ9pEl2lT4CrzyaBAZhBQTpL4WBp1ORZT5FOaKNOM/edit?usp=sharing
