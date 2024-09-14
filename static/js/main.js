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
    const chatCreator = messageForm.getAttribute("data-chat_creator");
    const username = messageForm.getAttribute("data-user");

    const fd = new FormData();
    fd.append("textmassage", textmassageField.value);
    fd.append("csrfmiddlewaretoken", csrfToken);

    messageContainer.innerHTML += `
      <div id="itemToDelete" class="message-item-container ${chatCreator !== username ? "right" : ""
      }">
          <div class="message-item ${chatCreator !== username ? "right-border" : ""} gray">
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

      const date = new Date(obj.created_at);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);

      document.getElementById("itemToDelete").remove();

      let noMessage = document.getElementById("noMesseges");
      if (noMessage) {
        document.getElementById("noMesseges").remove();
      }

      messageContainer.innerHTML += `
      <div class="message-item-container ${chatCreator !== username ? "right" : ""}">
          <div class="message-item ${chatCreator !== username ? "right-border" : ""}">
              <span class="message-author">${username}</span>:
              <span class="message-text">${obj.text}</span>
              <span class="message-date">${formattedDate}</span>
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

    const currentUserId = chatForm.getAttribute("data-current-user-id");
    const deleteButtonHTML = (parseInt(toJson.creator) === parseInt(currentUserId)) ? `
      <span>
        <form class="delete-form" method="post" action="/chat/delete/${toJson.id}">
          <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
          <button type="submit" class="mdl-button mdl-js-button mdl-button--accent delete-btn">
            Delete
          </button>
        </form>
      </span>` : "";

    chatsList.innerHTML += `<li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <a class="chat-item" href="/chat/${toJson.id}">${toJson.name}</a>
            </span>
            ${deleteButtonHTML}
        </li>`;

    document.getElementById("chatNameField").value = "";

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

