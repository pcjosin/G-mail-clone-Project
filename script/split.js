
  
  
  
  
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
                
                // stopListEmails = false;
                console.log("latest emails in split view 1")
                // await createNonUserLabelElements();
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
  
  
  
  
  
  
  
  
  