let emailListContainer;
let emailBody;
let emailSubject;

function loadPage2Content() {
  fetch("html/emaillist.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the loaded content into the container
      document.getElementById("display-area").innerHTML = data;
      emailListContainer = document.getElementById("main-list-content");
    })
    .catch((error) => console.error("Error:", error));
}

// Call the function to load content on page load
//loadPage2Content("mail.html");

const API_KEY = "AIzaSyAGzP3_IUN8Ds05jBNckdYrFR6jyDeoeEo";

loadPage2Content();

// Initialize the Gmail API client on the Next Page
const accessToken = localStorage.getItem("accessToken"); //+++++++++++++++++++++++++++++++++++++++++++++++ change access token to session storage
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ find a way to encrypt access token

// Initialize the Gmail API client on the Next Page
function gapiLoaded() {
  gapi.load("client", () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
        ],
      })
      .then(() => {
        // Set the access token in gapi.client
        if (accessToken) {
          gapi.client.setToken({ access_token: accessToken });

          // Call the listLabels function
          listLabels();
          listLatestEmails(50);
        } else {
          document.getElementById("nextpage-content").innerText =
            "Access token not found.";
        }
      });
  });
}

async function listLatestEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: numberOfEmails,
    });

    console.log(response.result.messages);

    for (const message of response.result.messages) {
      const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
      console.log(messagePreview);

      const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element

      emailListElement.setAttribute("id", message.id);
      emailListElement.onclick = () => clickHandle(message.id);

      emailListContainer.appendChild(emailListElement);
    }
  } catch (error) {
    console.error("Error listing emails:", error);
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// function to return a preview of email
async function getEmailPreview(messageId) {
  console.log("inside preview");
  try {
    const response = gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "metadata",
      metadataHeaders: ["Subject", "From","Date"],
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error getting email preview:", error);
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function getSenderName(messageId) {
  try {
    const emailData = await getEmailContent(messageId);

    if (
      emailData &&
      emailData.result &&
      emailData.result.payload &&
      emailData.result.payload.headers
    ) {
      const headers = emailData.result.payload.headers;

      for (let i = 0; i < headers.length; i++) {
        if (headers[i].name === "From") {
          // Extract the name from the email address (assumes the format "Name <email>")
          const match = headers[i].value.match(/(.*) <.*>/);
          return match ? match[1] : headers[i].value;
        }
      }
    } else {
      console.error("Error: Invalid email data structure:", emailData);
    }
  } catch (error) {
    console.error("Error getting sender name:", error);
  }

  return null; // Return null if sender's email is not found or encountered an error
}

async function getMessageSnippet(messageId) {
  try {
    const emailData = await getEmailContent(messageId);

    if (emailData && emailData.result && emailData.result.snippet) {
      return emailData.result.snippet;
    } else {
      console.error(
        "Error: Invalid email data structure or missing snippet:",
        emailData
      );
    }
  } catch (error) {
    console.error("Error getting message snippet:", error);
  }

  return null; // Return null if snippet is not found or encountered an error
}

async function getEmailContent(messageId) {
  try {
    const response = await gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });
    return response;
  } catch (error) {
    return null;
    console.error("Error getting email content:", error);
  }
}

// Handle the response

// Process the email data, body, sender's email, sender's name, and send time as needed
async function clickHandle(emailElementId) {
  fetch("mail.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the loaded content into the container
      document.getElementById("display-area").innerHTML = data;

      emailBody = document.getElementById("body-content");
      emailSubject = document.getElementById("email-subject");
    })
    .catch((error) => console.error("Error:", error));

  emailSubjectContent = await getSendSubject(emailElementId);
  emailBodyContent = await getEmailBodyHtml(emailElementId);
  console.log(emailBodyContent + "))))))))");

  // Update your HTML elements
  emailSubject.innerText = emailSubjectContent;
  emailBody.innerHTML = emailBodyContent;
  emailBody.style.overflowY = "scroll";
}

async function getEmailBodyHtml(messageId) {
  try {
    // Use the Gmail API to get the email content
    const response = await gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    // Access the email data from the response
    const emailData = response.result;

    // Check if the email has parts
    if (emailData.payload && emailData.payload.parts) {
      // Iterate through parts
      for (const part of emailData.payload.parts) {
        // Check if the part is text/html (HTML content)
        if (
          part.mimeType === "text/html" &&
          part.body &&
          part.body.data
        ) {
          // Decode the base64-encoded data using custom function
          console.log(part.body.data)
          const htmlContent =  decodeURIComponent(escape(atob(part.body.data.replace(/\-/g, '+').replace(/\_/g, '/'))));
          console.log(htmlContent)
          // Return the decoded HTML content
          return htmlContent;
        }
      }
    }

    // Return an empty string if no valid HTML content is found
    return "";
  } catch (error) {
    console.error("Error getting email HTML content:", error);
    return ""; // Return an empty string in case of an error
  }
}

function decodeBase64(encodedString) {
  const binaryString = atob(encodedString);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return String.fromCharCode.apply(null, bytes);
}

async function getSenderEmail(messageId) {
  try {
    const emailData = await getEmailContent(messageId);
    const headers = emailData.payload.headers;

    for (let i = 0; i < headers.length; i++) {
      if (headers[i].name === "From") {
        return headers[i].value;
      }
    }

    return null; // Return null if 'From' header is not found
  } catch (error) {
    console.error("Error getting sender email:", error);
    return null;
  }
}

async function getSendTime(messageId) {
  try {
    const emailData = await getEmailContent(messageId);

    if (
      emailData &&
      emailData.result &&
      emailData.result.payload &&
      emailData.result.payload.headers
    ) {
      const headers = emailData.result.payload.headers;

      for (let i = 0; i < headers.length; i++) {
        if (headers[i].name === "Date") {
          return new Date(headers[i].value);
        }
      }
    } else {
      console.error("Error: Invalid email data structure:", emailData);
    }
  } catch (error) {
    console.error("Error getting send time:", error);
  }

  return null; // Return null if 'Date' header is not found or encountered an error
}

async function getSendSubject(messageId) {
  try {
    const emailData = await getEmailContent(messageId);

    if (
      emailData &&
      emailData.result &&
      emailData.result.payload &&
      emailData.result.payload.headers
    ) {
      const headers = emailData.result.payload.headers;

      for (let i = 0; i < headers.length; i++) {
        if (headers[i].name === "Subject") {
          return headers[i].value;
        }
      }
    } else {
      console.error("Error: Invalid email data structure:", emailData);
    }
  } catch (error) {
    console.error("Error getting email subject:", error);
  }

  return null; // Return null if 'Subject' header is not found or encountered an error
}

// Function to list labels
async function listLabels() {
  let response;
  try {
    response = await gapi.client.gmail.users.labels.list({
      userId: "me",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const labels = response.result.labels;
  if (!labels || labels.length == 0) {
    document.getElementById("content").innerText = "No labels found.";
    return;
  }

  let parentDiv = document.getElementById("main-sidebar");
  for (let i = 0; i < labels.length; i++) {
    let labelDiv = document.createElement("div"); //main label div
    labelDiv.id = labels[i].id;
    labelDiv.classList.add("labelDiv", "row", "ms-2", "me-1", "p-2");

    let iconDiv = document.createElement("div"); //adding icon tag
    iconDiv.classList.add("bi", "col-1", "fs-6", "me-2");
    switch (labels[i].id.toLowerCase()) {
      case "chat":
        iconDiv.classList.add("bi-chat-left-text");
        break;
      case "sent":
        iconDiv.classList.add("bi-send");
        break;
      case "inbox":
        iconDiv.classList.add("bi-inbox");
        break;
      case "trash":
        iconDiv.classList.add("bi-trash");
        break;
      case "snoozed":
        iconDiv.classList.add("bi-clock");
        break;
      case "draft":
        iconDiv.classList.add("bi-file-earmark");
        break;
      case "spam":
        iconDiv.classList.add("bi-exclamation-octagon");
        break;
      case "starred":
        iconDiv.classList.add("bi-star");
        break;
      case "important":
        iconDiv.classList.add("bi-flag");
        break;
      case "unread":
        iconDiv.classList.add("bi-flag");
        break;
      case "category_updates":
        iconDiv.classList.add("bi-exclamation-circle");
        break;
      case "category_promotions":
        iconDiv.classList.add("bi-tag");
        break;
      case "category_social":
        iconDiv.classList.add("bi-person-lines-fill");
        break;

      default:
        iconDiv.classList.add("bi-inbox");
    }
    labelDiv.append(iconDiv);

    let anchor = document.createElement("a"); //adding anchor tag
    let aName = labels[i].name.toLowerCase();
    aName = aName.charAt(0).toUpperCase() + aName.slice(1);
    anchor.innerHTML = aName;
    anchor.classList.add("col-6", "labelAnchor", "fs-6");
    labelDiv.append(anchor);

    // labelDiv.innerHTML=labels[i].name;
    parentDiv.appendChild(labelDiv);
  }

  console.log(labels);
}

function loadEmailContent(response) {


  var shortMonthNames = [
'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];


  const previewTitleContent = response.result.payload.headers.find(
    (header) => header.name === "Subject"
  ).value;
  let senderNameContent =
    response.result.payload.headers
      .find((header) => header.name === "From")
      .value.split("<")[0] == ""
      ? response.result.payload.headers.find(
          (header) => header.name === "From"
        ).value
      : response.result.payload.headers
          .find((header) => header.name === "From")
        .value.split("<")[0];
  if (senderNameContent.length > 19) {
    senderNameContent = senderNameContent.slice(0, 19) + '.';
  }
  const sndDateTime =new Date(response.result.payload.headers.find((header) => header.name === "Date").value);
  console.log('snddte:'+sndDateTime);
  let today = new Date();
  console.log('snddte:'+today);

  if (today.getFullYear()===sndDateTime.getFullYear() &&
      today.getMonth()===sndDateTime.getMonth() &&
      today.getDate()===sndDateTime.getDate()){
          var sendTimeContent=sndDateTime.toLocaleTimeString().replace(/:\d{2} /, ' ');
                  console.log('snddte:'+sendTimeContent);
      }
  else if(today.getFullYear() ===sndDateTime.getFullYear()){
      var sendTimeContent=   shortMonthNames[parseInt( sndDateTime.getMonth())] +' '+ sndDateTime.getDate();
      console.log('snddte:'+sendTimeContent);

  }
  else{
      var sendTimeContent=sndDateTime.toLocaleDateString();
      console.log('snddte:'+sendTimeContent);

  }

  

 // const sendTimeContent 


  const previewTextContent = response.result.snippet;
  const labels = response.result.labelIds;

  console.log("function running");

  //+++++++++++++++++++++++++++++++++++ code to test generation++++++++++++++++++++++++++

  // let senderNameContent = 'sender name';
  // let previewTitleContent = 'this is preview title';
  // let previewTextContent = 'this is preview of email body this is preview of email body this is preview of email body this is preview of email body this is preview of email body';
  // let sendTimeContent = '09:23 pm';

  // for (let i = 0; i < 30; i++) {
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const emailPreviewBar = document.createElement("div");
  emailPreviewBar.classList.add("preview-bar");

  const centralLineDiv = document.createElement("div");
  centralLineDiv.classList.add("row", "mt-1", "mb-1", "central-div");

  //left section

  const leftDiv = document.createElement("div");

  leftDiv.classList.add("left-div", "col-md-4");

  const checkbox = document.createElement("div");

  checkbox.classList.add("list-check-box");
  checkbox.innerHTML = '<i class="bi bi-square check-star-flag"></i>';

  leftDiv.appendChild(checkbox);

  const star = document.createElement("div");

  star.classList.add("list-star");

  if (labels.includes("STARRED")) {
    star.innerHTML =
      '<i class="bi bi-star-fill check-star-flag" style="color:yellow"></i>';
  } else {
    star.innerHTML = '<i class="bi bi-star check-star-flag"></i>';
  }

  leftDiv.appendChild(star);

  const important = document.createElement("div");

  important.classList.add("list-important");

  if (labels.includes("IMPORTANT")) {
    important.innerHTML =
      '<i class="bi bi-caret-right-fill check-star-flag" style="color:yellow"></i>';
  } else {
    important.innerHTML =
      '<i class="bi bi-caret-right check-star-flag"></i>';
  }

  leftDiv.appendChild(important);

  const sender = document.createElement("div");
  sender.classList.add("sender-div");

  const sendertext = document.createElement("span");
  sendertext.classList.add("sendertext");

  if (labels.includes("UNREAD")) {
    sendertext.classList.add("bold-text");
  }

  sendertext.innerText = senderNameContent;
  sender.appendChild(sendertext);
  leftDiv.appendChild(sender);

  centralLineDiv.appendChild(leftDiv);

  //right section

  const rightDiv = document.createElement("div");
  rightDiv.classList.add("right-div", "col-md-8", "d-flex");

  const preview = document.createElement("div");
  preview.classList = ("preview", "col", "d-flex");

  const previewTitle = document.createElement("div");
  previewTitle.classList.add("previewTitle");
  if (labels.includes("UNREAD")) {
    previewTitle.classList.add("bold-text");
  }

  previewTitle.innerText = previewTitleContent + " - ";

  const previewText = document.createElement("div");
  previewText.classList.add("previewText");
  previewText.innerText = previewTextContent;

  preview.appendChild(previewTitle);
  preview.appendChild(previewText);

  rightDiv.appendChild(preview);

  const sendTime = document.createElement("div");
  sendTime.classList.add("preview-time", "col-md-3", "col-sm-3","pe-4");
  
  const sendTimeinside = document.createElement("span");
  if (labels.includes('UNREAD')){
      sendTimeinside.classList.add("bold-text");
  }
  sendTimeinside.innerText = sendTimeContent;

  sendTime.appendChild(sendTimeinside);

  rightDiv.appendChild(sendTime);

  centralLineDiv.appendChild(rightDiv);

  emailPreviewBar.appendChild(centralLineDiv);
  return emailPreviewBar;

  // }
}

