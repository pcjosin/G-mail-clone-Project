
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '280715447136-ejl9bcsuj842het5ifgbj7naj1jjqml3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAGzP3_IUN8Ds05jBNckdYrFR6jyDeoeEo';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';


/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
 
}


/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons()
  

}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons()
  
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      
      
      localStorage.setItem('accessToken', resp.access_token);
   
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listLabels();
      listLatestEmails(10);
      window.location.href = 'home.html';
    };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}

  /**
   * Print all Labels in the authorized user's inbox. If no labels
   * are found an appropriate message is printed.
   */
  async function listLabels() {
    let response;
    try {
      response = await gapi.client.gmail.users.labels.list({
        'userId': 'me',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const labels = response.result.labels;
    if (!labels || labels.length == 0) {
      document.getElementById('content').innerText = 'No labels found.';
      return;
    }
    // Flatten to string to display
    const output = labels.reduce(
        (str, label) => `${str}${label.name}\n`,
        'Labels:\n');
    document.getElementById('content').innerText = output;
  }


  function listLatestEmails(numberOfEmails) {
gapi.client.gmail.users.messages.list({
'userId': 'me',
'labelIds': ['INBOX'], // Specify the label ID for the inbox.
'maxResults': numberOfEmails, // Specify the number of emails to retrieve.
}).then(function(response) {
// Handle the list of latest emails in the response.
console.log(response.result.messages);
// Now you can iterate over the messages and fetch more details if needed.
response.result.messages.forEach(function(message) {
  console.log(getEmailDetails(message.id));
});
}, function(error) {
console.error('Error listing emails:', error);
});
}
function getEmailDetails(messageId) {
gapi.client.gmail.users.messages.get({
'userId': 'me',
'id': messageId,
}).then(function(response) {

const fromHeader = response.result.payload.headers.find(header => header.name === 'From');
if (fromHeader) {
  const senderInfo = parseSenderInfo(fromHeader.value);
  console.log('Sender Email:', senderInfo.email);
  console.log('Sender Name:', senderInfo.name);
}


// Handle the details of the email in the response.
const snippet = response.result.snippet;
console.log('Email Snippet:', snippet);
}, function(error) {
console.error('Error getting email details:', error);
});
}
function parseSenderInfo(fromHeaderValue) {
// Parse the "From" header value to extract email and name
const match = fromHeaderValue.match(/^(.*) <(.+)>$/);
if (match) {
return {
  name: match[1].trim(),
  email: match[2].trim(),
};
} else {
// If the format is not as expected, assume the whole string is the email
return {
  name: null,
  email: fromHeaderValue.trim(),
};
}
}
