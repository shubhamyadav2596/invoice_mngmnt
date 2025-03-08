# Invoice Management System

A comprehensive web application for creating, managing, and tracking invoices. Built with Vue.js for the frontend and a backend API for data management.

## Features

- **Dashboard**: Overview of all invoices with key metrics
- **Invoice Management**: Create, edit, view, and delete invoices
- **Responsive Design**: Works on desktop and mobile devices
- **Advanced Filtering**: Filter invoices by date, price range, state, and more
- **User Authentication**: Secure login and user management

## Tech Stack

- **Frontend**: Vue.js, Bootstrap 5, Bootstrap Icons
- **State Management**: Vuex
- **Routing**: Vue Router
- **Styling**: CSS
- **Database**: MongoDB
- **Backend**: Node.js, Express.js

## Project Structure

management/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   ├── store/
│   │   ├── views/
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── README.md
└── backend/
├── controllers/
├── models/
├── routes/
├── server.js
└── package.json

## Github Repository:-  https://github.com/shubhamyadav2596/invoice_mngmnt/tree/main

## Live Link:- https://invoice-mngmnt-1.onrender.com/


## Getting Started

# Prerequisites

- Node.js (v14 or higher)
- npm or yarn

# Installation

1. Clone the repository
```bash
- git clone <repository-url>
- cd management

2. Install frontend dependencies
- cd ../backend
- npm install

3. Install backend dependencies
- cd ../backend
- npm install

# Running the Application

1. Start the backend server
- cd backend
- npm start

2. Start the frontend development server
- cd frontend
- npm run dev


## Key Features Explained
### Invoice Creation
The application allows users to create detailed invoices with:

- Company information
- Customer details
- Multiple product/service line items
- Automatic total calculation
### Dashboard
The dashboard provides an overview of:

- Total number of invoices
- User-generated vs panel-generated invoices
- Recent invoice activity
### Advanced Filtering
Users can filter invoices by:

- Price range
- State
- Search text (name, email, mobile, invoice number)
### Responsive Design
The application is fully responsive with:

- Collapsible sidebar for mobile devices
- Optimized layouts for different screen sizes
- Touch-friendly interface elements