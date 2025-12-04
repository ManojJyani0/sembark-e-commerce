# E‑Commerce Assignment — README

## 📌 Overview

This project is a basic e‑commerce web application where users can browse products, view detailed product information, and manage a shopping cart. The application focuses on **routing, state management, and API‑based data fetching**, using **React Router**, **TypeScript**, **Context API**, and **Fakestore API**.

The goal is to deliver production‑grade route configuration and a scalable folder structure suitable for expansion.

---

## 🚀 Features Implemented

### 1. **Home Page (Product Listing)**

* Displays a **grid of products** with: name, price, and thumbnail.
* Each product links to its **Product Detail Page**.
* Routing is designed to allow future support for filters and sorting.
* (UI part may be implemented separately as required.)

### 2. **Product Detail Page**

* Uses **dynamic routing** with the path:
  `/product/:id`
* Fetches product data dynamically based on the **ID**.
* Shows product details including:

  * Title
  * Description
  * Price
  * Thumbnail / Images
  * "Add to Cart" button
* I have added **extra product fields** to enhance the detail page UI such as:

  * Ratings
  * Stock
  * Brand
  * Additional images (mock‑extended)

### 3. **Cart Functionality**

* Add items to cart from the Product Detail Page.
* Remove items from the cart.
* Display cart total and total item count.
* Cart state is managed globally via **Context API**.
* (Bonus) Cart is persisted using **localStorage**.

### 4. **Navigation**

* Implemented via **React Router**.
* Users can navigate between:

  * Home Page
  * Product Detail Page
  * Cart Page
* Back navigation to Home Page is included.

### 5. **Technical Stack**

* **React JS** (component-based architecture)
* **TypeScript** for strong typing
* **React Router** for routing
* **Context API** for state management
* **Fakestore API** for product data only there is no category data at all
* Fully responsive layout

---

## ⚠️ API Limitations (Fakestore API)

The provided Fakestore API does **not support many required features**. Below are the major limitations:

### ❌ Category Filtering (API Limitation)

* API does not support multi-category filtering.
* It provides only `/products` and `/products?category`=cagegory_name endpoints, which cannot handle multiple categories at once.

### ❌ Search Not Supported

* No endpoint supports **search queries**.

### ❌ Sorting Not Supported

* No API support for sorting products:

  * Ascending price
  * Descending price
  * Alphabetical
  * Rating sorting

### ❌ Pagination Not Supported

* Fakestore API returns all products at once.

### ❌ Cannot Apply Filters Persistently

* Because filters aren’t supported, filter-based deep linking cannot be API-driven.

Due to this:

* Filter and sorting logic must be handled **client-side only**, but the assignment explicitly required **server-side (API-based) filtering**, which is not possible.
* This limitation is documented clearly to avoid confusion.

## ⚠️ Time  Limitations (e2e Testing)

Due to some time and infra issue i am not able to complete the e2e testing 

---

## 📁 Project Structure (Routing-Focused)

```
app/
 ├── routes/
 │    ├── AppRoutes.tsx
 │    ├── Home.tsx
 │    ├── ProductDetail.tsx
 │    └── Cart.tsx
 │    └── Checout.tsx
 │
 ├── context/
 │    └── Cart.tsx
 │
 ├── services/
 │    └── api.ts
 │    └── product.ts
 │
 ├── components/
 │    └── ProductCard.tsx
 │    └── etc.....tsx
 │
 ├── layout/
 │    └── index.ts
 │
 ├── types/
 │    └── product.ts
 │
 └── root.tsx
 └── routes.ts
```

---

## 📦 Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/ManojJyani0/sembark-e-commerce
cd sembark-e-commerce
```

### 2. Install dependencies

```
npm install
```

### 3. Run the development server

```
npm run dev
```

### 4. Build for production

```
npm run build
```

### 5. Preview production build

```
npm run preview
```

---

## 📝 Assumptions & Notes

* Due to limitations of Fakestore API, full filter/sort requirements could not be API‑driven.
* I added extra mock fields in product objects to improve the UI for Product Detail Page.
* All routing is **production‑ready**, clean, and scalable.
* UI implementation can be extended later as part of a separate task.
* due to some some time limit 
* **Note on Test Coverage**  Due to time constraints balancing this project with current professional commitments, comprehensive test suites were not implemented at this stage.

  ## Current State

  - ✅ Core functionality is fully implemented and operational

  - 🔄 Manual verification completed for main use cases

  - ⏳ Automated tests are planned for future iterations

  **Next Steps** (If project proceeds):

  1. Unit tests for individual components

  2. Integration tests for API interactions  

  3. E2E tests for complete user workflows

  4. Performance and load testing

  **Immediate Validation**: The application can be tested manually using the provided examples in the documentation.

```
```

---

## 📚 Future Enhancements (Recommended)

* Replace Fakestore API with a backend that supports:

  * search
  * sorting
  * category filtering (multiple)
  * pagination
* Add animations for cart add/remove actions.
* Improve accessibility using semantic HTML.

---

## ✔ Submission Ready

This README contains:

* Clear project setup
* Routing explanation
* API limitations
* Added enhancements
* Assumptions

Ready for evaluation.
