var s = io();

var loginScreen = document.createElement("div");
var chatScreen = document.createElement("div");

var messages = document.createElement("div");
chatScreen.append(messages);

var messageBox = document.createElement("input");
messageBox.placeholder = "Message";
messageBox.style.width = "500px";
messageBox.style.height = "500px";
messageBox.style.borderStyle = "solid";
messageBox.style.borderColor = "black";
messageBox.style.borderRadius = "8px";
messageBox.style.borderWidth = "2px";
chatScreen.append(messageBox);

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
});

s.on("join", d => {
  var msg = document.createElement(center);
  msg.textContent = `${d} joined`;
  messages.append(msg);
  messages.append(document.createElement("br"));
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
