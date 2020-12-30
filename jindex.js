require("dotenv").config();
//  Everything happens in the server.js file
const server = require("./server.js");
//  Setting up a port. The port is automatically set if there is no .env file
const port = process.env.PORT || 5001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}, http://localhost:${port}`);
});
