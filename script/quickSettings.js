window.onload=()=>{
  fetch("html/Quicksettings.html")
      .then((response) => response.text())
      .then((data) => {
        // Inject the loaded content into the container
        document.getElementById("quick-settings").innerHTML = data;
      })
      .catch((error) => console.error("Error:", error));

      document.getElementById("quick-settings").style.display="none";
}

let loadQuickSettings=()=> {
    // fetch("html/Quicksettings.html")
    //   .then((response) => response.text())
    //   .then((data) => {
    //     // Inject the loaded content into the container
    //     document.getElementById("quick-settings").innerHTML = data;
    //   })
    //   .catch((error) => console.error("Error:", error));
       
      document.getElementById("quick-settings").style.display="block";
      let displayArea=document.getElementById('display-area') ;
      displayArea.classList.remove('col-md-10');
  displayArea.classList.add('col-md-7');
  let mainHeaderDiv = document.getElementById("main-list-header");
  mainHeaderDiv.style.width = '57%';

      let quickSettings=document.getElementById('quick-settings');
      quickSettings.classList.add('col-md-3');
  };

  let closeQuickSettings=()=>{
    let displayArea=document.getElementById('display-area') ;
    displayArea.classList.remove('col-md-7');
    displayArea.classList.add('col-md-10');
    let mainHeaderDiv = document.getElementById("main-list-header");
    mainHeaderDiv.style.width = '82%';

    let quickSettings=document.getElementById('quick-settings');
    quickSettings.classList.remove('col-md-3');

    // document.getElementById("quick-settings").innerHTML ="";
    document.getElementById("quick-settings").style.display="none";
  };