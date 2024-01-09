 let mainListContent = document.getElementById('main-list-content');
//let currentPage = 1;
let nextPageToken = null;
let displayedEmailIds = [];
//let nextPageTokens = [];
let pageTokens = [] // extra
let pageCount = 1;
 let messageIdList=[]


function loadEmailContent(response,messageId) {
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
    
    let today = new Date();
   
  
    if (today.getFullYear()===sndDateTime.getFullYear() &&
        today.getMonth()===sndDateTime.getMonth() &&
        today.getDate()===sndDateTime.getDate()){
            var sendTimeContent=sndDateTime.toLocaleTimeString().replace(/:\d{2} /, ' ');
                   
        }
    else if(today.getFullYear() ===sndDateTime.getFullYear()){
        var sendTimeContent=   shortMonthNames[parseInt( sndDateTime.getMonth())] +' '+ sndDateTime.getDate();
      
  
    }
    else{
        var sendTimeContent=sndDateTime.toLocaleDateString();
      
  
    }
  
    
  
   // const sendTimeContent 
  
  
    const previewTextContent = response.result.snippet;
    const labels = response.result.labelIds;
  
    
  
  
  
    const emailPreviewBar = document.createElement("div");
    emailPreviewBar.classList.add("preview-bar");
  
    const centralLineDiv = document.createElement("div");
    centralLineDiv.classList.add("row", "mt-1", "mb-1", "central-div");
  
    //left section
  
    const leftDiv = document.createElement("div");
  
    leftDiv.classList.add("left-div", "col-md-4");
  
    const checkbox = document.createElement("div");
  
    const checkboxIcon = document.createElement('i');
   checkboxIcon.classList.add('bi', 'bi-square', 'check-star-flag');
   checkboxIcon.setAttribute('id',  'checkBoxIcon'+messageId);
   checkboxIcon.addEventListener('click', toggleCheckbox);
   checkbox.appendChild(checkboxIcon);

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
    emailPreviewBar.classList.add('clickable');
    return emailPreviewBar;
  
    // }
  }
//=============================================================================================

  // async function listLatestEmails(numberOfEmails) {
  //   try {
  //     const response = await gapi.client.gmail.users.messages.list({
  //       userId: "me",
  //       labelIds: ["INBOX"],
  //       maxResults: numberOfEmails,
  //     });
  
  //     if(isSearchActive){
  //       console.log("in a search")
  //       return ;
  //     }
  
  //     for (const message of response.result.messages) {
  //       const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
       
  
  //       const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element
        
  //       emailListElement.setAttribute("id", message.id);
  //       emailListElement.draggable=true
  //       emailListElement.addEventListener('dragstart', handleDragStart);
  //       emailListElement.onclick = () =>clickHandle(message.id)
  //       emailListContainer.appendChild(emailListElement);
  //     }
  //   } catch (error) {
  //     console.error("Error listing emails:", error);
  //   }
  // }
  
  async function listLatestEmails(numberOfEmails, pageToken = undefined) {
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"],
        maxResults: numberOfEmails,
        pageToken: pageToken,
      });
  
      console.log(response.result.messages);
  
      // Clear the displayedEmailIds array when loading a new set
      displayedEmailIds = [];
      
      messageIdList=[]
      for (const message of response.result.messages) {
        const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
       
        if(isSearchActive){
          console.log("stopped due to search")
          return;
        }
        const emailListElement = loadEmailContent(messagePreview,message.id); //calling function to generate an email preview element
        
        emailListElement.setAttribute("id", message.id);

        emailListElement.draggable = true
        emailListElement.addEventListener('dragstart', handleDragStart);

        emailListElement.onclick = () => clickHandle(message.id);
  
        emailListContainer.appendChild(emailListElement);
        displayedEmailIds.push(message.id);
      }
  
      // Update nextPageToken only if it's a valid value
      nextPageToken = response.result.nextPageToken || undefined;
      pageTokens.push(nextPageToken);
    } catch (error) {
      console.error("Error listing emails:", error);
    }
  }
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // function to return a preview of email
  async function getEmailPreview(messageId) {
    
    try {
      const response = gapi.client.gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "metadata",
        metadataHeaders: ["Subject", "From","Date"],
      });
      
      return response;
    } catch (error) {
      console.error("Error getting email preview:", error);
    }
  }



  async function listEmailsByLabel(label, numberOfEmails) {
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: "me",
        labelIds: [label],
        maxResults: numberOfEmails,
      });
  for (const message of response.result.messages) {
        const messagePreview = await getEmailPreview(message.id);
        
  
        const emailListElement = loadEmailContent(messagePreview);
        emailListElement.setAttribute("id", message.id);
        emailListElement.onclick = () => clickHandle(message.id);
  
        emailListContainer.appendChild(emailListElement);
      }
    } catch (error) {
      console.error(`Error listing ${label} emails:`, error);
    }
  }

  function handleDragStart(event) {
    // Set the dragged data and provide a visual feedback
    event.dataTransfer.setData('text', event.target.id);
  
  }




  function handleBackButton() {
 // Assuming this function is defined to load the content on page 2
  
    switch (source) {
      case "Spam":
        listEmailsByLabel('SPAM', 20);
        console.log("Spam back Clicked");
        break;
  
      case "Draft":
        listEmailsByLabel('DRAFT', 20);
        console.log("Draft back clicked");
        break;
  
      case "Sent":
        listEmailsByLabel('SENT', 20);
        console.log("Sent back clicked");
        break;
  
      case "Trash":
        listEmailsByLabel('TRASH', 20);
        console.log("Trash back clicked");
        break;
  
      // Add more cases if needed
  
      default:
        // Handle default case or do nothing
        break;
    }
  }
  

  function toggleCheckbox(event) {
    event.preventDefault();
    event.stopPropagation();

    const checkboxIcon = document.getElementById(event.target.id);

    if (checkboxIcon) {
        const extractedMessageId = extractMessageId(checkboxIcon.id);

        if (checkboxIcon.classList.contains('checked')) {
            checkboxIcon.classList.remove('checked');
            deleteMessageId(extractedMessageId);
        } else {
            checkboxIcon.classList.add('checked');
            messageIdList.push(extractedMessageId);
        }

        toggleClass(checkboxIcon, 'bi-square');
        toggleClass(checkboxIcon, 'bi-check-square');

        console.log(messageIdList);
    } else {
        console.error('Checkbox icon not found.');
    }
    const groupDelete = document.getElementById('group-delete');
    const groupMarkAsRead = document.getElementById('group-mark-as-read');

    if (messageIdList.length > 0) {
      // Toggle the display property
      groupDelete.style.display = "block"
      groupMarkAsRead.style.display = "block"
    } else {
      // If messageIdList is empty, hide the group actions
      groupDelete.style.display = 'none';
      groupMarkAsRead.style.display = 'none';
    }
  

}

function deleteMessageId(messageId) {
    const index = messageIdList.indexOf(messageId);
    if (index !== -1) {
        messageIdList.splice(index, 1);
        console.log(`MessageId ${messageId} removed from messageIdList`);
    } else {
        console.error(`MessageId ${messageId} not found in messageIdList`);
    }
}

function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}

function extractMessageId(id) {
    const index = id.indexOf('checkBoxIcon');
    if (index !== -1) {
        return id.substring(index + 'checkBoxIcon'.length);
    } else {
        console.error('Invalid checkbox ID format:', id);
        return '';
    }
}

function moveToTrash(messageId) {
  let messageDiv = document.getElementById('message-display-div');

  gapi.client.gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    resource: {
      addLabelIds: ['TRASH'],
      removeLabelIds: []  // Remove all existing label IDs
    }
  }).then(function(response) {
    console.log('Message moved to trash:', response);
    messageDiv.innerHTML="message deleted";
    messageDiv.style.display = 'block';
    hideMessageDiv();
   
  }, function(error) {
    console.error('Error moving message to trash:', error);
  });
}



function markAsRead(messageId) {
  // Use Gmail API to mark the email as unread by removing the 'READ' label
  gapi.client.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      resource: {
          removeLabelIds: ['UNREAD']  // Remove 'READ' label to mark as unread
      }
  }).then(response => {
      console.log('Email marked as unread:', response.result);
  }, error => {
      console.error('Error marking email as unread:', error);
  });
}

async function groupDelete() {
  console.log("reached");

  let messageDiv = document.getElementById('message-display-div');
  await (messageIdList.map(async messageId => {
       moveToTrash(messageId);
  }));
  messageDiv.innerHTML="messages deleted";
  messageDiv.style.display = 'block';
  hideMessageDivReload();

  console.log("Group delete completed");


}

async function groupMarkAsRead() {
  let messageDiv = document.getElementById('message-display-div');
  console.log("reached");


  await (messageIdList.map(async messageId => {
     markAsRead(messageId);
  }));

  console.log("Group mark as read completed");
  messageDiv.innerHTML="messages marked read";
  messageDiv.style.display = 'block';
  hideMessageDivReload();
  
  }  

  async function nextSetEmailLoad() {
    try {
      document.getElementById("main-list-content").innerHTML = "";
      await listLatestEmails(20, nextPageToken);
      pageCount++;
    } catch (error) {
      console.error("Error loading next set of emails:", error);
    }
  }
 

  async function prevSetEmailLoad() {
    try {
      document.getElementById("main-list-content").innerHTML = "";
      
      // Calculate the previous page count
      let prevPageCount = Math.max(pageCount - 1, 1);
  
      // Retrieve the previous page token based on the pageCount
      nextPageToken = pageTokens[prevPageCount - 1];
  
      // Update the pageCount to the previous value
      pageCount = prevPageCount;

      if(pageCount == 1){
        await listLatestEmails(20)
      } else{
        await listLatestEmails(20, nextPageToken);
      }
  
      // Call listLatestEmails with the retrieved page token
      
    } catch (error) {
      console.error("Error loading previous set of emails:", error);
    }
}


function hideMessageDivReload() { //hide message after 5 seconds
  setTimeout(function () {
    let messageDiv = document.getElementById('message-display-div');
    messageDiv.style.display = 'none';
    location.reload()
  }, 5000);
}