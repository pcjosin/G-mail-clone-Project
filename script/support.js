document.addEventListener('DOMContentLoaded', function() {
    let supportIcon = document.getElementById('support-button-svg');
    let supportDiv = document.getElementById('support-expand-div');
    supportDiv.style.display = 'none';
    document.addEventListener('click', function(event) {
        if (event.target == supportIcon || supportIcon.contains(event.target) || supportDiv.contains(event.target)) {
            console.log("support clicked");
            supportDiv.style.display = 'block';
            
            //checking where the click is clicked
            document.addEventListener('click',function(event){
                if(document.getElementById('help-button').contains(event.target)){
                    console.log('help clicked')
                    let linkUrl = 'https://support.google.com/mail/?hl=en#topic=7065107';
                    window.open(linkUrl, '_blank');
                }
                if(document.getElementById('training-button').contains(event.target)){
                    let linkUrl = 'https://support.google.com/a/users/answer/9259748?visit_id=01704694297250-1941712032305222081&p=gmail_training&rd=1';
                    window.open(linkUrl, '_blank');
                }
                if(document.getElementById('updates-button').contains(event.target)){
                    let linkUrl = 'https://support.google.com/mail/answer/7240188?hl=en&co=GENIE.Platform%3DAndroid';
                    window.open(linkUrl, '_blank');
                }
                if(document.getElementById('feedback-button').contains(event.target)){            
                    let linkUrl = 'https://www.google.com/tools/feedback/intl/en/';
                    window.open(linkUrl, '_blank');
                }
            })
        } else {
            supportDiv.style.display = 'none';
        }
    });
});
