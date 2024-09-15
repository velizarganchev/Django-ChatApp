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
    const userId = messageForm.getAttribute("data-user-id");
    const username = messageForm.getAttribute("data-user-name");

    const fd = new FormData();
    fd.append("textmassage", textmassageField.value);
    fd.append("csrfmiddlewaretoken", csrfToken);

    messageContainer.innerHTML += `
      <div id="itemToDelete" class="message-item-container right">
          <div class="message-item right-border gray">
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
      <div class="message-item-container ${obj.author !== userId ? "right" : ""}">
          <div class="message-item ${obj.author !== userId ? "right-border" : ""}">
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
  const receiver = document.getElementById('receiver_name');
  const currentUserId = chatForm.getAttribute("data-current-user-id");
  const csrfToken = chatForm.getAttribute("data-csrf");

  if (chatName.value && receiver) {
    const fd = new FormData();
    fd.append("chatname", chatName.value);
    fd.append("receiverName", receiver.innerHTML);
    fd.append("csrfmiddlewaretoken", csrfToken);
    try {
      const res = await fetch(`/chat/`, {
        method: "POST",
        body: fd,
      });

      const toJson = await res.json();

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
  } else {
    const noUserContainer = document.getElementById('no-user-container');
    if (noUserContainer) {
      const noUser = document.createElement('p');
      noUser.id = "emptyMessage";
      noUser.className = "empty-message";
      noUser.textContent = "Please enter a chat name and select a user!";

      noUserContainer.appendChild(noUser);

      setTimeout(() => {
        if (noUserContainer.parentNode) {
          noUserContainer.removeChild(noUser);
        }
      }, 1000);
    }
  }
}

function selectUser(username) {
  usersContainer = document.getElementById('chips-container');
  if (username) {
    usersContainer.innerHTML = `<span class="mdl-chip">
            <span id="receiver_name" class="mdl-chip__text">${username}</span>
        </span>`
  }
}

