const url = window.location.pathname;
const chatId = url.split("/")[2];

// const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/' + chatId + '/');
const socketProtocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(
    socketProtocol
    + '://'
    + window.location.host  
    + '/ws/chat/'
    + chatId
    + '/'
);

socket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const userId = messageForm.getAttribute("data-user-id");

    const date = new Date(data.created_at);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    let noMessage = document.getElementById("noMesseges");
    if (noMessage) {
        document.getElementById("noMesseges").remove();
    }

    messageContainer.innerHTML += `
    <div class="message-item-container ${data.author !== userId ? "right" : ""}">
        <div class="message-item ${data.author !== userId ? "right-border" : ""}">
            <span class="message-author">${data.username}</span>:
            <span class="message-text">${data.text}</span>
            <span class="message-date">${formattedDate}</span>
        </div>
    </div>`;

    messageContainer.scrollTop = messageContainer.scrollHeight;
};

async function sendMessage() {
    const textmassageField = document.getElementById("textmassageField");
    if (textmassageField.value !== "") {
        const csrfToken = messageForm.getAttribute("data-csrf");
        const chatId = messageForm.getAttribute("data-chatId");
        const userId = messageForm.getAttribute("data-user-id");
        const username = messageForm.getAttribute("data-user-name");

        const messageData = {
            textmassage: textmassageField.value,
            csrfmiddlewaretoken: csrfToken,
            chatId: chatId,
            userId: userId,
            username: username,
        };

        messageContainer.innerHTML += `
      <div id="itemToDelete" class="message-item-container right">
          <div class="message-item right-border gray">
              <span class="message-author">${username}</span>:
              <span class="message-text">${textmassageField.value}</span>
          </div>
      </div>`;

        try {
            socket.send(JSON.stringify(messageData));
        } catch (error) {
            console.error('Error sending message:', error);
        }

        document.getElementById("textmassageField").value = "";

    } else {
        const messageInputEmpty = document.getElementById('message-input-empty');
        if (messageInputEmpty) {
            const emptyMessage = document.createElement('p');
            emptyMessage.id = "emptyMessage";
            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "Please enter your message!";

            messageInputEmpty.appendChild(emptyMessage);

            setTimeout(() => {
                if (emptyMessage.parentNode) {
                    emptyMessage.parentNode.removeChild(emptyMessage);
                }
            }, 2500);
        }
    }
}
