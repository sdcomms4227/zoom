const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form#message");
const nicknameForm = document.querySelector("form#nickname");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  return JSON.stringify({ type, payload });
}

socket.addEventListener("open", () => {
  console.log("connected to server!!");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.appendChild(li);
});

socket.addEventListener("close", () => {
  console.log("disconnected from server!!");
});

function handleSubmit(event) {
  event.preventDefault();
  const messageInput = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", messageInput.value));
  messageInput.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const nicknameInput = nicknameForm.querySelector("input");
  socket.send(makeMessage("nickname", nicknameInput.value));
}

messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNicknameSubmit);
