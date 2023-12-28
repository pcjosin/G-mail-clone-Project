// const CLIENT_ID =
//   "280715447136-ejl9bcsuj842het5ifgbj7naj1jjqml3.apps.googleusercontent.com";
// const API_KEY = "AIzaSyAGzP3_IUN8Ds05jBNckdYrFR6jyDeoeEo";


// const accessToken = localStorage.getItem("accessToken");

// function gapiLoaded() {
//     gapi.load("client", () => {
//       gapi.client
//         .init({
//           apiKey: API_KEY,
//           discoveryDocs: [
//             "https://gmail.googleapis.com/gmail/v1/users/{userId}/messages/send",
//           ],
//         })
//         .then(() => {
//           // Set the access token in gapi.client
//           if (accessToken) {
//             gapi.client.setToken({ access_token: accessToken });
  
//             // Call the listLabels function
//             // listLabels();
//             // listLatestEmails(50);
//           } else {
//             document.getElementById("nextpage-content").innerText =
//               "Access token not found.";
//           }
//         });
//     });
//   }
// async function initializeGapiClient() {
//   await gapi.client.init({
//     apiKey: API_KEY,
//     discoveryDocs: [DISCOVERY_DOC],
//   });
//   gapiInited = true;
//   maybeEnableButtons();
// }

// function gisLoaded() {
//   tokenClient = google.accounts.oauth2.initTokenClient({
//     client_id: CLIENT_ID,
//     scope: SCOPES,
//     callback: "", // defined later
//   });
//   gisInited = true;
//   maybeEnableButtons();
// }

// function handleAuthClick() {

//   gapi.auth2.getAuthInstance().signIn().then(() => {
//     // User signed in. Now you can make API calls.
//     sendEmail();
//   });


//   tokenClient.callback = async (resp) => {
//     if (resp.error !== undefined) {
//       throw (resp);
//     }
//     document.getElementById('signout_button').style.visibility = 'visible';
//     document.getElementById('authorize_button').innerText = 'Refresh';
//     await listLabels();
//   };

//   if (gapi.client.getToken() === null) {
//     // Prompt the user to select a Google Account and ask for consent to share their data
//     // when establishing a new session.
//     tokenClient.requestAccessToken({ prompt: 'consent' });
//   } else {
//     // Skip display of account chooser and consent dialog for an existing session.
//     tokenClient.requestAccessToken({ prompt: '' });
//   }
// }



// function sendEmail() {
//   const recipientEmail = document.getElementById("email-container").value;
//   const emailMessage = document.getElementById("message-container").value;

//   if (!recipientEmail || !emailMessage) {
//     alert("Recipient email and message are required");
//     return;
//   }

//   const rawMessage = btoa(
//     `To: ${recipientEmail}\r\n` +
//       "Subject: Your Email Subject Here\r\n" +
//       'Content-Type: text/plain; charset="UTF-8"\r\n\r\n' +
//       emailMessage
//   );

//   const request = gapi.client.gmail.users.messages.send({
//     userId: "me",
//     resource: {
//       raw: rawMessage,
//     },
//   });

//   request.execute((response) => {
//     console.log(response);
//     alert("Email sent successfully!");
//   });
// }


/////////////////////////////////////////////////////////////////////////////////////

// Your API key and client ID
const CLIENT_ID = "280715447136-ejl9bcsuj842het5ifgbj7naj1jjqml3.apps.googleusercontent.com";
const API_KEY = "AIzaSyAGzP3_IUN8Ds05jBNckdYrFR6jyDeoeEo";

// Define Gmail API discovery document
const GMAIL_DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";

// Access token obtained during authentication
const accessToken = localStorage.getItem("accessToken");

// Function to handle the loaded state of gapi
function gapiLoaded() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: [GMAIL_DISCOVERY_DOC],
      // scope: "https://www.googleapis.com/auth/gmail.send",
    }).then(() => {
      // Set the access token if available
      if (accessToken) {
        gapi.auth2.getAuthInstance().signIn();
      } else {
        console.error("Access token not found.");
      }
    });
  });
}

// Function to handle user authentication
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    // User signed in. Now you can make API calls.
    sendEmail();
  });
}

// Function to send an email using Gmail API
function sendEmail() {
  const recipientEmail = document.getElementById("email-container").value;
  const emailMessage = document.getElementById("message-container").value;

  if (!recipientEmail || !emailMessage) {
    alert("Recipient email and message are required");
    return;
  }

  const rawMessage = btoa(
    `To: ${recipientEmail}\r\n` +
    "Subject: Your Email Subject Here\r\n" +
    'Content-Type: text/plain; charset="UTF-8"\r\n\r\n' +
    emailMessage
  );

  const request = gapi.client.gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: rawMessage,
    },
  });

  request.execute((response) => {
    console.log(response);
    alert("Email sent successfully!");
  });
}

