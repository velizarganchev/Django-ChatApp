function init() {
  const messageContainer = document.getElementById("messageContainer");
  if (messageContainer) {
    setTimeout(() => {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }, 50);
  }
}

async function sendMessage() {
  const textmassageField = document.getElementById("textmassageField");
  if (textmassageField.value !== "") {
    const csrfToken = messageForm.getAttribute("data-csrf");
    const chatId = messageForm.getAttribute("data-chatId");
    const username = messageForm.getAttribute("data-user");
    const superUser = messageForm.getAttribute("data-isSuperUser") === "True";

    const fd = new FormData();
    fd.append("textmassage", textmassageField.value);
    fd.append("csrfmiddlewaretoken", csrfToken);

    messageContainer.innerHTML += `
      <div id="itemToDelete" class="message-item-container ${!superUser ? "right" : ""
      }">
          <div class="message-item ${!superUser ? "right-border" : ""} gray">
              <span class="message-author">${username}</span>:
              <span class="message-text">${textmassageField.value}</span>
          </div>
      </div>`;

    try {
      const res = await fetch(`/chat/${chatId}`, {
        method: "POST",
        body: fd,
      });

      const toJson = await res.json();
      const obj = JSON.parse(toJson).fields;

      document.getElementById("itemToDelete").remove();

      let noMessage = document.getElementById("noMesseges");
      if (noMessage) {
        document.getElementById("noMesseges").remove();
      }

      messageContainer.innerHTML += `
      <div class="message-item-container ${obj.author != 1 ? "right" : ""}">
          <div class="message-item ${!superUser ? "right-border" : ""}">
              <span class="message-author">${username}</span>:
              <span class="message-text">${obj.text}</span>
              <span class="message-date">${obj.created_at}</span>
          </div>
      </div>`;

      messageContainer.scrollTop = messageContainer.scrollHeight;
    } catch (error) {
      console.error("An error occurred:", error);
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

async function createChat() {
  const chatName = document.getElementById("chatNameField");
  const csrfToken = chatForm.getAttribute("data-csrf");

  const fd = new FormData();
  fd.append("chatname", chatName.value);
  fd.append("csrfmiddlewaretoken", csrfToken);

  try {

    const res = await fetch(`/chat/`, {
      method: "POST",
      body: fd,
    });

    const toJson = await res.json();

    chatsList.innerHTML += `<li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <a class="chat-item" href="/chat/${toJson.id}">${toJson.name}</a>
            </span>
        </li>`;

    document.getElementById("chatNameField").value = "";

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

