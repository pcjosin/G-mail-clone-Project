let emailListContainer;
let emailBody;
let emailSubject;
let isSearchActive=false
let source="Inbox";
let currentMessageId;






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
         

        
          listLatestEmails(30);
        } else {
          document.getElementById("nextpage-content").innerText =
            "Access token not found.";
        }
      });
  });
}





// Call the function to create non-user label elements





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

// let menuIcon = document.getElementById("icon-menu");
// let appDivOpen = document.getElementById("app-drawer-expand-container");
// menuIcon.onclick = () => {
//   appDivOpen.style.display = 'block';
//   console.log("App drawer clicked");
// };

// //hide the app drawer when clicked outside


// document.addEventListener("click", function (event) {
//   // Check if the clicked element is NOT the div or a child of the div
//   if (
//     event.target !== appDivOpen &&
//     !appDivOpen.contains(event.target) &&
//     event.target !== menuIcon &&
//     !menuIcon.contains(event.target)
//   ) {
//     // Hide the div
//     appDivOpen.style.display = 'none';
//   } 
// });



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 
  
  
  
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
      fetch('../html/verticalsplit.html')
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
              
              
              console.log("latest emails in split view 1")
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
        fetch("../html/emaillist.html")
        .then(response => response.text())
        .then(async(data) => {
          document.getElementById("display-area").innerHTML = data; 
          console.log("email list html loaded sucessfully");
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
        fetch('../html/horizontalsplit.html')
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
                
                console.log("latest emails in split view 1")
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

      const emailListElement = loadVerticalEmailContent(messagePreview); //calling function to generate an email preview element

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
  fetch("../html/mail.html")
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



//functions to handle next and prev button inside mail open window.

function getPrevMessageId(currentMessageId) {
  return new Promise((resolve, reject) => {
      gapi.client.gmail.users.messages.list({
          'userId': 'me',
      }).then(response => {
          const messages = response.result.messages;
          const currentIndex = messages.findIndex(message => message.id === currentMessageId);

          if (currentIndex !== -1 && currentIndex < messages.length - 1) {
              const prevMessageId = messages[currentIndex - 1].id;
              resolve(prevMessageId);
          } else {
              reject('No next message found.');
          }
      }).catch(error => {
          reject('Error fetching message list: ' + error.message);
      });
  });
}

async function prevButtonHandle(){
  // Use the currentMessageId variable
  if (currentMessageId) {
    // Use currentMessageId to fetch the next email
    let prevMessageId = await getPrevMessageId(currentMessageId);
    if (prevMessageId) {
      clickHandle(prevMessageId);
    } else {
      console.log("No more emails to display.");
    }
  } else {
    console.log("No current email selected.");
  }
}

function getNextMessageId(currentMessageId) {
  return new Promise((resolve, reject) => {
      gapi.client.gmail.users.messages.list({
          'userId': 'me',
      }).then(response => {
          const messages = response.result.messages;
          const currentIndex = messages.findIndex(message => message.id === currentMessageId);

          if (currentIndex !== -1 && currentIndex < messages.length - 1) {
              const nextMessageId = messages[currentIndex + 1].id;
              resolve(nextMessageId);
          } else {
              reject('No next message found.');
          }
      }).catch(error => {
          reject('Error fetching message list: ' + error.message);
      });
  });
}

async function nextButtonHandle() {
  // Use the currentMessageId variable
  if (currentMessageId) {
    // Use currentMessageId to fetch the next email
    let nextMessageId = await getNextMessageId(currentMessageId);
    if (nextMessageId) {
      clickHandle(nextMessageId);
    } else {
      console.log("No more emails to display.");
    }
  } else {
    console.log("No current email selected.");
  }
}





//Function to search a query regarding emails
 
async function searchMessages() {
  // Specify your search query
  let searchBoxInput = document.getElementById('search-input-box');
  document.addEventListener('input', function(event){
    if(event.target.contains(searchBoxInput)){
      console.log("search box changed");
      isSearchActive = true;
      let query = document.getElementById('search-input-box').value;
      let cancelButtonSvg = document.getElementById('cancel-button-svg');
      cancelButtonSvg.style.visibility = 'visible'
 
      document.addEventListener('click', function(event){
        if(event.target.contains(cancelButtonSvg)){
          document.getElementById('search-input-box').value = ""
          cancelButtonSvg.style.visibility = 'hidden'
          emailListContainer.innerHTML = ''
          //listLatestEmails()
        }
      })
 
      // Performing the search using users.messages.list
      gapi.client.gmail.users.messages.list({
      'userId': 'me',
      'q': query,
      maxResults: 30,
      }).then(function(response) {
        console.log("response: ", response)
      let messages = response.result.messages;
      console.log("Search messages: ", messages)
      if (messages && messages.length > 0) {
          console.log('Messages:');
          emailListContainer.innerHTML = ''
          for (let i = 0; i < messages.length; i++) {
              console.log('Message ID: ' + messages[i].id);
              listSearchedEmails(messages[i].id)
          }
          isSearchActive = false;
      } else {
          console.log('No messages found.');
      }
      });
    }
  })
}
searchMessages()
 
async function listSearchedEmails(message) {
  try {
      const messagePreview = await getEmailPreview(message); // calling function to get a preview of email
      console.log("messagePreview: ",messagePreview);
 
      const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element
      console.log("emailListElement: ",emailListElement);
 
      emailListElement.setAttribute("id", message);
      emailListElement.onclick = () => clickHandle(message);
 
      emailListContainer.appendChild(emailListElement);
  } catch (error) {
    console.error("Error listing emails:", error);
  }
}

function handleBackButton() {
  switch (source) {
    case "Spam":
      loadPage2Content();
      listEmailsByLabel('SPAM', 30);
      break;
      console.log("Spam back Clicked");
 
    case "Draft":
      loadPage2Content();
      listEmailsByLabel('DRAFT', 30);
      break;
      console.log("Draft back clicked");
 
    case "Sent":
      loadPage2Content();
      listEmailsByLabel('SENT', 30);
      break;
      console.log("Sent back clicked");
    case "Inbox":
      loadPage2Content();
      listEmailsByLabel('INBOX', 30)  
    case "Trash":
      loadPage2Content();
      listEmailsByLabel('TRASH', 30);
      break;
      console.log("Sent back clicked");
    case "Important":
        loadPage2Content();
        listEmailsByLabel('IMPORTANT', 30);
        break;
    case "Starred":
          loadPage2Content();
          listEmailsByLabel('STARRED', 30);
          break;
    case "Unread":
        loadPage2Content();
        listEmailsByLabel('UNREAD', 30);
        break;
  }  
}
