PORT=5000
MONGO_URI=mongodb://localhost:27017/collabnotes
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=http://localhost:5173