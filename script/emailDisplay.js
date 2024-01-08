


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
    currentMessageId = emailElementId;
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
    emailBodyContent = await getEmailBodyHtml(emailElementId);
    emailDateContent= await getSendTime(emailElementId)
    console.log(emailBodyContent)
    summaryButton.id = emailElementId;

    senderEmailAdressContent= await getSenderEmail(emailElementId) 
    // Assume senderEmail contains the email address of the sender
  
  
  // Fetch the sender's profile information
  
  
    // Update your HTML elements

    emailSubject.innerText = emailSubjectContent;
    emailBody.innerHTML = emailBodyContent;
    const formattedTimestamp = formatTimestamp(emailDateContent);
    emailDate.innerText=formattedTimestamp;
    senderEmailAdress.innerText=senderEmailAdressContent
    console.log(generateSummary(emailBody))
    
  
  }
  
  
  async function getEmailBodyHtml(messageId) {
    try {
      // Use the Gmail API to get the email content
      const response = await gapi.client.gmail.users.messages.get({
        userId: "me",
        id: messageId,
      });
  
      // Access the email data from the response
      const emailData = response.result;
  
      // Check if the email has parts
      if (emailData.payload && emailData.payload.parts) {
        // Iterate through parts
        for (const part of emailData.payload.parts) {
          // Check if the part is text/html (HTML content)
          if (
            part.mimeType === "text/html" &&
            part.body &&
            part.body.data
          ) {
            // Decode the base64-encoded data using custom function
            console.log(part.body.data)
            const htmlContent = atob(part.body.data.replace(/\-/g, '+').replace(/\_/g, '/'));
  
            console.log(htmlContent)
            // Return the decoded HTML content
            return htmlContent;
          }
        }
      }
  
      // Return an empty string if no valid HTML content is found
      return "";
    } catch (error) {
      console.error("Error getting email HTML content:", error);
      return ""; // Return an empty string in case of an error
    }
  }
  
  function decodeBase64(encodedString) {
    const binaryString = atob(encodedString);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return String.fromCharCode.apply(null, bytes);
  }
  
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
    emailBodyContent = await getEmailBodyHtml(emailElementId);
    emailDateContent= await getSendTime(emailElementId)
    console.log(emailBodyContent)

    senderEmailAdressContent= await getSenderEmail(emailElementId) 
    // Assume senderEmail contains the email address of the sender
  
  
  // Fetch the sender's profile information
  
  
    // Update your HTML elements
    emailSubject.innerText = emailSubjectContent;
    emailBody.innerHTML = emailBodyContent;
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
      'userId': 'me',
      'id': messageId,
      'resource': {
        'removeLabelIds': ['UNREAD']
      }
    }).then(response => {
      console.log('Email marked as unread:', response.result);
    }, error => {
      console.error('Error marking email as unread:', error);
    });
  }