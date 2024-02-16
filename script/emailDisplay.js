

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
  
  
  
  async function getEmailContent(messageId) {
    try {
      const response = await gapi.client.gmail.users.messages.get({
        userId: "me",
        id: messageId,
      });
      return response;
    } catch (error) {
      
      console.error("Error getting email content:", error);
      return null;
    }
  }
  
  // Handle the response
  
  // Process the email data, body, sender's email, sender's name, and send time as needed
  async function clickHandle(emailElementId) {
    currentMessageId=emailElementId;
    fetch("mail.html")
      .then((response) => response.text())
      .then((data) => {
        // Inject the loaded content into the container
        document.getElementById("display-area").innerHTML = data;
        summaryButton=document.getElementById("summarize-button");
        emailBody = document.getElementById("body-content");
        emailSubject = document.getElementById("email-subject");
        emailDate = document.getElementById("send-date");
        senderEmailAdress=document.getElementById("sender-adress")
        
      })
      .catch((error) => console.error("Error:", error));
  
    emailSubjectContent = await getSendSubject(emailElementId);
   
    emailDateContent= await getSendTime(emailElementId)
    
    summaryButton.id = emailElementId;

    markAsRead(emailElementId);

    senderEmailAdressContent= await getSenderEmail(emailElementId) 
    // Assume senderEmail contains the email address of the sender
  
  
  // Fetch the sender's profile information
  
  
    // Update your HTML elements

    emailSubject.innerText = emailSubjectContent;
    await setEmailContent(emailElementId,emailBody);
    const formattedTimestamp = formatTimestamp(emailDateContent);
    emailDate.innerText=formattedTimestamp;
    senderEmailAdress.innerText=senderEmailAdressContent
    //console.log(generateSummary(emailBody))
    
  
  }
  // setEmailContent function takes a messageId and a containerDiv as arguments
// It fetches the email content using the Gmail API and sets the content in the provided containerDiv

async function setEmailContent(messageId, containerDiv) {
  try {
    const response = await gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    const emailData = response.result;

    if (emailData.payload.parts) {
      // Try to find the HTML part in payload.parts
      const htmlPart = emailData.payload.parts.find(
        (part) => part.mimeType === "text/html" && part.body && part.body.data
      );

      if (htmlPart) {
        const htmlContent = atob(htmlPart.body.data.replace(/\-/g, '+').replace(/\_/g, '/'));
        containerDiv.innerHTML = htmlContent;
        return;
      }}

      // If payload.parts is not available, try using payload.body.data
      if (!emailData.payload.parts) {
        const textHtmlPart = emailData.payload.body;
        if (textHtmlPart && textHtmlPart.data) {
          const textHtmlContent = atob(textHtmlPart.data.replace(/\-/g, '+').replace(/\_/g, '/'));
          containerDiv.innerHTML = textHtmlContent;
          return;
        }
      

      // Fallback: If no HTML part or body.data is found, set containerDiv.innerHTML to an empty string
      containerDiv.innerHTML = "";
    }
  } catch (error) {
    console.error("Error setting email content:", error);
  }
}

/*
async function setEmailContent(messageId, containerDiv) {
  try {
    const response = await gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    const emailData = response.result;
    console.log(emailData)

    if (emailData.payload ) {
      const htmlPart = emailData.payload.body
     

      if (htmlPart) {
        const htmlContent = atob(htmlPart.data.replace(/\-/g, '+').replace(/\_/g, '/'));
        containerDiv.innerHTML = htmlContent;
        return;
      }

      const textPart = emailData.payload.parts.find(
        (part) => part.mimeType === "text/plain" && part.body && part.body.data
      );

      if (textPart) {
        const textContent = atob(textPart.body.data.replace(/\-/g, '+').replace(/\_/g, '/'));
        containerDiv.innerText = textContent;
        return;
      }
    }

    containerDiv.innerHTML = "";
  } catch (error) {
    console.error("Error setting email content:", error);
  }
}
*/
  
  
// setEmailContent function takes a messageId and a containerDiv as arguments



function findPartByMimeType(parts, mimeType) {
  return parts.find((part) => part.mimeType === mimeType);
}

function decodeBody(body) {
  console.log(body.data)
  return body && body.data ? atob(body.data.replace(/\-/g, '+').replace(/\_/g, '/')) : "";
}

async function getAttachment(attachmentId) {
  const attachmentResponse = await gapi.client.gmail.users.messages.attachments.get({
    userId: "me",
    id: attachmentId,
  });

  return attachmentResponse.result.data;
}

function processAttachment(attachmentData, containerDiv) {
  const attachmentContent = decodeBase64(attachmentData);
  containerDiv.innerHTML = `<pre>${attachmentContent}</pre>`;
}

function decodeBase64(encodedData) {
  return atob(encodedData.replace(/\-/g, '+').replace(/\_/g, '/'));
}


function findPartByMimeType(parts, mimeType) {
  return parts.find((part) => part.mimeType === mimeType);
}

function decodeBody(body) {
  if (body && body.data) {
    return decodeBase64(body.data);
  }
  return "";
}

function decodeBase64(encodedData) {
  return atob(encodedData.replace(/\-/g, '+').replace(/\_/g, '/'));
}


function processAttachment(attachmentData) {
  // Handle the attachment data as needed
  // For example, you can create a download link or display the attachment in the UI
  console.log("Attachment Data:", attachmentData);
}

// Rest of the functions remain unchanged...


function hasAttachment(parts) {
  return parts.some((part) => part.mimeType === "application/octet-stream");
}

// Rest of the functions remain unchanged...


  
  async function getSenderEmail(messageId) {
    try {
      const response = await gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'metadata',
        metadataHeaders: ['From'],
      });
  
      const headers = response.result.payload.headers;
      
      // Check if 'From' header exists in the metadata
      const fromHeader = headers.find(header => header.name === 'From');
      
      if (fromHeader) {
        const senderEmail = fromHeader.value;
        return senderEmail;
      } else {
        console.error('Error: "From" header not found in email metadata');
        return 'Unknown Sender';
      }
    } catch (error) {
      console.error('Error getting sender email:', error);
      return 'Unknown Sender';
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



  
function formatTimestamp(timestampString) {
    const mailDate = new Date(timestampString);
  
    // Check if the mail was sent today
    const currentDate = new Date();
    if (
      mailDate.getDate() === currentDate.getDate() &&
      mailDate.getMonth() === currentDate.getMonth() &&
      mailDate.getFullYear() === currentDate.getFullYear()
    ) {
      // If sent today, return only the time
      const hours = mailDate.getHours().toString().padStart(2, '0');
      const minutes = mailDate.getMinutes().toString().padStart(2, '0');
      const seconds = mailDate.getSeconds().toString().padStart(2, '0');
  
      return `${hours}:${minutes}:${seconds}`;
    } else {
      // If not sent today, return the date
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return mailDate.toLocaleDateString('en-US', options);
    }
  }



  

async function summarizeEmailContent(emailElementId){
    
    fetch("mail.html")
      .then((response) => response.text())
      .then((data) => {
        // Inject the loaded content into the container
        document.getElementById("display-area").innerHTML = data;
  
        emailBody = document.getElementById("body-content");
        emailSubject = document.getElementById("email-subject");
        emailDate = document.getElementById("send-date");
        senderEmailAdress=document.getElementById("sender-adress")
      })
      .catch((error) => console.error("Error:", error));
  
    emailSubjectContent = await getSendSubject(emailElementId);
    
    emailDateContent= await getSendTime(emailElementId)
    

    senderEmailAdressContent= await getSenderEmail(emailElementId) 
    // Assume senderEmail contains the email address of the sender
  
  
  // Fetch the sender's profile information
  
  
    // Update your HTML elements
    emailSubject.innerText = emailSubjectContent;
    await setEmailContent(emailElementId,emailBody);
    const formattedTimestamp = formatTimestamp(emailDateContent);
    emailDate.innerText=formattedTimestamp;
    senderEmailAdress.innerText=senderEmailAdressContent
    
    try {
      const summaryText = await generateSummary(emailBody);
      emailBody.innerHTML = "";
      emailBody.innerText = summaryText;
      console.log(summaryText)
  } catch (error) {
      console.error('Error generating summary:', error);
      // Handle the error as needed
  }
    

  }



  function archiveEmail(messageId) {
    // Use Gmail API to archive the email
    gapi.client.gmail.users.messages.modify({
      'userId': 'me',
      'id': messageId,
      'resource': {
        'removeLabelIds': ['INBOX']
      }
    }).then(response => {
      console.log('Email archived:', response.result);
    }, error => {
      console.error('Error archiving email:', error);
    });
  }

  function deleteEmail(messageId) {
    // Use Gmail API to delete the email
    gapi.client.gmail.users.messages.delete({
      'userId': 'me',
      'id': messageId
    }).then(response => {
      console.log('Email deleted:', response.result);
    }, error => {
      console.error('Error deleting email:', error);
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

  function markAsRead(messageId) {
    // Use Gmail API to mark the email as unread
    gapi.client.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      resource: {
        removeLabelIds: ['UNREAD']
      }
    }).then(response => {
      console.log('Email marked as read:', response.result);
    }, error => {
      console.error('Error marking email as read:', error);
    });
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

  function reportSpam(messageId) {
    let messageDiv = document.getElementById('message-display-div');
    gapi.client.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      resource: {
        addLabelIds: ['SPAM'],
        removeLabelIds: []  // Remove all existing label IDs
      }
    }).then(function(response) {
      console.log('Message moved to spam:', response);
      messageDiv.innerHTML="reported as spam";
      messageDiv.style.display = 'block';
      hideMessageDiv();
    }, function(error) {
      console.error('Error moving message to spam:', error);
    });
  }

  async function replyMessage(messageId) {
    console.log("currentmessage id",messageId);
    loadCompose();
    let replyMailId = await getSenderEmail(messageId);
    let replySubject= await getSendSubject(messageId);
    let replyBody=await getEmailBodyHtml(messageId);
   
    const toEmail = document.getElementById("email-container");
    const subject= document.getElementById("subject-container");
    const htmlBody= document.getElementById("message-container");

    toEmail.value=replyMailId.split(' ').reverse()[0].slice(1,-1);
    subject.value="Re:"+replySubject;
    htmlBody.innerHTML=" <br>"+replyBody;
    
  }

  async function forwardMessage(messageId) {
    loadCompose();
    let forwardSubject= await getSendSubject(messageId);
    let forwardBody=await getEmailBodyHtml(messageId);
    let from=await getSenderEmail(messageId);
    let date=await getSendTime(messageId);
   
    const subject= document.getElementById("subject-container");
    const htmlBody= document.getElementById("message-container");

    let fwdLabel="--------Forwarded message---------<br>From: "+from+"<br>Date: "+date+"<br>Subject: "+forwardSubject;
    subject.value="Fwd:"+forwardSubject;
    htmlBody.innerHTML=" <br>"+fwdLabel+"<br>"+forwardBody;
    
  }


  