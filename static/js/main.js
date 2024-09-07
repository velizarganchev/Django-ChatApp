function init() {
  const messageContainer = document.getElementById("messageContainer");
  if (messageContainer) {
    setTimeout(() => {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }, 50); // 100ms Verzögerung
  }
}

async function sendMessage() {
  const textmassageField = document.getElementById("textmassageField");
  const csrfToken = messageForm.getAttribute("data-csrf");
  const username = messageForm.getAttribute("data-user");
  const superUser = messageForm.getAttribute("data-isSuperUser") === "True";

  const fd = new FormData();
  fd.append("textmassage", textmassageField.value);
  fd.append("csrfmiddlewaretoken", csrfToken);

  messageContainer.innerHTML += `
      <div id="itemToDelete" class="message-item-container ${
        !superUser ? "right" : ""
      }">
          <div class="message-item ${!superUser ? "right-border" : ""} gray">
              <span class="message-author">${username}</span>:
              <span class="message-text">${textmassageField.value}</span>
          </div>
      </div>`;

  try {
    const res = await fetch("/chat/", {
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
}
