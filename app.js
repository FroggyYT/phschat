var express = require("express");
var app = express();
var server = require("http").Server(app);

app.get("/", function(req, res) { res.sendFile(__dirname + "/client/index.html"); });

app.use("/client", express.static(__dirname + "/client"));

server.listen(process.env.PORT || 80);

var io = require("socket.io")(server,{});

var SOCKETS = [];
var NAMES = [];

io.on("connection", (s) => {
  SOCKETS.push(s.id);
  NAMES.push(null);
  
  s.on("tryLogin", d => {
    var valid = true;
    for (var i of NAMES) {
      if (i == d) valid = false;
    }
    if (valid) {
      s.emit("loginSuccess");
      for (var i in SOCKETS) {
        if (SOCKETS[i] == s.id) {
          NAMES[i] = d; 
        }
      }
      io.emit("join", d);
    }
  });
  
  s.on("message", d => {
    var canMessage = false;
    var name;
    
    for (var i in SOCKETS) {
      if (SOCKETS[i] == s.id) {
         if (NAMES[i] != null) canMessage = true;
         name = NAMES[i];
      }
    }
    
    if (canMessage) io.emit("message", [name, d]);
  });
  
  s.on("disconnect", d => {
    for (var i in SOCKETS) {
      if (SOCKETS[i] == s.id) {
        if (NAMES[i] != null) {
          io.emit("leave", NAMES[i]); 
        }
        
        SOCKETS.splice(i, 1);
        NAMES.splice(i, 1);
      }
    }
  });
});
