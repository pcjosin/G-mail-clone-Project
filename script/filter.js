let filterSvg = document.getElementById('filter-button-svg');
let filterDiv = document.getElementById('filter-expand-div');
filterDiv.style.display = 'none'
//checking if the click is on filter icon 
document.addEventListener('click', function(event) {
    if (event.target === filterSvg || filterSvg.contains(event.target) || filterDiv.contains(event.target)) {
        console.log("filter clicked");
        filterDiv.style.display = 'block'
        let fromInput = document.getElementById('from-input');
        let toInput = document.getElementById('to-input');
        let subjectInput = document.getElementById('subject-input');
        let hasInput = document.getElementById('has-input');
        let donotInput = document.getElementById('donot-input');

        let filterButton = document.getElementById('filter-apply-button');
        document.addEventListener('click',function(event){
            if (event.target === filterButton || filterButton.contains(event.target)){
                filterDiv.style.display = 'none'
                document.getElementById('main-list-content').innerHTML = ''
                filterEmails(fromInput.value,toInput.value,subjectInput.value,hasInput.value,donotInput.value);
            }
        })
        
    } else {
        filterDiv.style.display = 'none'
    }
});

//function to filter emails based on from address,to address, subject, the words that mail does and doesn't have
async function filterEmails(from, to, subject, hasWords, doesntHaveWords) {
    // Build the query string based on the provided parameters
    let queryString = '';

    if (from) {
        queryString += `from:${from} `;
    }

    if (to) {
        queryString += `to:${to} `;
    }

    if (subject) {
        queryString += `subject:${subject} `;
    }

    if (hasWords) {
        queryString += `${hasWords} `;
    }

    if (doesntHaveWords) {
        queryString += `-${doesntHaveWords} `;
    }

    try {
        // Perform the Gmail API search
        const response = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': queryString.trim(),
            'maxResults': 30,
        });

        const messages = response.result.messages;
        
        if (messages && messages.length > 0) {
            console.log('Filtered Messages:');
            for (let i = 0; i < messages.length; i++) {
                console.log('Message ID: ' + messages[i].id);
                listSearchedEmails(messages[i].id); //function to display the result emails after filtering
            }
        } else {
            console.log('No messages found.');
        }
    } catch (error) {
        console.error('Error filtering emails:', error);
    }
}
