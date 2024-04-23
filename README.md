# Payment Gateway

Made with Razorpay integration and ReactJS as frontend

## Table of Contents

- [Installation](#installation)
- [Defining env variables](#defining-environment-variables)
- [Run dev environment](#run-dev-environment)

## Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:Samya-S/paymentGateway.git
    ```
    `Make sure you have SSH keys setup in your machine`

2. Navigate to the project directory:

    ```bash
    cd paymentGateway
    ```

3. Install dependencies:

   In the frontend directory
   ```bash
   cd frontend
   npm i
   ```
   
   In the backend directory
   ```bash
   cd backend
   npm i
   ```
   `Make sure to have nodejs and npm installed`

## Defining environment variables

1. In the frontend directory:

    ```bash
    REACT_APP_RZPAY_KEY_ID = '<your razorpay api key id>'
    REACT_APP_BACKEND_HOSTING_DOMAIN = '<your backend hosting domain>'
    ```
1. In the backend directory:

    ```bash
    RZPAY_KEY_ID = '<your razorpay api key id>'
    RZPAY_KEY_SECRET = '<your razorpay api key secret>'
    ```

## Run dev environment

### To run the frontend: 

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```
    
2. Use the following command to run:

    ```bash
    npm start
    ```

### To run the backend: 

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```
    
2. Use the following command to run:

    ```bash
    nodemon index.js
    ```
   or alternatively
    ```bash
    npm start
    ```
