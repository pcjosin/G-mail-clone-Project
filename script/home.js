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
