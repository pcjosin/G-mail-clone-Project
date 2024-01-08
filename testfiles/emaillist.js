// let mainListContent = document.getElementById('main-list-content');

let contentDiv = document.getElementById('main-list-content');

loadEmailContent();
function loadEmailContent() {
  
  
  const previewTitleContent = "Subject";
  let senderNameContent = "From";
  let sendTimeContent = '823782';
    
  
  const previewTextContent = "asdddddddddcjjjjjjjjjjjjjjjjjjjjjjjjjjjj cjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj cjjjjjjjjjjjjjjjjjjjjjjjjj";
  
    
  
  for (let i = 0; i < 30; i++) {
    
  
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
  
    
    star.innerHTML = '<i class="bi bi-star check-star-flag"></i>';
    
  
    leftDiv.appendChild(star);
  
    const important = document.createElement("div");
  
    important.classList.add("list-important");
  
  
    important.innerHTML =
      '<i class="bi bi-caret-right check-star-flag"></i>';
    
  
    leftDiv.appendChild(important);
  
    const sender = document.createElement("div");
    sender.classList.add("sender-div");
  
    const sendertext = document.createElement("span");
    sendertext.classList.add("sendertext");
  
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

  
    previewTitle.innerText = previewTitleContent + " - ";
  
    const previewText = document.createElement("div");
    previewText.classList.add("previewText");
    previewText.innerText = previewTextContent;
  
    preview.appendChild(previewTitle);
    preview.appendChild(previewText);
  
    rightDiv.appendChild(preview);
  
    const sendTime = document.createElement("div");
    sendTime.classList.add("preview-time", "col-md-3", "col-sm-3", "pe-4");
    
    const sendTimeinside = document.createElement("span");

    sendTimeinside.innerText = sendTimeContent;
  
    sendTime.appendChild(sendTimeinside);
  
    rightDiv.appendChild(sendTime);
  
    centralLineDiv.appendChild(rightDiv);
  
    emailPreviewBar.appendChild(centralLineDiv);
    emailPreviewBar.classList.add('clickable');

    contentDiv.appendChild(emailPreviewBar);

  }
}
