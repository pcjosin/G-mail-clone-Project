// let mainListContent = document.getElementById('main-list-content');



function loadEmailContent(senderNameContent, previewTitleContent, previewTextContent, sendTimeContent) {

    console.log("function running");

    // let senderNameContent = 'sender name';
    // let previewTitleContent = 'this is preview title';
    // let previewTextContent = 'this is preview of email body this is preview of email body this is preview of email body this is preview of email body this is preview of email body';
    // let sendTimeContent = '09:23 pm';

    // for (let i = 0; i < 30; i++) {

        console.log(i);

        const emailPreviewBar = document.createElement('div');
        emailPreviewBar.classList.add('preview-bar',);
        


        const centralLineDiv = document.createElement('div');
        centralLineDiv.classList.add('row', 'mt-1', 'mb-1','central-div');
     
        //left section

        const leftDiv = document.createElement('div');
  
        leftDiv.classList.add('left-div','col-md-4');


        const checkbox = document.createElement('div');
  
        checkbox.classList.add('list-check-box');
        checkbox.innerHTML = '<i class="bi bi-square check-star-flag"></i>';

        leftDiv.appendChild(checkbox);

        const star = document.createElement('div');

        star.classList.add('list-star');
        star.innerHTML = '<i class="bi bi-star check-star-flag"></i>';

        leftDiv.appendChild(star);

        const important = document.createElement('div');

        important.classList.add('list-important');

        important.innerHTML = '<i class="bi bi-flag check-star-flag"></i>';

        leftDiv.appendChild(important);

        const sender = document.createElement('div');
        sender.classList.add('sender-div');


        const sendertext = document.createElement('span');
        sendertext.classList.add('sendertext');

        sendertext.innerText = senderNameContent+i;
        sender.appendChild(sendertext);
        leftDiv.appendChild(sender);


        centralLineDiv.appendChild(leftDiv);



        const rightDiv = document.createElement('div');
        rightDiv.classList.add('right-div','col-md-8','d-flex');


        const preview = document.createElement('div');
        preview.classList = ('preview','col','d-flex');

        const previewTitle = document.createElement('div');
        previewTitle.classList.add('previewTitle');

        previewTitle.innerText = previewTitleContent + ' - ';

        const previewText = document.createElement('div');
        previewText.classList.add('previewText');
        previewText.innerText = previewTextContent;

        preview.appendChild(previewTitle);
        preview.appendChild(previewText);

        rightDiv.appendChild(preview);

        const sendTime = document.createElement('div');
        sendTime.classList.add('preview-time','col-md-3','col-sm-3');
        const sendTimeinside = document.createElement('span');
        sendTimeinside.innerText = sendTimeContent;

        sendTime.appendChild(sendTimeinside);

        rightDiv.appendChild(sendTime);

        centralLineDiv.appendChild(rightDiv);


    emailPreviewBar.appendChild(centralLineDiv);
    return emailPreviewBar;

    // }

}


// window.onload = loadEmailContent();