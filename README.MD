# Stripe Donut

Pet project for Sep/Oct 2021 holiday! Simple store that sells premium donuts, and offers exclusive products to users who have subscribed for a membership.

**Learning Objectives:**
1. Integrate React & NodeJS application with Stripe
    1. Learn how to use Stripe to receive Card Payment
    2. Learn how to use Stripe Subscription and Invoicing apis
    3. Learn how to save card during checkout for future payments
2. Typescript with React
3. Sequelize
4. Skeleton Loading

# Project Set Up

## Stripe

- Set up an account on [Stripe](https://stripe.com/en-sg)
- Your Stripe account will contain your **test** secret and public API keys which will be pasted in backend `.env` file later
- Monitor and test stripe transactions using the dashboard
- More info can be found in [Overview docs](https://stripe.com/docs) & [API docs](https://stripe.com/docs/api)

## Frontend

- Create a new `.env` file and paste this inside:

```

REACT_APP_BASEURL=http://localhost:8000/api/v1
REACT_APP_BASEURL_STRIPE_PK_TEST=
    
```

## Backend

- Run the SQL init file
- Create a new `.env` file and paste this inside:

```

PORT=
DB_HOST=localhost
DB_NAME=stripe_donut_store
DB_PORT=
DB_USER=root
DB_PASSWORD=

JWT_SECRET=

STRIPE_TEST_SK=

```
