document.head.querySelector("title").textContent = /phschat/.test(window.location.host) ? "PHS CHAT" : "LMS CHAT"

var s = io();

var loginScreen = document.createElement("div");
var chatScreen = document.createElement("div");
chatScreen.id = "chatScreen";

var messageBox = document.createElement("input");
messageBox.style.position = "absolute";
messageBox.style.width = "69vw";
messageBox.style.height = "5vh";
messageBox.style.left = "5vw";
messageBox.style.top = "90vh";
messageBox.placeholder = "Message";

// messageBox.style.borderStyle = "solid";
// messageBox.style.borderColor = "black";
messageBox.style.borderRadius = "8px";
messageBox.style.padding = "8px";
messageBox.style.borderStyle = "none";

messageBox.className = "card";

chatScreen.append(messageBox);

var messages = document.createElement("div");

// messages.style.height = "500px";
// messages.style.borderStyle = "solid";
// messages.style.borderColor = "black";
messages.style.borderRadius = "8px";
messages.style.borderWidth = "2px";
messages.style.overflow = "auto";
messages.style.padding = "8px";
messages.style.position = "absolute";

messages.style.width = "69vw";
messages.style.height = "84vh";
messages.style.top = "5vh";
messages.style.left = "5vw";

messages.className = "card";


chatScreen.append(messages);


var typingBox = document.createElement("div");

typingBox.style.position = "absolute";
typingBox.style.width = "20vw";
typingBox.style.height = "5vh";
typingBox.style.left = "75vw";
typingBox.style.top = "90vh";

// typingBox.style.borderStyle = "solid";
// typingBox.style.borderColor = "black";
typingBox.style.borderRadius = "8px";
typingBox.style.padding = "8px";
typingBox.style.borderWidth = "2px";

typingBox.className = "card";

chatScreen.append(typingBox);



var playerList = document.createElement("div");

playerList.style.width = "20vw";
playerList.style.height = "84vh";
playerList.style.left = "75vw";
playerList.style.top = "5vh";


// playerList.style.borderStyle = "solid";
// playerList.style.borderColor = "black";
playerList.style.borderRadius = "8px";
playerList.style.borderWidth = "2px";
playerList.style.overflow = "auto";
playerList.style.padding = "8px";
playerList.style.position = "absolute";

playerList.className = "card";

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
  if (messageBox.value.length == 0 || messageBox.value.split(" ").length > 100) return;
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
  messages.scrollTop = messages.scrollHeight;
});

s.on("join", d => {
  var msg = document.createElement("center");
  msg.textContent = `${d} joined`;
  messages.append(msg);
  messages.append(document.createElement("br"));

  s.emit("reqSocketList");
  messages.scrollTop = messages.scrollHeight;
});

s.on("typing", d => {
  typingBox.textContent = `${d.join(", ")} ${d.length > 0 ? "is typing..." : ""}`;
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
nameBox.className = "card";
loginScreen.append(nameBox);

loginScreen.append(document.createElement("br"));

loginScreen.id = "loginScreen";

var loginButton = document.createElement("button");
loginButton.textContent = "Login";
loginButton.style.width = "40vw";
loginButton.style.position = "absolute";
loginButton.style.left = "30vw";
loginButton.style.height = "5vh";
loginButton.style.top = "12vh";
loginButton.style.fontSize = "3.5vmin";
loginButton.style.textAlign = "CENTER";
loginButton.className = "card";
loginScreen.append(loginButton);

var loginModal = document.createElement("div");
var loginModalBlur = document.createElement("div");
loginModalBlur.id = "loginModalBlur";
loginModal.id = "loginModal";
loginModal.className = "card";

loginModal.textContent = "Logging in...";



document.body.append(loginScreen);

loginButton.addEventListener("click", () => {
  if (nameBox.value.length == 0) return;
  s.emit("tryLogin", nameBox.value);

  loginScreen.append(loginModal);
  loginScreen.append(loginModalBlur);
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
  disconnectTimeout = setTimeout(() => { window.location = window.location; }, 1000);
});

s.on("reconnect", () => {
  clearTimeout(disconnectTimeout);
});
