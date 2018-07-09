# IN2087
For group 42

## How to set up the frontend + backend (on your machine)
- delete package-lock.json
- onMac?change package.json:nothing
- change package.json {"scripts": {
                           "start": "SET PORT=3001 && react-scripts start"... -> "scripts": {
                                                                                     "start": "PORT=3001 react-scripts start"..}
- install `docker-compose`
- in the directory (where docker-compose.yml is), run `docker-compose up --build` (if that doesnt work, try with `sudo`)
- wait for docker to finish doing its stuffs (until you see something like `API is running in port 3000`
- try to type `localhost:1234` on your browser, then add `mongodb://mongo:27017/finda`, and press `connect`, then you should be able to see the internal structure of the Mongo.
- the frontend is running at `localhost:3001`
- the backend is running at `localhost:3000`


## Endpoints
Proposed endpoint structures are as follows:
### Authentication / Entity managements
- [ ] /auth
  - [x] POST /login
  - [x] POST /register
  ~~ - [ ] POST /create_group ~~
### Users
- [ ] /me
  - [ ] POST /toPremium
  - [x] GET /info
  - [ ] POST /info  

  - [x] GET /wants
  - [x] POST /wants
  - [ ] DELETE /wants
  - [ ] PATCH /wants

  - [x] GET /offers
  - [x] POST /offers
  - [ ] DELETE /wants
  - [ ] PATCH /wants


- [x] /user/:username
  - [x] GET /info
  - [x] GET /wants
  - [x] GET /offers

### Debugging
- [x] /test
   - [x] GET /register
   - [x] GET /populate

### Categories
- [ ] /categories
  - [ ] GET /:category
### Groups
- [x] POST /group
- [x] /group/:groupname
  - [x] GET /info
  - [x] POST /info

  - [x] GET /wants
  - [x] POST /wants
  - [x] DELETE /wants
  - ~~[ ] PATCH /wants~~

  - [x] GET /offers
  - [x] POST /offers
  - [x] DELETE /wants
  - ~~[ ] PATCH /wants~~

  - [x] GET /messages
  - [x] POST /messages

  - [x] POST /join
  - [x] POST /quit
  - ~~[ ] POST /canceljoin~~
  - ~~[ ] POST /approve/:username~~
  - ~~[ ] POST /reject/:username~~
  - ~~[ ] POST /invite/:username~~

### Searches
- [ ] /search
  - [ ] GET /wants?q=<search_string>
  - [ ] GET /offers?q=<search_string>
  - [ ] GET /users?q=<search_string>
  - [ ] GET /groups?q=<search_string>
