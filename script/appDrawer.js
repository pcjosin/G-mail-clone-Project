"use strict";
let menuIcon = document.getElementById("icon-menu");
let appDivOpen = document.getElementById("app-drawer-expand-container");
if (menuIcon && appDivOpen) {
    menuIcon.onclick = () => {
        appDivOpen.style.display = 'block';
        console.log("App drawer clicked");
    };
    // hide the app drawer when clicked outside
    document.addEventListener("click", function (event) {
        // Check if the clicked element is NOT the div or a child of the div
        if (event.target !== appDivOpen &&
            !appDivOpen.contains(event.target) &&
            event.target !== menuIcon &&
            !menuIcon.contains(event.target)) {
            // Hide the div
            appDivOpen.style.display = 'none';
        }
    });
}
