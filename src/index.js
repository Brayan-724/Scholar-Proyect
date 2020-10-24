// Get modules
const express = require("express");
const http = require("http");
const join = require("path").join;

// Setup
const app = express();
const server = http.createServer(app);

// Setting
app.set("port", process.env.PORT || 1403);
app.use(express.static(join(__dirname, "public")));

// Init
server.listen(app.get("port"), () => {
	console.log("Active http://192.168.100.9:1403")
});

require("./helpers/socket").run(server);