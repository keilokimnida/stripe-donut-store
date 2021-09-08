# Stripe Donut

Pet project for the Sep/Oct 2021 holidays! Simple store that sells premium donuts, and offers exclusive products to users who have subscribed for a membership.

**Learning Objectives:**
1. Integrate React & NodeJS application with Stripe
    1. Learn how to use Stripe Payment Intent api
    2. Learn how to use Stripe Subscription and Invoicing apis
    3. Learn how to use Stripe Element to receive Card Payment
    4. Learn how to add Google pay & Apple Pay payment methods
2. Typescript with React
3. Sequelize
4. Skeleton Loading

# Project Set Up

## Stripe

Set up a an account on [Stripe](https://stripe.com/en-sg).

## Frontend

Create a new `.env` file and paste this inside:

```

    REACT_APP_BASEURL=http://localhost:8000/api/v1
    REACT_APP_BASEURL_STRIPE_PK_TEST=
```

## Backend

Run the SQL init file
Create a new `.env` file and paste this inside:

```

PORT=8000
DB_HOST=localhost
DB_NAME=stripe_donut_store
DB_PORT=3306
DB_USER=root
DB_PASSWORD=

JWT_SECRET=

STRIPE_TEST_SK=

```
