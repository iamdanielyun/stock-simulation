# Stock Simulation
### [https://stocksimulation.onrender.com/](https://stocksimulation.onrender.com/)

#### MongoDB, Express.js, React.js, Node.js (MERN)

[![Stock Simulation](https://img.youtube.com/vi/jfb18YuNJQY/0.jpg)](https://www.youtube.com/watch?v=jfb18YuNJQY "Stock Simulation")

## Credits
All data from :
  - https://twelvedata.com/
  - https://finnhub.io/
  - https://rapidapi.com/amansharma2910/api/realstonks

## Description
- Allows users to query for stocks listed across multiple stock exchanges (NASDAQ, NYSE, AMEX...)
- Users can search up a stock for details, such as its current price, price history, news related to it, etc
- Once logged in and authenticated, users can start trading (buying and selling only)
- At any time, users can view their portfolio and check their progress

## Technical details
#### Frontend
- "client" folder contains the react app
- Used useState and useEffect hooks to make fetch calls to the backend routes to retrieve data
- Made custom hooks such as useAuthenticate to retrieve information from the express server to check if user is currently authenticated
- Utilized react router to make routing in the client side much more efficient  
- Created many components to separate the code into multiple files

#### Backend
- "server" folder contains the node/express backend server
- Utilized mongoDB to store user info, including their investments using nested collections
- Communicated with mongoDB Atlas to get, post and update the user's investments
- The express server made all the API calls to third party services and retrieved data in JSON objects
- Used express-session to authenticate and logout users

#### Deployment
- Deploying gave me so many headaches - a lot of things that were working in development mode didn't in production, which forced me to change things, such as the cookie configuration for the sessions.
- Deployed backend and frontend on two different sites both using [https://render.com/](https://render.com/)
