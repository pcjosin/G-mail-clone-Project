// JavaScript to handle the editable div
var editableDiv = document.getElementById("message-container");

// Set initial content
editableDiv.innerHTML = "Type text here...";

// Add focus and blur events for styling
editableDiv.addEventListener("focus", function () {
    editableDiv.style.border = "1px solid #007BFF";
});

editableDiv.addEventListener("blur", function () {
    editableDiv.style.border = "1px solid #ccc";
});

// Add input event for capturing text changes
editableDiv.addEventListener("input", function () {
    // Access the text content
    var textContent = editableDiv.innerText;
    console.log("Text content:", textContent);
});

function handleKeyPress(event) {
    // Check if the pressed key is Enter (keyCode 13) and not Shift + Enter
    if (event.keyCode === 13 && !event.shiftKey) {
        // Prevent the default behavior (inserting a new line)
        event.preventDefault();

        // Insert a line break (<br>) at the current caret position
        document.execCommand('insertHTML', false, '<br>');
    }
}


