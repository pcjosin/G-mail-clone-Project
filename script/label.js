function createNonUserLabelElements() {
    let parentDiv = document.getElementById("main-sidebar");
  
    gapi.client.gmail.users.labels.list({
      'userId': 'me'
    })
    .then(response => {
      const labelsData = response.result.labels.filter(label => !label.type || label.type !== 'user');
  
      labelsData.forEach(label => {
        const labelDiv = createLabelElement(label);
        // Assuming you have a container div with the id 'label-container'
        parentDiv.appendChild(labelDiv);
      });
      const generatedFoldersDiv = generateFoldersDiv();
      parentDiv.appendChild(generatedFoldersDiv);
    })
    .catch(error => {
      console.error('Error loading labels:', error);
      // Handle the error, e.g., display an error message in the UI
      const errorDiv = document.createElement('div');
      errorDiv.innerText = 'Error loading labels. Please try again.';
      // Assuming you have a container div with the id 'label-container'
      document.getElementById('label-container').appendChild(errorDiv);
    });
  }
  
  // Assuming createLabelElement and getIconClass functions remain unchanged
  function createLabelElement(label) {
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('labelDiv', 'row', 'ms-2', 'me-1', 'p-2');
  
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('bi', 'col-1', 'fs-6', 'me-2');
    iconDiv.classList.add(getIconClass(label.id));
  
    labelDiv.appendChild(iconDiv);
  
    const anchor = document.createElement('a');
    const labelName = label.name.toLowerCase();
    anchor.innerHTML = labelName.charAt(0).toUpperCase() + labelName.slice(1);
    anchor.classList.add('col-6', 'labelAnchor', 'fs-6');
    labelDiv.appendChild(anchor);
  
    // Checking for spam emails
    anchor.onclick = () => {
      document.getElementById('main-list-content').innerHTML = '';
  
      if (anchor.innerHTML === 'Spam') {
        listSpamEmails(20);
      } else if (anchor.innerHTML === 'Draft') {
        listDraftEmails(20);
      } else if (anchor.innerHTML === 'Sent') {
        listSentEmails(20);
      } else if (anchor.innerHTML === 'Trash') {
        listTrashEmails(20);
      }
    };
  
    return labelDiv;
  }
  
  function getIconClass(labelId) {
    switch (labelId.toLowerCase()) {
      case 'chat':
        return 'bi-chat-left-text';
      case 'sent':
        return 'bi-send';
      case 'inbox':
        return 'bi-inbox';
      case 'trash':
        return 'bi-trash';
      case 'snoozed':
        return 'bi-clock';
      case 'draft':
        return 'bi-file-earmark';
      case 'spam':
        return 'bi-exclamation-octagon';
      case 'starred':
        return 'bi-star';
      case 'important':
        return 'bi-flag';
      case 'unread':
        return 'bi-flag';
      case 'category_updates':
        return 'bi-exclamation-circle';
      case 'category_promotions':
        return 'bi-tag';
      case 'category_social':
        return 'bi-person-lines-fill';
      default:
        return 'bi-inbox';
    }
  }
  