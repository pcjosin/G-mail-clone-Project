

function loadCompose() {
  composeDiv.style.display = 'block';
  fetch("compose.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the loaded content into the container
      document.getElementById("compose-html-container").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
}

// Function to send an email using Gmail API
function sendEmail() {
  const recipientEmail = document.getElementById("email-container").value;
  const emailMessage = document.getElementById("message-container").innerHTML;
  const emailSubject = document.getElementById("subject-container").value;


  if (!recipientEmail || !emailMessage) {
    alert("Recipient email and message are required");
    return;
  }

  // const rawMessage = btoa(
  //   `To: ${recipientEmail}\r\n` +
  //   `Subject: ${emailSubject}\r\n` +
  //   'Content-Type: text/plain; charset="UTF-8"\r\n\r\n' +
  //   emailMessage
  // );

  const rawMessage = makeEmail(userEmail, recipientEmail, emailSubject, emailMessage);

  const request = gapi.client.gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: rawMessage,
    },
  });

  request.execute((response) => {
    console.log(response);
  });
}

function makeEmail(sender, to, subject, body) {
  const email_lines = [];

  email_lines.push(`From: ${sender}`);
  email_lines.push(`To: ${to}`);
  email_lines.push(`Content-type: text/html;charset=iso-8859-1`);
  email_lines.push(`Subject: ${subject}`);
  email_lines.push('');
  email_lines.push(body);

  const raw = email_lines.join('\r\n');
  return btoa(unescape(encodeURIComponent(raw)));
}

let composeCloseButton = document.getElementById("compose-close");
let composeDiv = document.getElementById("compose-container");

composeCloseButton.onclick = () => {
  let composeDiv = document.getElementById("compose-container");
  composeDiv.style = "display:none";
  console.log("close compose clicked");
};



