"use strict";
const editableDiv = document.getElementById("message-container");
if (editableDiv) {
    editableDiv.innerHTML = "Type text here...";
    editableDiv.addEventListener("focus", () => {
        if (editableDiv) {
            editableDiv.style.border = "1px solid #007BFF";
        }
    });
    editableDiv.addEventListener("blur", () => {
        if (editableDiv) {
            editableDiv.style.border = "1px solid #ccc";
        }
    });
    editableDiv.addEventListener("input", () => {
        if (editableDiv) {
            const textContent = editableDiv.innerText;
            console.log("Text content:", textContent);
        }
    });
    function handleKeyPress(event) {
        // Enter key replaced by <br> tag
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            if (editableDiv) {
                document.execCommand('insertHTML', false, '<br>');
            }
        }
    }
}
