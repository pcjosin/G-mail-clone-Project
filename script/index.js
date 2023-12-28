
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '280715447136-ejl9bcsuj842het5ifgbj7naj1jjqml3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAGzP3_IUN8Ds05jBNckdYrFR6jyDeoeEo';
// import { API_CONFIG } from '../config/keys.js';

// // Destructure the named export to get CLIENT_ID and API_KEY
// const { CLIENT_ID, API_KEY } = API_CONFIG;

// Discovery doc URL for APIs used by the quick  start
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.settings.basic','https://www.googleapis.com/auth/userinfo.profile'];

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
    scope: SCOPES.join(' '),
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


    localStorage.setItem('accessToken', resp.access_token); //++++++++++++++++++++++++++++ encrypt and set

    document.getElementById('authorize_button').innerText = 'Refresh';
    // await listLabels();
    // listLatestEmails(10);
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





