function changeTheme(id){

    let displayBody=document.getElementById('main-body');

    // changing background image
    displayBody.style.backgroundImage=`url('http://127.0.0.1:5500/assets/images/themes/${id}.jpg')`;
    displayBody.style.backgroundSize='cover';

    // setting containers to transparent
    document.getElementsByClassName('main-container')[0].style.backgroundColor='transparent';
    document.getElementById('top-bar').style.backgroundColor='transparent';
    document.getElementById('main-list-content').style.backgroundColor='transparent';
    document.getElementById('search-bar-input').style.backgroundColor='transparent';
    
    
    
    //semi-tranparent containers
    document.getElementById('main-list-container').style.backgroundColor='rgba(255, 255, 255, 0.75)';
    
    searchBar=document.getElementById('search-bar');
    searchBar.style.backgroundColor='rgba(255, 255, 255, 0.30)';
    document.getElementById('main-list-header').style.backgroundColor='rgba(255, 255, 255, 0.85)';

    //icons color change
    let icons=document.getElementsByClassName('bi');
    Array.from(icons).forEach(function(icon){
        icon.setAttribute('fill','white');
    })



    document.getElementById("logo-icon").getElementsByTagName('img')[0].src="assets/images/logo_gmail_lockup_dark_2x_r5.png";

    //left-bar 
    let mainSidebar=document.getElementById('main-sidebar');
    let elements=mainSidebar.getElementsByTagName('*');
    let labelDiv=document.getElementsByClassName('labelDiv');

    console.log(elements);

    Array.from(elements).forEach(function(element){
        element.style.color='white';
    })

    //commpose button
    let composeButton= document.getElementById('compose-button');
    composeButton.style.backgroundColor='white';
    composeButton.style.color='black';
    composeButton.getElementsByTagName('i')[0].style.color='black';

}



// ................................Default theme Change
function changeThemeDeafult(){
    let displayBody=document.getElementById('main-body');
    displayBody.style.backgroundImage=`none`;
    displayBody.style.backgroundSize='cover';

    document.getElementById("logo-icon").getElementsByTagName('img')[0].src="assets/images/logo_gmail_lockup_default_1x_r5.png";

    document.getElementsByClassName('main-container')[0].style.backgroundColor='aliceblue';
    document.getElementById('search-bar-input').style.backgroundColor='white';

    //left-bar
    let mainSidebar=document.getElementById('main-sidebar');
    let elements=mainSidebar.getElementsByTagName('*');

    Array.from(elements).forEach(function(element){
        element.style.color='black';
    })

    //icon color change
    let icons=document.getElementsByClassName('bi');
    Array.from(icons).forEach(function(icon){
        icon.setAttribute('fill','black');
    })

    //commpose button
    let composeButton= document.getElementById('compose-button');
    composeButton.style.backgroundColor='#C2E7FF';
    composeButton.style.color='black';
    composeButton.getElementsByTagName('i')[0].style.color='black';

}