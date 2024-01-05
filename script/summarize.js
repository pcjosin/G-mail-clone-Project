function tokenizeText(text) {
    return text.trim().split(' ');
}



function extractTextAndTokenize(element, chunkSize) {
    // Recursively traverse the element and its children to get text content
    let textContent = '';

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textContent += removeUnknownCharacters(node.textContent)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Exclude certain elements (e.g., style and script tags)
            if (node.tagName.toLowerCase() !== 'style' && node.tagName.toLowerCase() !== 'script') {
                for (const childNode of node.childNodes) {
                    traverse(childNode);
                }
            }
        }
    }

    traverse(element);

    // Tokenize the filtered text content
    const tokens = textContent

    // Split tokens into chunks
    

    console.log(textContent);
    return textContent;
}






const element = document.getElementById('yourElementId'); // Replace with the actual ID of your element
const chunkSize = 2000;
const chunkedTokens = extractTextAndTokenize(element, chunkSize);
async function generateSummary(element, chunkSize = 3000) {
    const textChunks = extractTextAndTokenize(element, chunkSize);
    console.log(textChunks);

    const output=""

    let summary=""
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textChunks,  // Sending the text chunk to the server
                }),
            };

            const response = await fetch('http://localhost:5000/summarize', requestOptions);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Error generating summary: ${responseData.error}`);
            }

            summary = responseData.bert_summaries;
            
            console.log(summary);
        } catch (error) {
            console.error('Error generating summary:', error.message);
        }
    

    return summary

}


function removeUnknownCharacters(text) {
    // Remove non-alphanumeric characters and decode the string
    const cleanedText = text.replace(/[^\w\s]/gi, '').trim();

    return cleanedText;
}