var s = io();

var loginScreen = document.createElement("div");
var chatScreen = document.createElement("div");

var messages = document.createElement("div");
chatScreen.append(messages);

chatScreen.style.width = `${innerWidth / 3}px`;
chatScreen.style.position = "absolute";
chatScreen.style.left = `${(innerWidth / 3 / 2) - (innerWidth / 3)}px`;

var messageBox = document.createElement("input");
messageBox.placeholder = "Message";
messages.style.width = "100%";
messages.style.height = "500px";
messages.style.borderStyle = "solid";
messages.style.borderColor = "black";
messages.style.borderRadius = "8px";
messages.style.borderWidth = "2px";
messages.style.overflow = "auto";
messages.style.padding = "8px";
messages.style.margin = "1px";
chatScreen.append(messageBox);

var playerList = document.createElement("div");
playerList.style.width = "100%";
playerList.style.height = "100px";
playerList.style.borderStyle = "solid";
playerList.style.borderColor = "black";
playerList.style.borderRadius = "8px";
playerList.style.borderWidth = "2px";
playerList.style.overflow = "auto";
playerList.style.padding = "8px";
playerList.style.margin = "1px";
chatScreen.append(playerList);

messageBox.style.width = "100%";
messageBox.style.height = "50px";
messageBox.style.borderStyle = "solid";
messageBox.style.borderColor = "black";
messageBox.style.borderRadius = "8px";
messageBox.style.padding = "8px";
messageBox.style.margin = "1px";

s.on("resSocketList", d => {
  playerList.textContent = d.join(", ");
});

messageBox.onkeypress = k => {
  if (k.keyCode != 13) return;
  s.emit("message", messageBox.value);
  messageBox.value = "";
}

s.on("message", d => {
  var message = document.createElement("message");
  
  var name = document.createElement("strong");
  name.textContent = `${d[0]} `;
  
  var text = document.createElement("p");
  text.textContent = d[1];
  
  message.append(name);
  message.append(text);
  
  messages.append(message);
  messages.append(document.createElement("br"));
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
loginScreen.append(nameBox);

var loginButton = document.createElement("button");
loginButton.textContent = "Login";
loginScreen.append(loginButton);

document.body.append(loginScreen);

loginButton.addEventListener("click", () => {
  s.emit("tryLogin", nameBox.value);
});

s.on("loginSuccess", d => {
  loginScreen.remove();
  document.body.append(chatScreen);
});
