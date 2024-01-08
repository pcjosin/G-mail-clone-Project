 let mainListContent = document.getElementById('main-list-content');
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

  async function listLatestEmails(numberOfEmails) {
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"],
        maxResults: numberOfEmails,
      });
  
      if(isSearchActive){
        console.log("in a search")
        return ;
      }
      
      messageIdList=[]
      for (const message of response.result.messages) {
        const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
       
  
        const emailListElement = loadEmailContent(messagePreview,message.id); //calling function to generate an email preview element
        
        emailListElement.setAttribute("id", message.id);
        emailListElement.draggable=true
        emailListElement.addEventListener('dragstart', handleDragStart);
        emailListElement.onclick = () =>clickHandle(message.id)
        emailListContainer.appendChild(emailListElement);
      }
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



function markAsUnread(messageId) {
    // Use Gmail API to mark the email as unread
    gapi.client.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      resource: {
        addLabelIds: ['UNREAD']
      }
    }).then(response => {
      console.log('Email marked as unread:', response.result);
    }, error => {
      console.error('Error marking email as unread:', error);
    });
  }



  function groupDelete() {
    // Iterate over the message IDs in the messageIdList and call moveToTrash for each ID
    messageIdList.forEach(messageId => {
        moveToTrash(messageId);
    });
}

function groupMarkAsUnread() {
  // Iterate over the message IDs in the messageIdList and call markAsUnread for each ID
  messageIdList.forEach(messageId => {
      markAsUnread(messageId);
  });
}
