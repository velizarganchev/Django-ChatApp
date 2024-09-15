document.addEventListener('DOMContentLoaded', function () {
    // Hole die chatId und weitere Daten aus den Attributen des Forms
    const chatId = document.getElementById("messageForm").getAttribute("data-chatId");
    const chatCreator = document.getElementById("messageForm").getAttribute("data-chat_creator");
    const username = document.getElementById("messageForm").getAttribute("data-user");

    // WebSocket-Verbindung nur auf dieser Seite erstellen
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + chatId + '/'
    );

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);

        const date = new Date(data.created_at);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        let noMessage = document.getElementById("noMesseges");
        if (noMessage) {
            document.getElementById("noMesseges").remove();
        }

        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML += `
        <div class="message-item-container ${chatCreator !== username ? "right" : ""}">
            <div class="message-item ${chatCreator !== username ? "right-border" : ""}">
                <span class="message-author">${data.username}</span>:
                <span class="message-text">${data.text}</span>
                <span class="message-date">${formattedDate}</span>
            </div>
        </div>`;

        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };

    // Nachricht senden
    const messageForm = document.getElementById("messageForm");
    messageForm.onsubmit = function (event) {
        event.preventDefault();

        const textmassageField = document.getElementById("textmassageField");
        if (textmassageField.value !== "") {
            const message = {
                text: textmassageField.value,
                username: username
            };

            // Nachricht über WebSocket senden
            chatSocket.send(JSON.stringify(message));

            // Temporäre Nachricht anzeigen
            const messageContainer = document.getElementById("messageContainer");
            messageContainer.innerHTML += `
          <div id="itemToDelete" class="message-item-container right">
              <div class="message-item right-border gray">
                  <span class="message-author">${username}</span>:
                  <span class="message-text">${textmassageField.value}</span>
              </div>
          </div>`;

            document.getElementById("textmassageField").value = "";
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    };

    // Init-Funktion aufrufen, um nach dem Laden der Seite automatisch zu scrollen
    init();
});

// Init-Funktion, um das automatische Scrollen zu ermöglichen
function init() {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
        setTimeout(() => {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 50);
    }
}
