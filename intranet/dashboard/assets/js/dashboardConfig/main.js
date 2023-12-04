/*===== EXPANDER MENU  =====*/ 
let dataLog = JSON.parse(localStorage.getItem("currentUserData"))


const showMenu = (toggleId, navbarId, bodyId)=>{
  const toggle = document.getElementById(toggleId),
  navbar = document.getElementById(navbarId),
  bodypadding = document.getElementById(bodyId)

  if(toggle && navbar){
    toggle.addEventListener('click', ()=>{
      navbar.classList.toggle('expander')

      bodypadding.classList.toggle('body-pd')
    })
  }
}
showMenu('nav-toggle','navbar','body-pd')
document.getElementById("name-sidebar").innerHTML = dataLog.fullName

/*===== LINK ACTIVE  =====*/ 


/*===== COLLAPSE MENU  =====*/ 
const linkCollapse = document.getElementsByClassName('collapse__link')

for(var i=0;i<linkCollapse.length;i++){
  linkCollapse[i].addEventListener('click', function(){
    const collapseMenu = this.nextElementSibling
    collapseMenu.classList.toggle('showCollapse')

    const rotate = collapseMenu.previousElementSibling
    rotate.classList.toggle('rotate')
  })
}


if(type.type_user != "student"){

  const navL = document.getElementsByClassName('noSub') 
  for(var j = 0 ; j<navL.length;j++){
  
    navL[j].addEventListener('click', function(){
      let element = document.getElementById('collapseDocs');
      element.className = element.className.replace('collapse__menu showCollapse', 'collapse__menu');

    })
  }
  
}



function showData(value){

  document.getElementsByClassName("collapse__link")[value].click()

  if(value == 0){
    let element1 = document.getElementById('collapseDocs')
    let element2 = document.getElementById('collapseProjects')
    element1.className = element1.className.replace('collapse__menu showCollapse', 'collapse__menu')
    element2.className = element2.className.replace('collapse__menu showCollapse', 'collapse__menu')
  
  }else if(value == 1){
    let element1 = document.getElementById('collapseUsers')
    let element2 = document.getElementById('collapseDocs')
    element1.className = element1.className.replace('collapse__menu showCollapse', 'collapse__menu')
    element2.className = element2.className.replace('collapse__menu showCollapse', 'collapse__menu')
  }else if(value == 2){
    let element1 = document.getElementById('collapseUsers')
    let element2 = document.getElementById('collapseProjects')
    element1.className = element1.className.replace('collapse__menu showCollapse', 'collapse__menu')
    element2.className = element2.className.replace('collapse__menu showCollapse', 'collapse__menu')
  }

}
let on=false;
function showDataForTeacher(){

on = !on;
  //document.getElementsByClassName("collapse__link")[value].click()
  console.log(on)
  if(on === false ){
    console.log("fvf")
    let element2 = document.getElementById('collapseDocs')
    element2.className = element2.className.replace('collapse__menu showCollapse', 'collapse__menu') 
     return
  }
  $('#collapseDocs').addClass('collapse__menu showCollapse')

}

function dropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function logout(){

  $.blockUI({ css: { 
    border: 'none', 
    padding: '15px', 
    backgroundColor: '#000000', 
    '-webkit-border-radius': '10px', 
    '-moz-border-radius': '10px', 
    color: '#fff' 
} ,message:'Cerrando sesión...'})

  firebase.auth().signOut().then(() => {
    localStorage.clear()
    window.location.href = "../"
    }).catch((error) => {
      // An error happened.
      $.unblockUI();
    });

}
