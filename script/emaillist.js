let mainListContent = document.getElementById('main-list-content');



function loadEmailContent() {

    console.log("function running");

    let senderNameContent = 'sender name';
    let previewTitleContent = 'this is preview title';
    let previewTextContent = 'this is preview of email body';
    let sendTimeContent = '09:23 pm';

    for (let i = 0; i < 30; i++) {

    console.log(i);

    const emailPreviewBar = document.createElement('div');
    emailPreviewBar.classList.add('d-flex','preview-bar');
    emailPreviewBar.id = 'previewEmail' + i;


    const centralLineDiv = document.createElement('div');
    centralLineDiv.classList.add('d-flex', 'mt-2', 'mb-2');
    centralLineDiv.id = 'centralDiv' + i;
        //left section
        
        // const right---//start from here

    const checkbox = document.createElement('div');
        checkbox.id = 'checkbox' + i;
        checkbox.classList.add('ms-3', 'me-2');
    checkbox.innerHTML = '<i class="bi bi-square"></i>';

    centralLineDiv.appendChild(checkbox);

    const star = document.createElement('div');
        star.id = 'star' + i;
        star.classList.add('ms-2', 'me-2');
    star.innerHTML = '<i class="bi bi-star"></i>';

    centralLineDiv.appendChild(star);

    const important = document.createElement('div');
        important.id = 'important' + i;
        important.classList.add('ms-2', 'me-2');

    important.innerHTML = '<i class="bi bi-flag"></i>';

    centralLineDiv.appendChild(important);

    const sender = document.createElement('div');
        sender.id = 'sender' + i;
        sender.classList.add('ms-2', 'me-2');


    const sendertext = document.createElement('span');
    sendertext.id = 'sendertext' + i;

    const sendertextInside = document.createElement('strong');
    sendertextInside.id = 'sendertextInside' + i;
    sendertextInside.innerText = senderNameContent;

    sendertext.appendChild(sendertextInside);
    sender.appendChild(sendertext);
        centralLineDiv.appendChild(sender);
        
    //right side


    const preview = document.createElement('div');
    preview.id = 'preview' + i;
    preview.classList = ('d-flex');

    const previewTitle = document.createElement('span');
    previewTitle.id = 'previewTitle' + i;

    const previewTitleInside = document.createElement('strong');
    previewTitleInside.id = 'previewTitleInside' + i;

    previewTitleInside.innerText = previewTitleContent +' - ';

    previewTitle.appendChild(previewTitleInside);

    const previewText = document.createElement('span');
    previewText.id = 'previewText' + i;
    previewText.innerText = previewTextContent;

    preview.appendChild(previewTitle);
    preview.appendChild(previewText);

    centralLineDiv.appendChild(preview);

    const sendTime = document.createElement('div');
    sendTime.id = 'sendTime' + i;
    const sendTimeinside = document.createElement('span');
    sendTimeinside.innerText = sendTimeContent;

    sendTime.appendChild(sendTimeinside);

    centralLineDiv.appendChild(sendTime);

    emailPreviewBar.appendChild(centralLineDiv);
    mainListContent.appendChild(emailPreviewBar);
    }

}


window.onload = loadEmailContent();