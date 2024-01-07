
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

      let sizeTextButton = document.getElementById('compose-font-size');//initialise event listeners
      sizeTextButton.addEventListener('mousedown', function () {
        let fontSizeList = document.getElementById('compose-text-list');
        fontSizeList.style.display = 'block';
      });

      let boldTextButton = document.getElementById('compose-bold');//initialise event listeners
      boldTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        Stylise(1);
      });

      let italicTextButton = document.getElementById('compose-italic');//initialise event listeners
      italicTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        Stylise(2);
      });

      let underlineTextButton = document.getElementById('compose-underline');//initialise event listeners
      underlineTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        Stylise(3);
      });

      let colorTextButton = document.getElementById('compose-font-color');//initialise event listeners
      colorTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
      });

      let resetTextButton = document.getElementById('compose-reset');//initialise event listeners
      resetTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        Stylise(4);
      });

      let insertLinkButton = document.getElementById('compose-insert-link');//initialise event listeners
      insertLinkButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
      });




    })
    .catch((error) => console.error("Error:", error));
}




function Stylise(textStyle) {
  const selectedText = getSelectedText();

  if (selectedText) {
    const divElement = document.createElement('span');

    switch (textStyle) {
      case 1: divElement.style.fontWeight = '600';
        break;
      case 2: divElement.style.fontStyle = 'italic';
        break;
      case 3: divElement.style.textDecoration = 'underline';
        break;
      case 4: divElement.style.textDecoration = 'none';
        divElement.style.fontWeight = 'normal';
        divElement.style.fontStyle = 'normal';
        break;
        

    }

    // Create a range and surround the selected text with the div
    const range = window.getSelection().getRangeAt(0);

    let tempContainer = document.createElement("span");
    tempContainer.appendChild(range.cloneContents());
    divElement.innerHTML = tempContainer.innerHTML;
    range.deleteContents();
    range.insertNode(divElement);
  } else {
    alert('Please select some text before clicking the button.');
  }
}

function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.selection && document.selection.type !== 'Control') {
    return document.selection.createRange().text;
  }
  return '';
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
composeCloseButton.style.pointer = "cursor"
composeDiv = document.getElementById("compose-container");
composeButton = document.getElementById("compose-button")
composeButton.onclick = loadCompose
composeCloseButton.onclick = () => {
  let composeDiv = document.getElementById("compose-container");
  composeDiv.style = "display:none";
  console.log("close compose clicked");
};

