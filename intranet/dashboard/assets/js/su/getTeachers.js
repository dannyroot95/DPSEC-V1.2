/*===== API STUDENTS  =====*/ 
//localStorage.removeItem("students")
  
let cacheSt = localStorage.getItem("teachers")
let pCache = JSON.parse(cacheSt)

var dni = document.getElementById('dni')
var fullname = document.getElementById('fullname')

if(pCache == null){

  document.getElementById("loader").style = "display:block;margin-top:14px;"
  getTeachersFromDatabase()
  
}else{
  getTeachersFromCache()
}


/*===== END API STUDENTS  =====*/ 

$('#password').keyup(function(e) {
  var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
  var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
  var enoughRegex = new RegExp("(?=.{6,}).*", "g");
  if (false == enoughRegex.test($(this).val())) {
          $('#passstrength').html('La contraseña debe contener 6 caracteres como mínimo.');
          document.getElementById("passstrength").style = "font-weight:bold;color:#000;"
  } else if (strongRegex.test($(this).val())) {
          $('#passstrength').className = 'ok';
          $('#passstrength').html('Fuerte!');
          document.getElementById("passstrength").style = "font-weight:bold;color:#0082AF;"
  } else if (mediumRegex.test($(this).val())) {
          $('#passstrength').className = 'alert';
          $('#passstrength').html('Media!');
          document.getElementById("passstrength").style = "font-weight:bold;color:#00AF4A;"
  } else {
          $('#passstrength').className = 'error';
          $('#passstrength').html('Débil!');
          document.getElementById("passstrength").style = "font-weight:bold;color:red;"
  }
  return true;
});

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
        document.getElementById("code").value = invert(dni.value)
        

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

function clearInputs(){
    document.getElementById("code").disabled = false
    document.getElementById("fullname").value = ""
    document.getElementById("dni").value = ""
    document.getElementById("personal-email").value = ""
    document.getElementById("institucional-email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("passstrength").innerHTML = ""
    document.getElementById("progress-div").style = "display:none;"
}

function invert(cad) {
  return cad.split("").reverse().join("");
}


function saveTeacher(){

    let code = document.getElementById("code").value
    let email = document.getElementById("personal-email").value
    var password = document.getElementById("password").value 
    let institucionalMail = document.getElementById("institucional-email").value
    let fullname = document.getElementById("fullname").value
    let dni = document.getElementById("dni").value
    var text1 = document.getElementById("academic");
    var academic = text1.options[text1.selectedIndex].text;

    var text2 = document.getElementById("condition");
    var condition = text2.options[text2.selectedIndex].text;
   
        
  
    var result = ""

    if(email != "" && institucionalMail != "" && code != "" && password != "" && fullname != "" && dni != ""){

      if(password.length >= 6){

        document.getElementById("progress-div").style = "display: block;margin-left: 40px;margin-right: 40px;"
        document.getElementById("code").disabled = true
        hideElementsOnRegister()

        db.collection("users").where("code", "==",code).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            result = doc.data().code;
          })
  
          if(result == code){
              Swal.fire(
                  "¡Error!",
                  "Este docente ya está registrado!",
                  "error"
                )
                document.getElementById("progress-div").style = "display:none;"
                document.getElementById("code").disabled = false
                showElementsOnRegister()
          }else{
            
              firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
  
                  var idUser = userCredential.user.uid;
                 
                  var data = {
  
                      id:idUser,
                      fullName : fullname,
                      dni : dni,
                      code:code,
                      type_user : "teacher",
                      date_register : Date.now(),
                      date_modification : null,
                      personal_mail : email,
                      academic_degree : academic,
                      condition : condition,
                      institucional_mail : institucionalMail,
                      modified_by : null,
                      created_by : "SUPER ADMINISTRADOR",
                      profile_completed : "1"
  
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
  
                document.getElementById("code").value = ""
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
                showElementsOnRegister()
                document.getElementById("progress-div").style = "display:none;"
                document.getElementById("code").disabled = false

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



function getTeachersFromDatabase(){

    db.collection("users").where("type_user", "==", "teacher").onSnapshot((querySnapshot) => {

      let ctx = 0
      var currentCache = JSON.parse(localStorage.getItem("teachers"))

        users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if(users.length > 0){

            if(ObjCompare(currentCache,users) > 0){

              $('#tb-teachers').DataTable().destroy()
              $("#tbody").html(
            
                users.map((user) => {

                ctx++

                let account = ""
                if(user.profile_completed == "1"){
                  account = "<b style='color:#145A32'>Aceptado<b>"
                }else{
                  account = "<b style='color:#FC0000'>Pendiente<b>"
                }

                  return `
                  <tr style="cursor: pointer" onclick="setData('${user.academic_degree}', '${user.fullName}','${user.id}', 
                  '${user.code}','${user.date_modification}','${user.date_register}','${user.personal_mail}',
                  '${user.institucional_mail}','${user.modified_by}','${user.created_by}','${user.profile_completed}')">

                  <td><strong>${ctx}</strong></td>
                  <td>${user.fullName}</td>
                  <td>${user.dni}</td>
                  <td>${user.code}</td>
                  <td>${user.academic_degree}</td>
                  <td>${account}</td>
                  </tr>`;
               
              })
              .join("")
          );

          createScriptDatatable()
          localStorage.setItem("teachers",JSON.stringify(users))
          document.getElementById("loader").style = "display:none;"
        
        }
      }else{
          createScriptDatatable()
          document.getElementById("loader").style = "display:none;"
      }
             
    }, (error) => {
      console.log(error)
  }); 
  
}

function getTeachersFromCache(){

  let ctx = 0
  
  $("#tbody").html(

    pCache.map((user) => {

        ctx++

        let account = ""
        if(user.profile_completed == "1"){
          account = "<b style='color:#145A32'>Aceptado<b>"
        }else{
          account = "<b style='color:#FC0000'>Pendiente<b>"
        }


          return `
          <tr style="cursor: pointer" onclick="setData('${user.academic_degree}', '${user.fullName}','${user.id}', 
                  '${user.code}','${user.date_modification}','${user.date_register}','${user.personal_mail}',
                  '${user.institucional_mail}','${user.modified_by}','${user.created_by}','${user.profile_completed}')">

                  <td><strong>${ctx}</strong></td>
                  <td>${user.fullName}</td>
                  <td>${user.dni}</td>
                  <td>${user.code}</td>
                  <td>${user.academic_degree}</td>
                  <td>${account}</td>
                  </tr>`;
       
      })
      .join("")
  );

$('#tb-teachers').DataTable().destroy()
createScriptDatatable()
getTeachersFromDatabase()

}

function setData(academic,fullname,id,code,dateModification,dateRegister,personalMail,institucionalMail,
  modifiedBy,createdBy,profile_completed){

  $('#detailModal').modal('show')

  document.getElementById("div-no-account").innerHTML = ""
   document.getElementById("detail-academic").value = academic
   document.getElementById("detail-code").value = code
   document.getElementById("detail-fullname").innerHTML = fullname
   document.getElementById("detail-personal-mail").value = personalMail
   document.getElementById("detail-institutional-mail").value = institucionalMail
   document.getElementById("detail-date-register").value = onlyDateNumber(parseInt(dateRegister))+" "+onlyHour(parseInt(dateRegister)) 
   document.getElementById("detail-created-by").value = createdBy

   if(modifiedBy != "null"){
    document.getElementById("div-modified-by").style = "display:block;"
    document.getElementById("detail-modified-by").value =  modifiedBy
   }else{
    document.getElementById("div-modified-by").style = "display:none;"
   }

   if(dateModification != "null"){
    document.getElementById("div-date-modified").style = "display:block;"
    document.getElementById("detail-date-modified").value = onlyDateNumber(parseInt(dateModification))+" "+onlyHour(parseInt(dateModification))  
   }else{
    document.getElementById("div-date-modified").style = "display:none;"
   }

   if(profile_completed == "0"){
    document.getElementById("div-no-account").innerHTML = `<button type="button" onclick="aprovedAccountModal('${id}','${institucionalMail}')" class="btn btn-success">Aprobar Cuenta</button>`
   }

}

function aprovedAccountModal(id,institucionalMail){
  Swal.fire({
    title: 'Estas seguro de aprobar la cuenta del docente?',
    showCancelButton: true,
    confirmButtonText: 'Si',
    cancelButtonText : 'No'
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      updateProfileTeacher(id,institucionalMail)
      $('#detailModal').modal('hide')
      Swal.fire('Cuenta de docente aprobada!', '', 'success')
    }
  })
}

function updateProfileTeacher(id,institucionalMail){
  db.collection("users").doc(id).update({profile_completed:"1"})
  sendEmailAproved(institucionalMail)
}

function sendEmailAproved(email) {
 
  const parameters = { 
     header_email :"DPSEC-CUENTA-DOCENTE",
     email:"proyeccionsocial.unamad@gmail.com",
     password :"uwzttrdoispffwca",
     to :email,
     message : "Su cuenta ha sido aprobada!!",
     email_template :"notify-dpsec.html"
  };

    fetch('https://service-email.onrender.com/send-email', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      mode:'no-cors',
      body: JSON.stringify(parameters),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })

}

function createScriptDatatable(){

  $('#tb-teachers').DataTable({
    language: {
          "decimal": "",
          "emptyTable": "No hay información",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ datos",
          "infoEmpty": "Mostrando 0 to 0 of 0 datos",
          "infoFiltered": "(Filtrado de _MAX_ total datos)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Mostrar _MENU_ datos",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Buscar:",
          "zeroRecords": "Sin resultados encontrados",
          "paginate": {
              "first": "Primero",
              "last": "Ultimo",
              "next": "Siguiente",
              "previous": "Anterior"
          }
   },
  
  });

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


function ObjCompare(obj1, obj2){

  var ctx = 0

  if(obj1 != null && obj2 != null){

    if(obj1.length == obj2.length){

      for(let i = 0 ; i < obj1.length ; i++){
        if(obj1[i].id != obj2[i].id){
          ctx++
        }
        else if(obj1[i].fullName != obj2[i].fullName){
          ctx++
        }else if(obj1[i].personal_mail != obj2[i].personal_mail){
          ctx++
        }else if(obj1[i].institucional_mail != obj2[i].institucional_mail){
          ctx++
        }else if(obj1[i].date_modification != obj2[i].date_modification){
          ctx++
        }else if(obj1[i].modified_by != obj2[i].modified_by){
          ctx++
        }else if(obj1[i].profile_completed != obj2[i].profile_completed){
          ctx++
        }
      }
    }else{
      ctx++
    }

  }else{
    ctx++
  }

return ctx

  //

}