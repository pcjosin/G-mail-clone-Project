let menuIcon = document.getElementById("icon-menu") as HTMLElement;
let appDivOpen = document.getElementById("app-drawer-expand-container") as HTMLElement;

if (menuIcon && appDivOpen) {
  menuIcon.onclick = () => {
    appDivOpen.style.display = 'block';
    console.log("App drawer clicked");
  };

  // hide the app drawer when clicked outside
  document.addEventListener("click", function (event) {
    // Check if the clicked element is NOT the div or a child of the div
    if (
      event.target !== appDivOpen &&
      !appDivOpen.contains(event.target as Node) &&
      event.target !== menuIcon &&
      !menuIcon.contains(event.target as Node)
    ) {
      // Hide the div
      appDivOpen.style.display = 'none';
    }
  });
}
