let emailListContainer;
let emailBody;
let emailSubject;






function loadPage2Content() {
  fetch("emaillist.html")
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

const API_KEY = API_CONFIG.API_KEY

loadPage2Content();
let userEmail;

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
          fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              // Handle the user profile data
              userEmail = data.emailAddress;

              let userProfileExpandEmail = document.getElementById(
                "user-profile-expand-email"
              );
              userProfileExpandEmail.innerText = data.emailAddress;
              console.log("User Email: ", data.emailAddress);
            })
            .catch((error) => {
              // Handle errors
              console.error("Error fetching user profile:", error);
            });

          fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=" +
              accessToken
          )
            .then((response) => response.json())
            .then((data) => {
              // Handle the user profile data
              console.log("User Profile Data:", data);

              // Access specific profile information
              let userName = data.given_name;
              let userPictureUrl = data.picture;

              let profilePictureImage = document.getElementById(
                "profile-picture-image"
              );
              profilePictureImage.src = userPictureUrl;

              let userProfileExpandImage = document.getElementById(
                "user-profile-expand-image"
              );
              userProfileExpandImage.src = userPictureUrl;

              let userProfileExpandHi = document.getElementById('user-profile-expand-hi');
              userProfileExpandHi.innerText = 'Hi, '+userName+'!';

              

              // Now you can use this information as needed
            })
            .catch((error) => {
              // Handle errors
              console.error("Error fetching user profile:", error);
            });
            createNonUserLabelElements();
         

        
          listLatestEmails(20);
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

    console.log("response: ",response)
    console.log("response messages ",response.result.messages);

    for (const message of response.result.messages) {
      // if (stopListEmails) {
      //   console.log("Function stopped by user");
      //   return; // Stop the function
      // }

      console.log("list latest emails: ", message)
      const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
      console.log("messagePreview: ",messagePreview);

      const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element
     
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
      metadataHeaders: ["Subject", "From", "Date"],
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


  gapi.client.gmail.users.messages.modify({
    userId: 'me',
    id: emailElementId,
    resource: {
      removeLabelIds: ['UNREAD'] // Remove the 'UNREAD' label to mark the message as read
    }
  }, (err, response) => {
    if (err) {
      console.error('Error marking message as read:', err);
    } else {
      console.log('Message marked as read:', response);
    }
  });

  emailBodyContent = await getEmailBodyHtml(emailElementId);
  console.log(emailBodyContent + "))))))))");

  // Update your HTML elements
  emailSubject.innerText = emailSubjectContent;
  emailBody.innerHTML = emailBodyContent;
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
        if (part.mimeType === "text/html" && part.body && part.body.data) {
          // Decode the base64-encoded data using custom function
          console.log(part.body.data);
          const htmlContent = decodeURIComponent(
            escape(atob(part.body.data.replace(/\-/g, "+").replace(/\_/g, "/")))
          );
          console.log(htmlContent);
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
function createNonUserLabelElements() {
  let parentDiv = document.getElementById("main-sidebar");

  gapi.client.gmail.users.labels.list({
    'userId': 'me'
  })
  .then(response => {
    const labelsData = response.result.labels.filter(label => !label.type || label.type !== 'user');

    labelsData.forEach(label => {
      const labelDiv = createLabelElement(label);
      // Assuming you have a container div with the id 'label-container'
      parentDiv.appendChild(labelDiv);
    });
    const generatedFoldersDiv = generateFoldersDiv();
    parentDiv.appendChild(generatedFoldersDiv);
  })
  .catch(error => {
    console.error('Error loading labels:', error);
    // Handle the error, e.g., display an error message in the UI
    const errorDiv = document.createElement('div');
    errorDiv.innerText = 'Error loading labels. Please try again.';
    // Assuming you have a container div with the id 'label-container'
    document.getElementById('label-container').appendChild(errorDiv);
  });
}

// Assuming createLabelElement and getIconClass functions remain unchanged
function createLabelElement(label) {
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('labelDiv', 'row', 'ms-2', 'me-1', 'p-2');

  const iconDiv = document.createElement('div');
  iconDiv.classList.add('bi', 'col-1', 'fs-6', 'me-2');
  iconDiv.classList.add(getIconClass(label.id));

  labelDiv.appendChild(iconDiv);

  const anchor = document.createElement('span');
  const labelName = label.name.toLowerCase();
  anchor.innerHTML = labelName.charAt(0).toUpperCase() + labelName.slice(1);
  anchor.classList.add('col-6', 'labelAnchor', 'fs-6');
  labelDiv.appendChild(anchor);

  // Checking for spam emails
  anchor.onclick = () => {
    document.getElementById('main-list-content').innerHTML = '';

    if (anchor.innerHTML === 'Spam') {
      listSpamEmails(20);
    } else if (anchor.innerHTML === 'Draft') {
      listDraftEmails(20);
    } else if (anchor.innerHTML === 'Sent') {
      listSentEmails(20);
    } else if (anchor.innerHTML === 'Trash') {
      listTrashEmails(20);
      } else if(anchor.innerHTML == "Inbox"){
        listLatestEmails(20);
      } else if(anchor.innerHTML == "Important"){
        listImportantEmails(20);
      } else if(anchor.innerHTML == "Starred"){
        listStarredEmails(20);
    }
  };

  return labelDiv;
}

function getIconClass(labelId) {
  switch (labelId.toLowerCase()) {
    case 'chat':
      return 'bi-chat-left-text';
    case 'sent':
      return 'bi-send';
    case 'inbox':
      return 'bi-inbox';
    case 'trash':
      return 'bi-trash';
    case 'snoozed':
      return 'bi-clock';
    case 'draft':
      return 'bi-file-earmark';
    case 'spam':
      return 'bi-exclamation-octagon';
    case 'starred':
      return 'bi-star';
    case 'important':
      return 'bi-flag';
    case 'unread':
      return 'bi-flag';
    case 'category_updates':
      return 'bi-exclamation-circle';
    case 'category_promotions':
      return 'bi-tag';
    case 'category_social':
      return 'bi-person-lines-fill';
    default:
      return 'bi-inbox';
  }
}

// Call the function to create non-user label elements


//Function to list and display spam emails
async function listSpamEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["SPAM"],
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

//Function to list and display draft emails
async function listDraftEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["DRAFT"],
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

//Function to list and display sent emails
async function listSentEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["SENT"],
      maxResults: numberOfEmails,
    });
    

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

//Function to list and display trash emails
async function listTrashEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["TRASH"],
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

//Function to list and display important emails
async function listImportantEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["IMPORTANT"],
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

//Function to list and display trash emails
async function listStarredEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["STARRED"],
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

function loadEmailContent(response) {
  var shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const previewTitleContent = response.result.payload.headers.find(
    (header) => header.name === "Subject"
  ).value;
  let senderNameContent =
    response.result.payload.headers
      .find((header) => header.name === "From")
      .value.split("<")[0] == ""
      ? response.result.payload.headers.find((header) => header.name === "From")
          .value
      : response.result.payload.headers
          .find((header) => header.name === "From")
          .value.split("<")[0];
  if (senderNameContent.length > 19) {
    senderNameContent = senderNameContent.slice(0, 19) + ".";
  }
  const sndDateTime = new Date(
    response.result.payload.headers.find(
      (header) => header.name === "Date"
    ).value
  );
  console.log("snddte:" + sndDateTime);
  let today = new Date();
  console.log("snddte:" + today);

  if (
    today.getFullYear() === sndDateTime.getFullYear() &&
    today.getMonth() === sndDateTime.getMonth() &&
    today.getDate() === sndDateTime.getDate()
  ) {
    var sendTimeContent = sndDateTime
      .toLocaleTimeString()
      .replace(/:\d{2} /, " ");
    console.log("snddte:" + sendTimeContent);
  } else if (today.getFullYear() === sndDateTime.getFullYear()) {
    var sendTimeContent =
      shortMonthNames[parseInt(sndDateTime.getMonth())] +
      " " +
      sndDateTime.getDate();
    console.log("snddte:" + sendTimeContent);
  } else {
    var sendTimeContent = sndDateTime.toLocaleDateString();
    console.log("snddte:" + sendTimeContent);
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
    important.innerHTML = '<i class="bi bi-caret-right check-star-flag"></i>';
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
  sendTime.classList.add("preview-time", "col-md-3", "col-sm-3", "pe-4");

  const sendTimeinside = document.createElement("span");
  if (labels.includes("UNREAD")) {
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

//profile view +++++++++++++++++++++++++++++++++++===

let profiePictureDiv = document.getElementById("profile-picture");

profiePictureDiv.onclick = () => {
  let userProfile = document.getElementById("user-profile-expand");
  userProfile.style = "display:block";
};

let profileCloseButton = document.getElementById("user-profile-expand-close");

profileCloseButton.onclick = () => {
  let userProfile = document.getElementById("user-profile-expand");
  userProfile.style = "display:none";
};

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    localStorage.removeItem("accessToken");
    window.location.href = "index.html";
  }
}

let userProfileDiv = document.getElementById("user-profile-expand");
let userProfileImage = document.getElementById("profile-picture-image");

// Show the div when clicking a button or any other element
document.addEventListener("click", function (event) {
  // Check if the clicked element is NOT the div or a child of the div
  if ( 
    event.target !== userProfileDiv &&
    !userProfileDiv.contains(event.target) &&
    event.target !== userProfileImage &&
    !userProfileImage.contains(event.target)
  ) {
    // Hide the div
    userProfileDiv.style.display = "none";
  }
}); 

//app drawer display

let menuIcon = document.getElementById("icon-menu");
let appDivOpen = document.getElementById("app-drawer-expand-container");
menuIcon.onclick = () => {
  appDivOpen.style.display = 'block';
  console.log("App drawer clicked");
};

//hide the app drawer when clicked outside


document.addEventListener("click", function (event) {
  // Check if the clicked element is NOT the div or a child of the div
  if (
    event.target !== appDivOpen &&
    !appDivOpen.contains(event.target) &&
    event.target !== menuIcon &&
    !menuIcon.contains(event.target)
  ) {
    // Hide the div
    appDivOpen.style.display = 'none';
  } 
});

// function to dislay dropdrown list to change screen layout
function displayLayoutDiv(){
  let layoutDiv = document.getElementById('main-list-header-right-viewSelect');
  let layoutOptionDiv = document.getElementById('layout-div-expand');
  layoutOptionDiv.style.display = 'none';
  layoutOptionDiv.style.flexDirection = 'column';
  layoutOptionDiv.innerHTML = "";

  let layoutOptionOne = document.createElement('button');
  let layoutOptionTwo = document.createElement('button');
  let layoutOptionThree = document.createElement('button');

  layoutOptionOne.innerHTML = "No Split";
  layoutOptionTwo.innerHTML = "Vertical Split";
  layoutOptionThree.innerHTML = "Horizontal Split ";

  layoutOptionDiv.appendChild(layoutOptionOne);
  layoutOptionDiv.appendChild(layoutOptionTwo);
  layoutOptionDiv.appendChild(layoutOptionThree);

  document.addEventListener('click', function(event) {
      // Toggling the visiblity of the dropdown menu
      if(layoutOptionDiv.style.display=='none'){
        layoutOptionDiv.style.display = 'flex';
      } else if(layoutOptionDiv.style.display=='flex'){
        layoutOptionDiv.style.display = 'none';
      }

      if (!layoutOptionDiv.contains(event.target)&&!layoutDiv.contains(event.target)) {
          // Handle the click outside the div
          layoutOptionDiv.style.display = 'none';
      }
  });
  

  //function to change layout into vertical split
  function verticalSplit(){
  document.addEventListener('click',async function(event){
    if(layoutOptionTwo.contains(event.target)){
      // stopListEmails = true;
      // Function to load HTML content into a target div
      fetch('verticalsplit.html')
          .then(response => response.text())
          .then(async (data) => {
              document.getElementById("display-area").innerHTML = data;
              console.log("html loaded sucessfully");

              //changing the icon to toggle views
              let layoutIcon = document.getElementById('main-list-header-right-view');
              let verticalSplitIcon = document.createElement('span');
              verticalSplitIcon.innerHTML = '<span class="material-symbols-outlined">vertical_split</span>';
              layoutIcon.innerHTML = '';
              await layoutIcon.appendChild(verticalSplitIcon);
              
              // stopListEmails = false;
              console.log("latest emails in split view 1")
              // await listLabels();
              await listVerticalSplitEmails(30);
              console.log("latest emails in split view 2")  
          })
          .catch(error => console.error('Error loading HTML:', error));
    }
  });
  }
  verticalSplit();
  
  //Function to change layout into default view
  function defaultView(){
    document.addEventListener('click',async function(event){
      if(layoutOptionOne.contains(event.target)){
        // stopListEmails = true;
        fetch("./html/emaillist.html")
        .then(response => response.text())
        .then(async(data) => {
          document.getElementById("display-area").innerHTML = data; 
          console.log("email list html loaded sucessfully");
          // stopListEmails = false;
          // await listLabels();
          listDefaultSplitEmails(50);
        })
      }
      });
  }
  defaultView();
 
  //function to change layout to horizontal split
  function horizontalSplit(){
    document.addEventListener('click',async function(event){
      if(layoutOptionThree.contains(event.target)){
        stopListEmails = true;
        // Function to load HTML content into a target div
        fetch('horizontalsplit.html')
            .then(response => response.text())
            .then(async (data) => {
                document.getElementById("display-area").innerHTML = data;
                console.log("horizontalsplit html loaded sucessfully");

                //changing the icon to toggle views
                let layoutIcon = document.getElementById('main-list-header-right-view');
                let verticalSplitIcon = document.createElement('span');
                verticalSplitIcon.innerHTML = '<span class="material-symbols-outlined">horizontal_split</span>';
                layoutIcon.innerHTML = '';
                await layoutIcon.appendChild(verticalSplitIcon);
                
                stopListEmails = false;
                console.log("latest emails in split view 1")
                // await listLabels();
                await listHorizontalSplitEmails(30);
                console.log("latest emails in split view 2")  
            })
            .catch(error => console.error('Error loading HTML:', error));
      }
    });
  }
  horizontalSplit();
}

//function to list emails in split view

async function listVerticalSplitEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: numberOfEmails,
    });

    console.log(response.result.messages);
    document.getElementById('main-list-content').style.maxHeight = '100vh'
    for (const message of response.result.messages) {

      console.log("list latest emails: ", message)
      const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
      console.log(messagePreview);

      const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element

      emailListElement.setAttribute("id", message.id);
      emailListElement.onclick = () => clickHandleSplit(message.id);
      
      document.getElementById('main-list-content').appendChild(emailListElement);
    }
  } catch (error) {
    console.error("Error listing emails:", error);
  }
}

//function to display emails in horizontal view
async function listHorizontalSplitEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: numberOfEmails,
    });
    document.getElementById('main-list-content').style.maxHeight = '30vh'
    console.log(response.result.messages);
    
    for (const message of response.result.messages) {

      console.log("list latest emails: ", message)
      const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
      console.log(messagePreview);

      const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element

      emailListElement.setAttribute("id", message.id);
      emailListElement.onclick = () => clickHandleSplit(message.id);
      
      document.getElementById('main-list-content').appendChild(emailListElement);
      
    }
  } catch (error) {
    console.error("Error listing emails:", error);
  }
}

//function to display emails in default view
async function listDefaultSplitEmails(numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: numberOfEmails,
    });

    console.log(response.result.messages);
    document.getElementById('main-list-content').style.maxHeight = '100vh'
    for (const message of response.result.messages) {
      // if (stopListEmails) {
      //   console.log("Function stopped by user");
      //   return; // Stop the function
      // }

      console.log("list latest emails: ", message)
      const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
      console.log(messagePreview);

      const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element

      emailListElement.setAttribute("id", message.id);
      emailListElement.onclick = () => clickHandle(message.id);
      
      document.getElementById('main-list-content').appendChild(emailListElement);
    }
  } catch (error) {
    console.error("Error listing emails:", error);
  }
}

//function to handle the click in split view

async function clickHandleSplit(emailElementId) {
  fetch("mail.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the loaded content into the container
      document.getElementById("email-split-view").innerHTML = '';
      document.getElementById("email-split-view").innerHTML = data;
      document.getElementById("email-split-view").style.overflowX = 'scroll';      

      emailBody = document.getElementById("body-content");
      emailSubject = document.getElementById("email-subject");
    })
    .catch((error) => console.error("Error:", error));

  emailSubjectContent = await getSendSubject(emailElementId);
  emailBodyContent = await getEmailBodyHtml(emailElementId);

  // Update your HTML elements
  emailSubject.innerText = emailSubjectContent;
  emailBody.innerHTML = emailBodyContent
}

//toggle between views
function toggleViews(){
  document.addEventListener('DOMContentLoaded', function() {
    let toggleDiv = document.getElementById('main-list-header-right-view');

    if (toggleDiv) {
      document.addEventListener('click', function(event) {
        if (toggleDiv.contains(event.target)) {
          console.log("toggle div clicked");
        }
      });
    } else {
      console.error("Element with ID 'main-list-header-right-view' not found");
    }
  });
  
}
toggleViews();




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



