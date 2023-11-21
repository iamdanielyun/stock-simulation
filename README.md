# Stock Simulation

#### MongoDB, Express.js, React.js, Node.js (MERN)

[![Stock Simulation](https://img.youtube.com/vi/jfb18YuNJQY/0.jpg)](https://www.youtube.com/watch?v=jfb18YuNJQY "Stock Simulation")
[https://stocksimulation.onrender.com/](https://stocksimulation.onrender.com/)

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

## Obstacles
- Figuring out how to connect the frontend to the backend (ended up using a proxy server to handle both react and express requests)
- Learning how to use useState and useEffect hooks (first time using React and it took some time getting accustomed to)
- Entering infinite loops using useEffect
- Express api routes constantly returning undefined JSON responses
- Figuring out how to update objects in arrays in a nested schema

## Conclusion
- First ever MERN stack application
- Overall it exhausting and discouraging when I constantly ran into bugs but very fun to create
- Got a basic understanding of what React does and why it's so popular among devs
- Getting more and more comfortable with Express and backend concepts

