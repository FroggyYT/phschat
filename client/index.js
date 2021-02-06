document.head.querySelector("title").textContent = /phschat/.test(window.location.host) ? "PHS CHAT" : "LMS CHAT"

var s = io();

var loginScreen = document.createElement("div");
var chatScreen = document.createElement("div");

var messages = document.createElement("div");
chatScreen.append(messages);
// chatScreen.style.position = "absolute";

var messageBox = document.createElement("input");
messageBox.style.position = "absolute";
messageBox.style.width = "69vw";
messageBox.style.height = "5vh";
messageBox.style.left = "5vw";
messageBox.style.top = "90vh";
messageBox.placeholder = "Message";

messageBox.style.borderStyle = "solid";
messageBox.style.borderColor = "black";
messageBox.style.borderRadius = "8px";
messageBox.style.padding = "8px";

chatScreen.append(messageBox);

messages.style.height = "500px";
messages.style.borderStyle = "solid";
messages.style.borderColor = "black";
messages.style.borderRadius = "8px";
messages.style.borderWidth = "2px";
messages.style.overflow = "auto";
messages.style.padding = "8px";
messages.style.position = "absolute";

messages.style.width = "69vw";
messages.style.height = "84vh";
messages.style.top = "5vh";
messages.style.left = "5vw";

var playerList = document.createElement("div");

playerList.style.width = "20vw";
playerList.style.height = "90vh";
playerList.style.left = "75vw";
playerList.style.top = "5vh";


playerList.style.borderStyle = "solid";
playerList.style.borderColor = "black";
playerList.style.borderRadius = "8px";
playerList.style.borderWidth = "2px";
playerList.style.overflow = "auto";
playerList.style.padding = "8px";
playerList.style.position = "absolute";

chatScreen.append(playerList);

var timeout = setTimeout(() => {}, 1);

function startTyping() {
  s.emit("typing");
}

function stopTyping() {
  s.emit("stopTyping");
}

messageBox.addEventListener("input", () => {
  startTyping();
  window.clearTimeout(timeout);
  timeout = setTimeout(stopTyping, 3000);
});

s.on("resSocketList", d => {
  playerList.innerHTML = d.join("<br>");
});

messageBox.onkeypress = k => {
  if (k.keyCode != 13) return;
  if (messageBox.value.length == 0 || messageBox.value.split(" ") > 100) return;
  if (messageBox.value.charAt(0) == "/") {
    var str = messageBox.value.split("");
    str.splice(0, 1);
    s.emit("custom", str.join(""));
  } else {
    s.emit("message", messageBox.value);
  }
  messageBox.value = "";
}

s.on("message", d => {
  var message = document.createElement("message");
  
  var text = document.createElement("a");
  var name = document.createElement("strong");
  text.append(name);
  name.textContent = `${d[0]}: `;
  text.innerHTML += d[1].split("<3").join("❤️");
  
  
  message.append(text);
  
  messages.append(message);
  messages.append(document.createElement("br"));
  
  messages.scrollTop = messages.scrollHeight;
});

s.on("leave", d => {
  var msg = document.createElement("center");
  msg.textContent = `${d} left`;
  messages.append(msg);
  messages.append(document.createElement("br"));

  s.emit("reqSocketList");
});

s.on("join", d => {
  var msg = document.createElement("center");
  msg.textContent = `${d} joined`;
  messages.append(msg);
  messages.append(document.createElement("br"));

  s.emit("reqSocketList");
});
















var nameBox = document.createElement("input");
nameBox.placeholder = "Username";
nameBox.style.position = "absolute";
nameBox.style.top = "5vh";
nameBox.style.width = "40vw";
nameBox.style.height = "5vh";
nameBox.style.left = "30vw";
nameBox.style.fontSize = "3.5vmin";
nameBox.style.textAlign = "CENTER";
loginScreen.append(nameBox);

loginScreen.append(document.createElement("br"));

var loginButton = document.createElement("button");
loginButton.textContent = "Login";
loginButton.style.width = "40vw";
loginButton.style.position = "absolute";
loginButton.style.left = "30vw";
loginButton.style.height = "5vh";
loginButton.style.top = "12vh";
loginButton.style.fontSize = "3.5vmin";
loginButton.style.textAlign = "CENTER";
loginScreen.append(loginButton);

document.body.append(loginScreen);

loginButton.addEventListener("click", () => {
  s.emit("tryLogin", nameBox.value);
});

s.on("loginSuccess", d => {
  loginScreen.remove();
  document.body.append(chatScreen);
});

s.on("refresh", d => {
  window.location = window.location;
});

var disconnectTimeout;

s.on("disconnect", () => {
  disconnectTimeout = setTimeout(() => { window.location = window.location; }, 5000);
});

s.on("reconnect", () => {
  clearTimeout(disconnectTimeout);
});
