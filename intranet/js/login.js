
var pass = document.getElementById("password")
var mail = document.getElementById("email")
var dni = document.getElementById('dni')
var fullname = document.getElementById('fullname')

dni.addEventListener('input', updateValue);
function updateValue(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').toLowerCase()
    var value = e.srcElement.value
    if(value.length == 8){
	    dni.disabled = true
		  fetch('/intranet/dashboard/assets/js/utils/controllerDNI.php'+"?dni="+value)
      .then(response => {responseClone = response.clone(); // 2
      return response.json();})
      .then(data => {
      
        dni.disabled = false
        fullname.value = data.nombre
        

      }, function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        responseClone.text() // 5
        .then(function (bodyText) {
            if(bodyText == "Not found"){
            dni.disabled = false
            fullname.value = ""
            console.log('Received the following instead of valid JSON:', bodyText); // 6
            Swal.fire(
                      'Oops!',
                      'Sin resultados!',
                      'info'
                    )
            }else{
            dni.disabled = false
            fullname.value = ""
            console.log('Received the following instead of valid JSON:', bodyText); // 6
            Swal.fire(
                      'Oops!',
                      'Intentelo nuevamente!',
                      'info'
                    )
            }
        });
    });
       
    }else{
       fullname.value = ""
    }
}

pass.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("btn-login").click();
  }
});

mail.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("btn-login").click();
  }
});


function login(){

    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    if(email != "" && password != ""){

        document.getElementById("loader").style = "display:block;"
        document.getElementById("credentials").style = "display:none;"
        document.getElementById("email").disabled = true
        document.getElementById("password").disabled = true
        document.getElementById("btn-login").disabled = true
        

        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {

            var uid = response.user.uid;
  
            db.collection("users").doc(uid).get().then((snapshot) =>{

              if (snapshot.exists) {

                if(snapshot.data().profile_completed == "1"){
                  localStorage.setItem("currentUser",uid)
                  localStorage.setItem("currentUserData",JSON.stringify(snapshot.data()))
                  window.location.href = "/intranet/dashboard"
                }else{
                  document.getElementById("loader").style = "display:none;"
                  document.getElementById("credentials").style = "display:block;"
                  document.getElementById("email").disabled = false
                  document.getElementById("password").disabled = false
                  document.getElementById("btn-login").disabled = false
                  Swal.fire(
                    'Oopss!',
                    'Se debe confirmar su cuenta, comuníquese con la dirección!',
                    'warning'
                  )
                }

               
              }else{
                console.log("no existe")
              }

             

            }).catch((error) =>{
              alert("Error : "+error)
              window.location.reload() 
            })
             
        }).catch((error) => {
           
            var errorCode = error.code;
            var errorMessage = error.message;

            document.getElementById("loader").style = "display:none;"
            document.getElementById("credentials").style = "display:block;"
            document.getElementById("email").disabled = false
            document.getElementById("password").disabled = false
            document.getElementById("btn-login").disabled = false
  
            if(errorCode == "auth/user-not-found"){
              Swal.fire(
                  'Error!',
                  'Este usuario no existe!',
                  'error'
                )
            }else if(errorCode == "auth/wrong-password"){
              Swal.fire(
                  'Oopss!',
                  'Contraseña incorrecta!',
                  'warning'
                )
            }else{
              Swal.fire(
                  'Oopss!',
                  'Error 404!',
                  'error'
                )
            }
  
            console.log(errorCode +" "+errorMessage)
          });		


    }else{

        Swal.fire(
            'Oopss!',
            'Complete los campos!',
            'warning'
          )

    }

}

function modalRegTeacher(){
  
  $('#registerModal').modal('show')

}

function saveTeacher(){

  let email2 = document.getElementById("personal-email").value
  var password2 = document.getElementById("password2").value 
  let institucionalMail = document.getElementById("institucional-email").value
  let fullname = document.getElementById("fullname").value
  let dni = document.getElementById("dni").value
  var text1 = document.getElementById("academic");
  var academic = text1.options[text1.selectedIndex].text;

  var text2 = document.getElementById("condition");
  var condition = text2.options[text2.selectedIndex].text;

  var result = ""

    if(email2 != "" && institucionalMail != "" && password2 != "" && fullname != "" && dni != ""){

      if(password2.length >= 6){

        document.getElementById("progress-div").style = "display: block;margin-left: 40px;margin-right: 40px;"
        hideElementsOnRegister()

        db.collection("users").where("code", "==",reverseNumber(dni)).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            result = doc.data().dni;
          })
  
          if(result == reverseNumber(dni)){
              Swal.fire(
                  "¡Error!",
                  "Este docente ya está registrado!",
                  "error"
                )
                document.getElementById("progress-div").style = "display:none;"
                showElementsOnRegister()
          }else{
            
              firebase.auth().createUserWithEmailAndPassword(email2, password2).then((userCredential) => {
  
                  var idUser = userCredential.user.uid;
                 
                  var data = {
  
                      id:idUser,
                      fullName : fullname,
                      dni : dni,
                      code:reverseNumber(dni).toString(),
                      type_user : "teacher",
                      date_register : Date.now(),
                      date_modification : null,
                      personal_mail : email2,
                      academic_degree : academic,
                      condition : condition,
                      institucional_mail : institucionalMail,
                      modified_by : null,
                      created_by : fullname,
                      profile_completed : "0"
  
                  }

                 
                  db.collection("users").doc(idUser).set(data).catch((error) => {
                    
                    Swal.fire(
                      "Error!",
                      "Docente no Registrado!",
                      "error"
                    )

                    clearInputs()
                    showElementsOnRegister()
  
                });
  
          
                clearInputs()
                showElementsOnRegister()
     
                Swal.fire(
                  "¡Exitoso!",
                  "Docente Registrado!",
                  "success"
                )     
       
              }).catch((error) => {

                Swal.fire(
                  "Error!",
                  "Pruebe con otro correo!",
                  "error"
                )
                console.log(error.message)     
                showElementsOnRegister()
                document.getElementById("progress-div").style = "display:none;"
              

              })
          }
      })
    }else{

      
      Swal.fire(
        "¡Oopss!",
        "La contraseña debe contener 6 caracteres como mínimo!",
        "warning"
      )   

    }

      
  }else{
    Swal.fire(
      "Hey!",
      "Complete los campos!",
      "warning"
    )
  }

}

function clearInputs(){
  document.getElementById("fullname").value = ""
  document.getElementById("dni").value = ""
  document.getElementById("personal-email").value = ""
  document.getElementById("institucional-email").value = ""
  document.getElementById("password2").value = ""
  document.getElementById("passstrength").innerHTML = ""
  document.getElementById("progress-div").style = "display:none;"
}

function reverseNumber(n) {
  const convertAndReverse = n.toString().split("").reverse().join("");
  return Number(convertAndReverse).toString();
}

function hideElementsOnRegister(){

  document.getElementById("btn-save").disabled = true
  document.getElementById("btn-close-modal").style = "display:none;"
  document.getElementById("modal-icon-close").style = "display:none;"

}

function showElementsOnRegister(){

  document.getElementById("btn-save").disabled = false
  document.getElementById("btn-close-modal").style = "display:block;"
  document.getElementById("modal-icon-close").style = "display:block;"

}