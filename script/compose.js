
let composeCloseButton
let composeDiv
function loadCompose() {
  console.log("hi yeaah reached compose")
  let composeHtmlContainer = document.getElementById("compose-container");

  document.addEventListener('mousedown', function (event) {
    if (composeHtmlContainer.style.display == 'block') {
      if (event.target !== composeHtmlContainer && !composeHtmlContainer.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
  
  composeHtmlContainer.style.display = "block";

  fetch("./compose.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the loaded content into the container
      console.log("fetching on the go")
      document.getElementById("compose-html-container").innerHTML = data;

      let isTextSelected = false;
      //keep text inside div selected when clicked outside div

      let messaggeContainer = document.getElementById('message-container');
      messaggeContainer.addEventListener('mouseup', function () {
        var selection = window.getSelection();
        if (selection.toString().length > 0) {
          isTextSelected = true;
        } else {
          isTextSelected = false;
        }
      });

      document.addEventListener('mousedown', function (event) {
        if (isTextSelected && !messaggeContainer.contains(event.target)) {
          event.preventDefault();
        }
        console.log('Clicked inside the div');
      });



      let fontSizeList = document.getElementById('compose-text-list');

      let sizeTextButton = document.getElementById('compose-font-size');//initialise event listeners
      sizeTextButton.addEventListener('click', function () {
        fontSizeList.style.display = 'block';

        let smallTextButton = document.getElementById('compose-list-small');//initialise event listeners
        smallTextButton.addEventListener('mousedown', function () {
          stylise(5); //small size
          fontSizeList.style.display = 'none';
        });

        let normalTextButton = document.getElementById('compose-list-normal');//initialise event listeners
        normalTextButton.addEventListener('mousedown', function () {
          stylise(6); //normal size
          fontSizeList.style.display = 'none';
        });

        let largeTextButton = document.getElementById('compose-list-large');//initialise event listeners
        largeTextButton.addEventListener('mousedown', function () {
          stylise(7); //large size
          fontSizeList.style.display = 'none';
        });

        let hugeTextButton = document.getElementById('compose-list-huge');//initialise event listeners
        hugeTextButton.addEventListener('mousedown', function () {
          stylise(8); //huge size
          fontSizeList.style.display = 'none';
        });


      });

      document.addEventListener('click', function (event) {
        if (event.target !== fontSizeList && !fontSizeList.contains(event.target)
          && event.target !== sizeTextButton && !sizeTextButton.contains(event.target)) {
          fontSizeList.style.display = 'none';
        }
      });


      let boldTextButton = document.getElementById('compose-bold');//initialise event listeners
      boldTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        stylise(1);
      });

      let italicTextButton = document.getElementById('compose-italic');//initialise event listeners
      italicTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        stylise(2);
      });

      let underlineTextButton = document.getElementById('compose-underline');//initialise event listeners
      underlineTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        stylise(3);
      });

      let colorPickerDiv = document.getElementById('compose-color-picker');

      let colorTextButton = document.getElementById('compose-font-color');//initialise event listeners
      colorTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        colorPickerDiv.style.display = 'block';

        colorPickerDiv.addEventListener('click', function (event) {
          let elementClicked = event.target.id;
          console.log(elementClicked);


          if (elementClicked.length == 7) {
            let fBChoice;
            if (document.getElementById('text-color-choice').checked) {
              fBChoice = 1;
            }
            else if (document.getElementById('background-color-choice').checked) {
              fBChoice = 2;
            }
            else {
              console.log('Error occoured at radio button selection');
            }

            colorPicker(elementClicked, fBChoice);
            colorPickerDiv.style.display = 'none';

          }
        })

      });

      document.addEventListener('click', function (event) {
        if (event.target !== colorPickerDiv && !colorPickerDiv.contains(event.target)
          && event.target !== colorTextButton && !colorTextButton.contains(event.target)) {
          colorPickerDiv.style.display = 'none';
        }
      });

      let resetTextButton = document.getElementById('compose-reset');//initialise event listeners
      resetTextButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        stylise(4);
      });


      let insertLinkDiv = document.getElementById('compose-insert-link-div');
      let insertLinkButton = document.getElementById('compose-insert-link');
      
      document.addEventListener('mousedown', function (event) {
        if (insertLinkDiv.style.display =='block') {
          if (event.target !== insertLinkDiv && !insertLinkDiv.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });
      
      insertLinkButton.addEventListener('mousedown', function () {
        // window.alert("bold clicked");
        insertLinkDiv.style.display = 'block';
        let composeLinkUrl = document.getElementById('compose-link-url');
        let testLinkText = document.getElementById('insert-link-row4');

        testLinkText.addEventListener('mousedown', function () {
          let testUrl = composeLinkUrl.value;
          if (testUrl.length <= 0) {
            window.alert('Link is not valid: URL field empty!');
          }
          else {
            try {
              const newUrl = new URL(testUrl);
              window.open(testUrl, '_blank');
              console.log('in here');
            } catch (err) {
              window.alert('Link is not valid: Check URL you entered!');
            }
          }
        });

      });

    })
    .catch((error) => console.error("Error:", error));
}





function stylise(textStyle) {
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
      case 5: divElement.style.fontSize = 'small';
        break;
      case 6: divElement.style.fontSize = 'medium';
        break;
      case 7: divElement.style.fontSize = 'x-large';
        break;
      case 8: divElement.style.fontSize = 'xx-large';
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
    console.log("no text selected!");
  }
}

function colorPicker(elementClicked, fBChoice) {
  elementClicked = "#" + elementClicked.substring(1);

  const selectedText = getSelectedText();

  if (selectedText) {
    const divElement = document.createElement('span');

    if (fBChoice == 1) {
      divElement.style.color = elementClicked;
    }
    else if (fBChoice == 2) {
      divElement.style.backgroundColor = elementClicked;
    }
    else {
      console.log("error occoured due to choice number passed");
      return;
    }
    const range = window.getSelection().getRangeAt(0);

    let tempContainer = document.createElement("span");
    tempContainer.appendChild(range.cloneContents());
    divElement.innerHTML = tempContainer.innerHTML;
    range.deleteContents();
    range.insertNode(divElement);
  } else {
    console.log("no text selected!");
  }

}

function cancelInsertLink() {
  let insertLinkDiv = document.getElementById('compose-insert-link-div');
  let composeLinkTextToDisp = document.getElementById('compose-link-text-todisplay');
  let composeLinkUrl = document.getElementById('compose-link-url');
  composeLinkTextToDisp.value = '';
  composeLinkUrl.value = '';
  insertLinkDiv.style.display = 'none';

}


function insertLink() {

  let messageDiv = document.getElementById("message-container");
  let insertLinkDiv = document.getElementById('compose-insert-link-div');


  const linkElement = document.createElement('a');
  let composeLinkTextToDisp = document.getElementById('compose-link-text-todisplay');
  let composeLinkUrl = document.getElementById('compose-link-url');

  if (!composeLinkTextToDisp.value || !composeLinkUrl.value) {
    console.log('no url or text');
    window.alert('Enter all fields or click cancel to go back!')
    return;
  }
  else {
    linkElement.href = composeLinkUrl.value;
    linkElement.innerText = composeLinkTextToDisp.value;
    messageDiv.appendChild(linkElement);
  }
  composeLinkTextToDisp.value = '';
  composeLinkUrl.value = '';
  insertLinkDiv.style.display = 'none';
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

