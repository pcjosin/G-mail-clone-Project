// Reconstruct gapi.client
const API_KEY = 'AIzaSyAGzP3_IUN8Ds05jBNckdYrFR6jyDeoeEo';


  // Initialize the Gmail API client on the Next Page
  const accessToken = localStorage.getItem('accessToken');

  // Initialize the Gmail API client on the Next Page
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    }).then(() => {
      // Set the access token in gapi.client
      if (accessToken) {
        gapi.client.setToken({ access_token: accessToken });

        // Call the listLabels function
        listLabels();
      } else {
        document.getElementById('nextpage-content').innerText = 'Access token not found.';
      }
    });
  });

  // Function to list labels
  async function listLabels() {
    let response;
    try {
      response = await gapi.client.gmail.users.labels.list({
        'userId': 'me',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const labels = response.result.labels;
    if (!labels || labels.length == 0) {
      document.getElementById('content').innerText = 'No labels found.';
      return;
    }

    let parentDiv=document.getElementById('main-sidebar');
    for(let i=0;i<labels.length;i++){
        let labelDiv=document.createElement('div');//main label div
        labelDiv.id=labels[i].id;
        labelDiv.classList.add('labelDiv','row','ms-2','me-1','p-2');
        

        
        let iconDiv=document.getElementById('div');//adding icon tag
        iconDiv.classList.add('bi','col-1','fs-3');
        switch(labels[i].id.toLowerCase()){
          case 'chat':iconDiv.classList.add('bi-chat-left-text');
          break;
          case 'sent':iconDiv.classList.add('bi-send');
          break;
          case 'inbox':iconDiv.classList.add('bi-inbox');
          break;
          case 'trash':iconDiv.classList.add('bi-trash');
          break;
          case 'snoozed':iconDiv.classList.add('bi-clock');
          break;
          case 'draft':iconDiv.classList.add('bi-file-earmark');
          break;
          case 'spam':iconDiv.classList.add('bi-exclamation-octagon');
          break;
          case 'starred':iconDiv.classList.add('bi-star');
          break;
          case 'important':iconDiv.classList.add('bi-flag');
          break;
          case 'unread':iconDiv.classList.add('bi-flag');
          break;
          case 'category_updates':iconDiv.classList.add('bi-exclamation-circle');
          break;
          case 'category_promotions':iconDiv.classList.add('bi-tag');
          break;
          case 'category_social':iconDiv.classList.add('bi-person-lines-fill');
          break;

          
          default:iconDiv.classList.add('bi-inbox');
        }
        labelDiv.append(iconDiv);

        let anchor=document.createElement('a');//adding anchor tag
        let aName=labels[i].name.toLowerCase();
        aName=aName.charAt(0).toUpperCase()+aName.slice(1);
        anchor.innerHTML=aName;
        anchor.classList.add('col-6','labelAnchor','fs-4');
        labelDiv.append(anchor);
        
        // labelDiv.innerHTML=labels[i].name;
        parentDiv.appendChild(labelDiv);

    }

    console.log(labels);
  }
    
