// let mainListContent = document.getElementById('main-list-content');

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
  
      for (const message of response.result.messages) {
        const messagePreview = await getEmailPreview(message.id); // calling function to get a preview of email
       
  
        const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element
        
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
  