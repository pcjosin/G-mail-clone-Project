function generateFoldersDiv() {
  const foldersDiv = document.createElement('div');
  foldersDiv.classList.add('yJ');
  foldersDiv.style.padding = '25px'; // Adjust padding as needed

  const headerDiv = document.createElement('div');
  headerDiv.style.display = 'flex';
  headerDiv.style.alignItems = 'center';

  const headerText = document.createElement('h5');
  headerText.style.margin = '5px';
  headerText.innerText = 'Folders';

  const createNewFolderButton = createNewFolderButtonDiv();

  const plusButton = document.createElement('button');
  plusButton.classList.add('plus-button');
  plusButton.style.borderRadius = '50%'; // Add rounded border to the plus button
  plusButton.addEventListener('click', createNewFolder);

  // Create the Bootstrap Icons plus symbol inside the button
  const plusIcon = document.createElement('i');
  plusIcon.classList.add('bi', 'bi-plus');
  plusButton.appendChild(plusIcon);

  headerDiv.appendChild(headerText);
  headerDiv.appendChild(createNewFolderButton);
  headerDiv.appendChild(plusButton);

  const foldersContainerDiv = createFoldersContainerDiv();

  foldersDiv.appendChild(headerDiv);
  foldersDiv.appendChild(foldersContainerDiv);

  return foldersDiv;
}



// Function to create "Create New Folder" button
function createNewFolderButtonDiv() {
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('aAu', 'arN');
  buttonDiv.setAttribute('jsname', 'dlrqf');
  buttonDiv.setAttribute('aria-label', 'Create new folder');
  buttonDiv.setAttribute('data-tooltip', 'Create new folder');
  buttonDiv.setAttribute('role', 'button');
  buttonDiv.setAttribute('tabindex', '0');
  buttonDiv.setAttribute('type', 'button');
  buttonDiv.setAttribute('jslog', '167296; u014N:cOuCgd,Kr2w4b,xr6bB;');

  buttonDiv.addEventListener('click', createNewFolder);

  return buttonDiv;
}

// Function to create folders container
function createFoldersContainerDiv() {
  const containerDiv = document.createElement('div');

containerDiv.classList.add('wT');
containerDiv.id = 'folder-container'; // Add the id 'folder-container' to the element


  gapi.client.gmail.users.labels.list({
    'userId': 'me'
  }).then(response => {
    const foldersData = response.result.labels.filter(folder => !folder.type || folder.type === 'user');

    foldersData.forEach(folder => {
      const folderDiv = createFolderElement(folder);
      containerDiv.appendChild(folderDiv);
    });
  }, error => {
    console.error('Error loading folders:', error);
  });

  return containerDiv;
}

// Function to add a new folder through the Gmail API


function addNewFolderApiCall(labelName) {
  gapi.client.gmail.users.labels.create({
    'userId': 'me',
    'resource': {
      'name': labelName,
      'labelListVisibility': 'labelShow',
      'messageListVisibility': 'show',
    }
  }).then(response => {
    console.log('Label added:', response.result);
  }).catch(error => {
    console.error('Error adding label:', error);

    // Check if the error response contains details
    if (error.result && error.result.error) {
      console.error('Error details:', error.result.error);
    }
  });
}


// Function to create a folder element
// Function to create a folder element
// Function to create a folder element
// Function to create a folder element
// Function to create a folder element
// Function to create a folder element
function createFolderElement(folderData) {
  const folderElementDiv = document.createElement('div');
  folderElementDiv.classList.add('text-folder');
  folderElementDiv.style.position = 'relative'; // Add relative positioning

  const iconElement = document.createElement('i');
  iconElement.classList.add('bi', 'bi-folder');

  const folderText = document.createElement('span');
  folderText.innerText = folderData.name;

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.style.position = 'absolute';
  deleteButton.style.top = '50%';
  deleteButton.style.right = '0';
  deleteButton.style.transform = 'translateY(-50%)';
  deleteButton.style.cursor = 'pointer';
  deleteButton.style.border = 'none'; // Remove the border
  deleteButton.style.background = 'none'; // Remove the background

  // Initially hide the delete button
  deleteButton.style.visibility = 'hidden';

  // Show delete button on folder element hover
  folderElementDiv.addEventListener('mouseover', () => {
    deleteButton.style.visibility = 'visible';
  });

  // Hide delete button on folder element mouseout
  folderElementDiv.addEventListener('mouseout', () => {
    deleteButton.style.visibility = 'hidden';
  });

  // Delete option
  deleteButton.addEventListener('click', (event) => {
    // Prevent the event from propagating to the folder click event
    event.stopPropagation();

    // Call a function to handle folder deletion
    // Pass the folderData.id to uniquely identify the folder
    handleDeleteFolder(folderData.id);

    // Remove the folder element from the DOM
    folderElementDiv.remove();
  });

  // Append elements to folder element
  folderElementDiv.appendChild(iconElement);
  folderElementDiv.appendChild(folderText);
  folderElementDiv.appendChild(deleteButton);

  folderElementDiv.onclick = () => listEmailsByCustomFolder(folderData.id, 10);

  return folderElementDiv;
}

// Function to handle folder deletion
function handleDeleteFolder(folderId) {
  // Call the Gmail API to delete the label with the specified ID
  gapi.client.gmail.users.labels.delete({
    'userId': 'me',
    'id': folderId
  }).then(response => {
    console.log('Label deleted successfully:', response);
  }).catch(error => {
    console.error('Error deleting label:', error);

    // Check if the error response contains details
    if (error.result && error.result.error) {
      console.error('Error details:', error.result.error);
    }
  });
}





// Function to create a new folder through user input
// Function to create a new folder through user input
function createNewFolder() {
  const formDiv = document.createElement('div');
  formDiv.style.position = 'fixed';
  formDiv.style.top = '50%';
  formDiv.style.left = '50%';
  formDiv.style.transform = 'translate(-50%, -50%)';
  formDiv.style.zIndex = '9999';
  formDiv.style.backgroundColor = '#fff';
  formDiv.style.padding = '20px';
  formDiv.style.border = '1px solid #ccc';

  const nameLabel = document.createElement('label');
  nameLabel.innerText = 'Folder Name:';
  const inputName = document.createElement('input');
  inputName.type = 'text';

  const createButton = document.createElement('button');
  createButton.innerText = 'Create';

  createButton.addEventListener('click', async () => {
    const newFolderName = inputName.value.trim();
    if (newFolderName) {
      const newFolder = { name: newFolderName, id: ':' + Math.floor(Math.random() * 1000) };
      const folderElementDiv = createFolderElement(newFolder);

      try {
        await addNewFolderApiCall(newFolderName);
        const foldersContainer = document.querySelector('.wT');
        foldersContainer.appendChild(folderElementDiv);

        // Create and show success banner
        const successBanner = document.createElement('div');
        successBanner.style.position = 'fixed';
        successBanner.style.bottom = '5%';
        successBanner.style.left = '10%';
        successBanner.style.backgroundColor = 'green';
        successBanner.style.color = '#fff';
        successBanner.style.padding = '10px';
        successBanner.style.zIndex = '9999';
        successBanner.innerText = `New folder created: ${newFolderName}`;
        document.body.appendChild(successBanner);

        // Hide the form after submission
        formDiv.style.display = 'none';

        // Hide the success banner after 2 seconds
        setTimeout(() => {
          document.body.removeChild(successBanner);
        }, 2000);
      } catch (error) {
        console.error('Error adding folder:', error);

        // Check if the error response contains details
        if (error.result && error.result.error) {
          console.error('Error details:', error.result.error);
        }

        // Create and show error banner
        const errorBanner = document.createElement('div');
        errorBanner.style.position = 'fixed';
        errorBanner.style.bottom = '5%';
        errorBanner.style.left = '10%';
        errorBanner.style.backgroundColor = 'red';
        errorBanner.style.color = '#fff';
        errorBanner.style.padding = '10px';
        errorBanner.style.zIndex = '9999';
        errorBanner.innerText = `Error creating folder: ${newFolderName}`;
        document.body.appendChild(errorBanner);

        // Hide the form after submission
        formDiv.style.display = 'none';

        // Hide the error banner after 2 seconds
        setTimeout(() => {
          document.body.removeChild(errorBanner);
        }, 2000);
      }
    }
  });

  formDiv.appendChild(nameLabel);
  formDiv.appendChild(inputName);
  formDiv.appendChild(document.createElement('br'));
  formDiv.appendChild(createButton);

  document.body.appendChild(formDiv);
  formDiv.style.display = 'block';
}


// Function to list emails by folder on click
async function listEmailsByCustomFolder(folderId, numberOfEmails) {
  try {
    const response = await gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: [folderId],
      maxResults: numberOfEmails,
    });

    console.log(response.result.messages);

    for (const message of response.result.messages) {
      const messagePreview = await getEmailPreview(message.id);
      console.log(messagePreview);

      const emailListElement = loadEmailContent(messagePreview);
      emailListElement.setAttribute("id", message.id);
      emailListElement.onclick = () => clickHandle(message.id);

      emailListContainer.appendChild(emailListElement);
    }
  } catch (error) {
    console.error("Error listing emails:", error);
  }
}

// Call the function to generate folders and test


