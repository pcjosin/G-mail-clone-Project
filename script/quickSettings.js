"use strict";
window.onload = () => {
    fetch("../html/Quicksettings.html")
        .then((response) => response.text())
        .then((data) => {
        // Inject the loaded content into the container
        const quickSettingsContainer = document.getElementById("quick-settings");
        if (quickSettingsContainer) {
            quickSettingsContainer.innerHTML = data;
        }
    })
        .catch((error) => console.error("Error:", error));
    const quickSettingsElement = document.getElementById("quick-settings");
    if (quickSettingsElement) {
        quickSettingsElement.style.display = "none";
    }
};
const loadQuickSettings = () => {
    const quickSettingsElement = document.getElementById("quick-settings");
    if (quickSettingsElement) {
        quickSettingsElement.style.display = "block";
        const displayArea = document.getElementById("display-area");
        if (displayArea) {
            displayArea.classList.remove("col-md-10");
            displayArea.classList.add("col-md-7");
        }
        const mainHeaderDiv = document.getElementById("main-list-header");
        if (mainHeaderDiv) {
            mainHeaderDiv.style.width = "57%";
        }
        quickSettingsElement.classList.add("col-md-3");
    }
};
const closeQuickSettings = () => {
    const displayArea = document.getElementById("display-area");
    if (displayArea) {
        displayArea.classList.remove("col-md-7");
        displayArea.classList.add("col-md-10");
    }
    const mainHeaderDiv = document.getElementById("main-list-header");
    if (mainHeaderDiv) {
        mainHeaderDiv.style.width = "82%";
    }
    const quickSettingsElement = document.getElementById("quick-settings");
    if (quickSettingsElement) {
        quickSettingsElement.classList.remove("col-md-3");
        quickSettingsElement.style.display = "none";
    }
};
// Change density of email layout
function densityInput(id) {
    const previewBars = document.getElementsByClassName('preview-bar');
    for (let index = 0; index < previewBars.length; index++) {
        const previewBar = previewBars[index];
        if (id === "default-radio-button") {
            previewBar.style.padding = '9px';
        }
        else if (id === "comfortable-radio-button") {
            previewBar.style.padding = '15px';
        }
        else if (id === "compact-radio-button") {
            previewBar.style.padding = '1px';
        }
    }
}
