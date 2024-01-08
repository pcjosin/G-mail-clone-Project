

//Function to search a query regarding emails
 
async function searchMessages() {
    // Specify your search query
    let searchBoxInput = document.getElementById('search-input-box');
    document.addEventListener('input', function(event){
      if(event.target.contains(searchBoxInput)){
        console.log("search box changed");
        isSearchActive = true;
        let query = document.getElementById('search-input-box').value;
        let cancelButtonSvg = document.getElementById('cancel-button-svg');
        cancelButtonSvg.style.visibility = 'visible'
   
        document.addEventListener('click', function(event){
          if(event.target.contains(cancelButtonSvg)){
            document.getElementById('search-input-box').value = ""
            cancelButtonSvg.style.visibility = 'hidden'
            emailListContainer.innerHTML = ''
            listLatestEmails()
          }
        })
   
        // Performing the search using users.messages.list
        gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'q': query,
        maxResults: 30,
        }).then(function(response) {
          console.log("response: ", response)
        let messages = response.result.messages;
        console.log("Search messages: ", messages)
        if (messages && messages.length > 0) {
            console.log('Messages:');
            emailListContainer.innerHTML = ''
            for (let i = 0; i < messages.length; i++) {
                console.log('Message ID: ' + messages[i].id);
                listSearchedEmails(messages[i].id)
            }
            isSearchActive = false;
        } else {
            console.log('No messages found.');
        }
        });
      }
    })
  }
  searchMessages()
   
  async function listSearchedEmails(message) {
    try {
        const messagePreview = await getEmailPreview(message); // calling function to get a preview of email
        console.log("messagePreview: ",messagePreview);
   
        const emailListElement = loadEmailContent(messagePreview); //calling function to generate an email preview element
        console.log("emailListElement: ",emailListElement);
   
        emailListElement.setAttribute("id", message);
        emailListElement.onclick = () => clickHandle(message);
   
        emailListContainer.appendChild(emailListElement);
    } catch (error) {
      console.error("Error listing emails:", error);
    }
  }
  
  
  
  
  
  
  
  