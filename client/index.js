var s = io();

var loginScreen = document.createElement("div");
var chatScreen = document.createElement("div");

var messages = document.createElement("div");
chatScreen.append(messages);
chatScreen.style.position = "absolute";

var messageBox = document.createElement("input");
var messagesWidth = (innerWidth / 4) * 3 / 4;
messageBox.placeholder = "Message";

messages.style.height = "500px";
messages.style.borderStyle = "solid";
messages.style.borderColor = "black";
messages.style.borderRadius = "8px";
messages.style.borderWidth = "2px";
messages.style.overflow = "auto";
messages.style.padding = "8px";
messages.style.position = "absolute";
chatScreen.append(messageBox);

var playerList = document.createElement("div");
playerList.style.height = "574px";
playerList.style.borderStyle = "solid";
playerList.style.borderColor = "black";
playerList.style.borderRadius = "8px";
playerList.style.borderWidth = "2px";
playerList.style.overflow = "auto";
playerList.style.padding = "8px";
playerList.style.position = "absolute";

chatScreen.append(playerList);

messageBox.style.height = "50px";
messageBox.style.borderStyle = "solid";
messageBox.style.borderColor = "black";
messageBox.style.borderRadius = "8px";
messageBox.style.padding = "8px";
messageBox.style.position = "absolute";
messageBox.style.left = "0px";




sizeEls();
window.onresize = sizeEls;

function sizeEls() {
  var chatScreenWidth = innerWidth / 2;
  var chatScreenLeft = (innerWidth / 2) - (innerWidth / 4)
  
  chatScreen.style.width = `${chatScreenWidth}px`;
  chatScreen.style.left = `${chatScreenLeft}px`; 
  
  var messagesWidth = (chatScreenWidth * 3 / 4) - 1;
  var messagesLeft = 0;
  
  messages.style.width = `${messagesWidth}px`;
  messages.style.left = `${messagesLeft}px`;
  
  var playerListWidth = (chatScreenWidth / 4) - 1;
  var playerListLeft = messagesLeft + messagesWidth + 16 + 8;
  
  playerList.style.width = `${playerListWidth}px`;
  playerList.style.left = `${playerListLeft}px`;
  
  var messageBoxWidth = messagesWidth;
  var messageBoxLeft = messagesLeft;
  
  messageBox.style.width = `${messageBoxWidth}px`;
  messageBox.style.top = "524px";
  messageBox.style.left = `${messageBoxLeft}px`;
}




s.on("resSocketList", d => {
  playerList.innerHTML = d.join("<br>");
});

messageBox.onkeypress = k => {
  if (k.keyCode != 13) return;
  s.emit("message", messageBox.value);
  messageBox.value = "";
}

s.on("message", d => {
  var message = document.createElement("message");
  
  var text = document.createElement("a");
  var name = document.createElement("strong");
  text.append(name);
  name.textContent = `${d[0]} `;
  text.innerHTML += d[1];
  
  
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
