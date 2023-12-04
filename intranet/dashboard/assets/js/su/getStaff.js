/*===== API STUDENTS  =====*/ 
//localStorage.removeItem("students")
var staff = []
var filterType = ""

let cacheSt = localStorage.getItem("staff")
let pCache = JSON.parse(cacheSt)


if(pCache == null){

  document.getElementById("loader").style = "display:block;margin-top:14px;"
  getStaffsFromDatabase()
  
}else{

  getStaffsFromCache()

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


function clearInputs(){
    document.getElementById("code").disabled = false
    document.getElementById("code").value = ""
    document.getElementById("fullname").value = ""
    document.getElementById("dni").value = ""
    document.getElementById("personal-email").value = ""
    document.getElementById("institucional-email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("passstrength").innerHTML = ""
    document.getElementById("progress-div").style = "display:none;"
}


function saveStaff(){

    
    let email = document.getElementById("personal-email").value
    var password = document.getElementById("password").value 
    let institucionalMail = document.getElementById("institucional-email").value
    let dni = document.getElementById("dni").value
    let fullname = document.getElementById("fullname").value
    let code = document.getElementById("code").value
  
    var result = ""

    if(email != "" && email != "" && password != ""){

      if(password.length >= 6){

        document.getElementById("progress-div").style = "display: block;margin-left: 40px;margin-right: 40px;"
        document.getElementById("code").disabled = true
        hideElementsOnRegister()

        db.collection("users").where("code", "==", code).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            result = doc.data().code;
          })
  
          if(result == code){
              Swal.fire(
                  "¡Error!",
                  "Este personal ya está registrado!",
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
                      code : code+dni,
                      dni : dni,
                      type_user : "staff",
                      date_register : Date.now(),
                      date_modification : null,
                      personal_mail : email,
                      institucional_mail : institucionalMail,
                      modified_by : null,
                      created_by : "SUPER ADMINISTRADOR",
                      profile_completed : "1"
  
                  }

                 
                  db.collection("users").doc(idUser).set(data).catch((error) => {
                    
                    Swal.fire(
                      "Error!",
                      "Personal no Registrado!",
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
                  "Personal Registrado!",
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



function getStaffsFromDatabase(){
 
    db.collection("users").where("type_user", "==", "staff").onSnapshot((querySnapshot) => {

      let ctx = 0
      let staff = []

        users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if(users.length > 0){

            $('#tb-staff').DataTable().destroy()
            $("#tbody").html(
            users
              .map((user) => {

                ctx++

                staff.push(user)

                  return `
                  <tr style="cursor: pointer" onclick="setData('${user.dni}', '${user.fullName}','${user.id}', 
                  '${user.code}','${user.date_modification}','${user.date_register}','${user.personal_mail}',
                  '${user.institucional_mail}','${user.modified_by}','${user.created_by}')">

                  <td><strong>${ctx}</strong></td>
                  <td>${user.fullName}</td>
                  <td>${user.dni}</td>
                  <td>${user.code}</td>
                  <td>${onlyDateNumber(user.date_register)}</td>
                  </tr>`;
               
              })
              .join("")
          );

          //console.log(students)
          createScriptDatatable()
          localStorage.setItem("staff",JSON.stringify(staff))
          document.getElementById("loader").style = "display:none;"
          document.getElementById("code").value = ctx+1

        }
             

    }, (error) => {
      console.log(error)
  }); 
  
}

function getStaffsFromCache(){

  let ctx = 0
  
  $("#tbody").html(

    pCache.map((user) => {

        ctx++

          return `
          <tr style="cursor: pointer" onclick="setData('${user.dni}', '${user.fullName}','${user.id}', 
                  '${user.code}','${user.date_modification}','${user.date_register}','${user.personal_mail}',
                  '${user.institucional_mail}','${user.modified_by}','${user.created_by}')">

                  <td><strong>${ctx}</strong></td>
                  <td>${user.fullName}</td>
                  <td>${user.dni}</td>
                  <td>${user.code}</td>
                  <td>${onlyDateNumber(parseInt(user.date_register))}</td>
                  </tr>`;
       
      })
      .join("")
  );

$('#tb-staff').DataTable().destroy()
createScriptDatatable()
getStaffsFromDatabase()

}

function setData(dni,fullname,id,code,dateModification,dateRegister,personalMail,institucionalMail,
  modifiedBy,createdBy){

  $('#detailModal').modal('show')

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


}


function createScriptDatatable(){

  $('#tb-students').DataTable({
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