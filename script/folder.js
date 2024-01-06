// Function to create a new folder through user input
function createNewFolder() {
    const formDiv = createFormDiv();
    document.body.appendChild(formDiv);
    formDiv.style.display = 'block';
  
    const createButton = formDiv.querySelector('.create-button');
  
    createButton.addEventListener('click', async () => {
      const newFolderName = formDiv.querySelector('.folder-input').value.trim();
      if (newFolderName) {
        try {
          const newFolder = await addNewFolderApiCall(newFolderName);
          const folderElementDiv = createFolderElement(newFolder);
  
          appendFolderToContainer(folderElementDiv);
  
          displayBanner(`New folder created: ${newFolderName}`, 'success');
          formDiv.style.display = 'none';
  
          setTimeout(() => {
            removeBanner();
          }, 2000);
        } catch (error) {
          handleFolderCreationError(error, newFolderName, formDiv);
        }
      }
    });
  }
  
  // Function to create the form div
  function createFormDiv() {
    const formDiv = document.createElement('div');
    formDiv.classList.add('folder-create-form');
  
    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Folder Name:';
    
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.classList.add('folder-input');
  
    const createButton = document.createElement('button');
    createButton.innerText = 'Create';
    createButton.classList.add('create-button');
  
    formDiv.appendChild(nameLabel);
    formDiv.appendChild(inputName);
    formDiv.appendChild(document.createElement('br'));
    formDiv.appendChild(createButton);
  
    return formDiv;
  }
  
  // Function to handle folder creation error
  function handleFolderCreationError(error, newFolderName, formDiv) {
    console.error('Error adding folder:', error);
  
    if (error.result && error.result.error) {
      console.error('Error details:', error.result.error);
    }
  
    displayBanner(`Error creating folder: ${newFolderName}`, 'error');
    formDiv.style.display = 'none';
  
    setTimeout(() => {
      removeBanner();
    }, 2000);
  }
  
  // Function to display banner
  function displayBanner(message, type) {
    const banner = createBanner(message, type);
    document.body.appendChild(banner);
  }
  
  // Function to create banner
  function createBanner(message, type) {
    const banner = document.createElement('div');
    banner.innerText = message;
    banner.classList.add('banner', type);
    return banner;
  }
  
  // Function to remove banner
  function removeBanner() {
    const banner = document.querySelector('.banner');
    if (banner) {
      document.body.removeChild(banner);
    }
  }
  
  // Function to add a new folder through the Gmail API
  async function addNewFolderApiCall(labelName) {
    const response = await gapi.client.gmail.users.labels.create({
      'userId': 'me',
      'resource': {
        'name': labelName,
        'labelListVisibility': 'labelShow',
        'messageListVisibility': 'show',
      }
    });
  
    return response.result;
  }
  
  // Function to create a folder element
  function createFolderElement(folderData) {
    const folderElementDiv = document.createElement('div');
    folderElementDiv.classList.add('text-folder');
    folderElementDiv.id = folderData.id;
  
    const iconElement = document.createElement('i');
    iconElement.classList.add('bi', 'bi-folder');
  
    const folderText = document.createElement('span');
    folderText.innerText = folderData.name;
  
    const deleteButton = createDeleteButton(folderData.id, folderElementDiv);
  
    folderElementDiv.appendChild(iconElement);
    folderElementDiv.appendChild(folderText);
    folderElementDiv.appendChild(deleteButton);
    folderElementDiv.draggable = true;
    
    folderElementDiv.addEventListener('dragover', handleDragOver);
    folderElementDiv.addEventListener('drop', handleDrop);
    
  
    // Clicking the folder element will trigger the listEmailsByCustomFolder function
    folderElementDiv.onclick = () => listEmailsByCustomFolder(folderData.id);
  
    return folderElementDiv;
  }
  
  // Function to create delete button
  function createDeleteButton(folderId, folderElementDiv) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  
    deleteButton.style.visibility = 'hidden';
  
    folderElementDiv.addEventListener('mouseover', () => {
      deleteButton.style.visibility = 'visible';
    });
  
    folderElementDiv.addEventListener('mouseout', () => {
      deleteButton.style.visibility = 'hidden';
    });
  
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      handleDeleteFolder(folderId);
      folderElementDiv.remove();
    });
  
    return deleteButton;
  }
  
  // Function to append folder to container
  function appendFolderToContainer(folderElementDiv) {
    const foldersContainer = document.querySelector('#folder-container');
    foldersContainer.appendChild(folderElementDiv);
  }
  
  // Function to list emails by a custom folder
  async function listEmailsByCustomFolder(labelId) {
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: "me",
        labelIds: [labelId],
        maxResults: 10,
      });
  
      console.log(response.result.messages);
  
      // Clear existing emails before appending new ones
      emailListContainer.innerHTML = '';
  
      if (response.result.messages == null) {
        displayNoEmailsMessage();
      } else {
        for (const message of response.result.messages) {
          const messagePreview = await getEmailPreview(message.id);
          console.log(messagePreview);
  
          const emailListElement = loadEmailContent(messagePreview);
          emailListElement.setAttribute("id", message.id);
          emailListElement.onclick = () => clickHandle(message.id);
  
          emailListContainer.appendChild(emailListElement);
        }
      }
    } catch (error) {
      console.error("Error listing emails:", error);
    }
  }
  
  // Function to display no emails message
  function displayNoEmailsMessage() {
    const noEmailsMessage = document.createElement('h5');
    noEmailsMessage.innerText = 'There are no conversations with this folder.';
    noEmailsMessage.style.textAlign = 'center';
    emailListContainer.appendChild(noEmailsMessage);
  }
  
  // Function to handle folder deletion
  function handleDeleteFolder(folderId) {
    gapi.client.gmail.users.labels.delete({
      'userId': 'me',
      'id': folderId
    }).then(response => {
      console.log('Label deleted successfully:', response);
    }).catch(error => {
      console.error('Error deleting label:', error);
  
      if (error.result && error.result.error) {
        console.error('Error details:', error.result.error);
      }
    });
  }
  
  // Function to generate folders div
  function generateFoldersDiv() {
    const foldersDiv = document.createElement('div');
    foldersDiv.classList.add('parent-folder-container');
  
    const headerDiv = createHeaderDiv();
    const foldersContainerDiv = createFoldersContainerDiv();
  
    foldersDiv.appendChild(headerDiv);
    foldersDiv.appendChild(foldersContainerDiv);
  
    return foldersDiv;
  }
  
  // Function to create header div
  function createHeaderDiv() {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('folder-header');
  
    const headerText = document.createElement('h5');
    headerText.innerText = 'Folders';
  
    const plusButton = createPlusButton();
  
    headerDiv.appendChild(headerText);
    headerDiv.appendChild(plusButton);
  
    return headerDiv;
  }
  
  // Function to create plus button
  function createPlusButton() {
    const plusButton = document.createElement('button');
    plusButton.classList.add('plus-button');
    plusButton.addEventListener('click', createNewFolder);
  
    const plusIcon = document.createElement('i');
    plusIcon.classList.add('bi', 'bi-plus');
    plusButton.appendChild(plusIcon);
  
    return plusButton;
  }
  
  // Function to create folders container div
  function createFoldersContainerDiv() {
    const containerDiv = document.createElement('div');
    containerDiv.id = 'folder-container';
  
    loadFoldersFromAPI(containerDiv);
  
    return containerDiv;
  }
  
  // Function to load folders from API
  function loadFoldersFromAPI(containerDiv) {
    gapi.client.gmail.users.labels.list({
      'userId': 'me'
    }).then(response => {
      const foldersData = response.result.labels.filter(folder => !folder.type || folder.type === 'user');
      foldersData.forEach(folder => {
        const folderDiv = createFolderElement(folder);
        containerDiv.appendChild(folderDiv);
      });
    }).catch(error => {
      console.error('Error loading folders:', error);
    });
  }
  
  function handleDragOver(event) {
    event.preventDefault();
  
  
  }
  
  
  function addEmailToLabel(messageId, labelId) {
    
    const request = gapi.client.gmail.users.messages.modify({
      userId: 'me', 
      id: messageId,
      resource: {
        addLabelIds: [labelId]
      }
    });
  
    // Execute the request
    request.execute(function(response) {
      console.log('Email added to label:', response);
    });
  }
  
  function handleDrop(event) {
    // Get the dragged data
    const data = event.dataTransfer.getData('text');
  
    // Get the target element's ID and text content
    const targetId = event.target.id;
    const textContent = event.dataTransfer.getData('text/plain');
  
    
    addEmailToLabel(textContent, targetId);
    displayBanner(`email added to the folder: ${event.target.textContent}`, 'success');
  
  
    setTimeout(() => {
      removeBanner();
    }, 2000);
  
  
    // Prevent the default behavior
    event.preventDefault();
  }