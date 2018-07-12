# IN2087
Group 42

## How to set up the frontend + backend
- Delete package-lock.json
- If you are on a mac, make the following changes to your package.json file:

From:
```
  "scripts": {
    "start": "SET PORT=3001 && react-scripts start"... -> 
  }
```
To:
```
  "scripts": {
    "start": "PORT=3001 react-scripts start"..
  }
```
- Install `docker-compose`
- In the directory where docker-compose.yml is located, run `docker-compose up --build`
- Wait for docker to finish, (until you see `API is running in port 3000`
- Enter `localhost:1234` in your browser, add `mongodb://mongo:27017/finda` as a database path, and press `connect`. You should be able to see the internal structure of MongoDB.
- Frontend is running at `localhost:3001`
- Backend is running at `localhost:3000`