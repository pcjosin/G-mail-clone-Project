
// Handle the response


// Function to list labels
function createNonUserLabelElements() {
  let parentDiv = document.getElementById("main-sidebar");
 
  gapi.client.gmail.users.labels.list({
    'userId': 'me'
  })
  .then(response => {
    const labelsData = response.result.labels.filter(label => !label.type || label.type !== 'user');
 
    labelsData.forEach((label,index) => {
      if(index<=4){
        const labelDiv = createLabelElement(label);
        // Assuming you have a container div with the id 'label-container'
        parentDiv.appendChild(labelDiv);
      }  
    });
    let labelMore=document.createElement('div');
    labelMore.innerHTML="more";
    labelMore.id='Labelmore';
 
    let labelcategory=document.createElement('div');
    labelcategory.innerHTML="Category";
    labelcategory.classList.add('ms-3','p-2');
 
    let categoryIcon=document.createElement('i');
    categoryIcon.classList.add('bi','bi-caret-right-fill','fs-5','p-2')
    labelcategory.appendChild(categoryIcon);
    labelcategory.classList.add('ms-3','p-2');
   
 
    let moreIcon=document.createElement('i');
    moreIcon.classList.add('bi','bi-chevron-compact-down','fs-5','p-2')
    labelMore.appendChild(moreIcon);
    labelMore.classList.add('ms-3','p-2');
    parentDiv.appendChild(labelMore);
 
    let moreLabelList=document.createElement('div');
    moreLabelList.classList.add('moreLabelList');
 
    let categoryList=document.createElement('div');
    categoryList.classList.add('categoryList','ms-3');
   
    labelsData.forEach((label,index) => {
      const type=label.name.toLowerCase().split('_')[0];
      if(index>4 && type!=='category'){
        const labelDiv = createLabelElement(label);
        // Assuming you have a container div with the id 'label-container'
        moreLabelList.appendChild(labelDiv);
      }  
      else if(index>4 && type=='category'){
        const labelDiv = createLabelElement(label);
        categoryList.appendChild(labelDiv);
      }
    });
 
    moreLabelList.appendChild(labelcategory);
    moreLabelList.appendChild(categoryList);
    parentDiv.appendChild(moreLabelList);
   
    labelMore.onclick=()=>{
        moreLabelList.classList.toggle('more');
        moreIcon.classList.toggle('bi-chevron-compact-up');
    }
    labelcategory.onclick=()=>{
      categoryList.classList.toggle('categoryShow');
      categoryIcon.classList.toggle('bi-caret-right');
    }
 
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

  const anchor = document.createElement('span');
  const labelName = label.name.toLowerCase().split("_").reverse(0);
  anchor.innerHTML = labelName.charAt(0).toUpperCase() + labelName.slice(1);
  anchor.classList.add('col-6', 'labelAnchor', 'fs-6');
  labelDiv.appendChild(anchor);

  // Checking for spam emails
  anchor.onclick = () => {
    document.getElementById('main-list-content').innerHTML = '';

    if (anchor.innerHTML === 'Spam') {
      listEmailsByLabel('SPAM', 20);
    } else if (anchor.innerHTML === 'Draft') {
      listEmailsByLabel('DRAFT', 20);
    } else if (anchor.innerHTML === 'Sent') {
      listEmailsByLabel('SENT', 20);
    } else if (anchor.innerHTML === 'Trash') {
      listEmailsByLabel('TRASH', 20);
    } else if (anchor.innerHTML === 'Inbox') {
      listLatestEmails(20); // Assuming listLatestEmails function still exists
    } else if (anchor.innerHTML === 'Important') {
      listEmailsByLabel('IMPORTANT', 20);
    } else if (anchor.innerHTML === 'Starred') {
      listEmailsByLabel('STARRED', 20);
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
