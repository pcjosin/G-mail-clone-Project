function tokenizeText(text: string): string[] {
    return text.trim().split(' ');
}

// Recursively traverse the HTML element and its children to get text content
function extractTextAndTokenize(element: HTMLElement): string[] {
    let textContent: string = '';

    function traverse(node: Node): void {
        if (node.nodeType === Node.TEXT_NODE) {
            textContent += removeUnknownCharacters((node as Text).textContent || '');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const elementNode = node as HTMLElement;
            if (
                elementNode.tagName.toLowerCase() !== 'style' &&
                elementNode.tagName.toLowerCase() !== 'script'
            ) {
                for (const childNode of elementNode.childNodes) {
                    traverse(childNode);
                }
            }
        }
    }

    traverse(element);
    const tokens: string[] = tokenizeText(textContent);
    console.log(textContent);
    return tokens;
}
//generate summary by sending post request to the flask server
async function generateSummary(element: HTMLElement, chunkSize: number = 3000): Promise<string> {
    const textChunks: string[] = extractTextAndTokenize(element);
    console.log(textChunks);

    let summary: string = '';

    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: textChunks, 
            }),
        };

        const response: Response = await fetch('http://localhost:5000/summarize', requestOptions);
        const responseData: { bert_summaries: string } = await response.json();

        if (!response.ok) {
            throw new Error(`Error generating summary: ${responseData.bert_summaries}`);
        }

        summary = responseData.bert_summaries;

        console.log(summary);
    }  catch (error: any) {
        console.error('Error generating summary:', error.message);
    }
    

    return summary;
}

//remove non alphanumeric characters
function removeUnknownCharacters(text: string): string {
    const cleanedText: string = text.replace(/[^\w\s]/gi, '').trim();
    return cleanedText;
}
