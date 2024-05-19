# Car-Go

Welcome to Car-Go, a carpooling web application built using the MERN stack (MongoDB, Express.js, React, Node.js).


## Live Demo

Check out the live application [here](https://car-go-mauve.vercel.app/).

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

## About

Car-Go is a platform that connects drivers with empty seats in their cars to passengers looking for a ride. It's designed to make carpooling simple and efficient, helping to reduce traffic congestion and carbon emissions.

## Features

- **User Authentication:** Secure login and registration system.
- **Profile Management:** Users can manage their personal information and car details.
- **Ride Listings:** Drivers can create ride offers, and passengers can browse and request rides.
- **Responsive Design:** Works seamlessly on both desktop and mobile devices.

## Technologies Used

- **Frontend:**
  - React
  - Typescript
  - Tailwind CSS
  - Vite

- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - MongoDB
 
- **Others:**
  - Cloudinary (For image uploading)
  - Google Places Autocomplete

- **Deployment:**
  - Vercel (Client)
  - Render (Server)

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/divyanshu0469/car-go.git
   cd car-go
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `server` directory and add your MongoDB connection string and other necessary environment variables.

4. **Start the development servers:**
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm run dev
   ```

5. **Open your browser:**
   Go to `http://localhost:5001` to view the application.

## Usage

Once the servers are running, you can:

- **Sign Up:** Create a new account.
- **Log In:** Access your dashboard.
- **Post Rides:** As a driver, create new ride offers.
- **Browse Rides:** As a passenger, find and request available rides.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.


## Contact

If you have any questions or feedback, feel free to reach out:

- **Email:** divyadav31@gmail.com
- **GitHub:** [divyanshu0469](https://github.com/divyanshu0469)
