# Stock Simulation

#### MongoDB, Express.js, React.js, Node.js (MERN)

[![Stock Simulation](https://img.youtube.com/vi/jfb18YuNJQY/0.jpg)](https://www.youtube.com/watch?v=jfb18YuNJQY "Stock Simulation")

## Credits
All data from :
  - [twelvedata] https://twelvedata.com/

## Description
- Allows users to query for stocks listed across multiple stock exchanges (NASDAQ, NYSE, AMEX...)
- Users can search up a stock for details, such as its current price, price history, news related to it, etc
- Once logged in and authenticated, users can start trading (buying and selling only)
- At any time, users can view their portfolio and check their progress

## Technical details
- "client" folder contains the react app
- "server" folder contains the node/express backend server
- Utilized mongoDB to store user info, including their investments using nested collections
- The express server made all the API calls to third party 
  
## Conclusion
- Basic yet fun project 
- Helped me understand nosql databases more
- Realized one of the greatest advantages of a node application is that the backend and frontend can all be written in the same language
