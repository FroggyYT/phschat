var s = io();

var loginScreen = document.createElement("div");
var chatScreen = document.createElement("div");

var messages = document.createElement("div");
chatScreen.append(messages);

var messageBox = document.createElement("input");
messageBox.placeholder = "Message";
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
