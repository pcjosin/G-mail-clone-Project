
let composeCloseButton
let composeDiv
function loadCompose() {
  console.log("hi yeaah reached compose")
  let composeHtmlContainer = document.getElementById("compose-container");
  
  composeHtmlContainer.style.display = "block";

  fetch("./compose.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the loaded content into the container
      console.log("fetching on the go")
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
 
    let messageDiv = document.getElementById('message-display-div');
    messageDiv.style.display = 'block';
    messageDiv.innerText = "Recipient email and message are required";
    hideMessageDiv();
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
 
    let messageDiv = document.getElementById('message-display-div');
    messageDiv.style.display = 'block';
    if (response.error) {
      console.log("error")
      messageDiv.innerText = response.error.message;
    }
    else {
      let composeDiv = document.getElementById("compose-container");
  composeDiv.style = "display:none";
      console.log("Success")
      messageDiv.innerText = "Email sent Successfully!";

    }
    hideMessageDiv();
  });
}
 
 
function hideMessageDiv() { //hide message after 5 seconds
  setTimeout(function () {
    let messageDiv = document.getElementById('message-display-div');
    messageDiv.style.display = 'none';
   
  }, 5000);
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

composeCloseButton = document.getElementById("compose-close");
composeCloseButton.style.pointer="cursor"
composeDiv = document.getElementById("compose-container");
composeButton=document.getElementById("compose-button")
composeButton.onclick=loadCompose
composeCloseButton.onclick = () => {
  let composeDiv = document.getElementById("compose-container");
  composeDiv.style = "display:none";
  console.log("close compose clicked");
};



