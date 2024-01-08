var editableDiv = document.getElementById("message-container");
editableDiv.innerHTML = "Type text here...";

editableDiv.addEventListener("focus", function () {
    editableDiv.style.border = "1px solid #007BFF";
});

editableDiv.addEventListener("blur", function () {
    editableDiv.style.border = "1px solid #ccc";
});

editableDiv.addEventListener("input", function () {
    var textContent = editableDiv.innerText;
    console.log("Text content:", textContent);
});

function handleKeyPress(event) { //enter key replaced by <br> tag
    if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        document.execCommand('insertHTML', false, '<br>');
    }
}


