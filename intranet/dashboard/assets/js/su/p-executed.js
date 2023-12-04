var statusJson
var statusMod
var statusCarrers
let cache = localStorage.getItem("p-executed")
let pCache = JSON.parse(cache)
let user = JSON.parse(localStorage.getItem("currentUserData"))   


fetchModality()
fetchCarrers()
allFetch()

if(pCache == null){
  document.getElementById("loader").style = "display:block;"
  getProjects()

}else{
  getProjectsFromCache()
}

function allFetch(){

    fetch('/intranet/dashboard/assets/js/utils/status.json')
      .then((response) => 
            response.json())
      .then((json) => 
              {
                statusJson = json
              }
          );
  
  } 

  function fetchModality(){

    fetch('/intranet/dashboard/assets/js/utils/modality.json')
      .then((response) => 
            response.json())
      .then((json) => 
              {
                statusMod = json
              }
          );
  
  }   

  function fetchCarrers(){

    fetch('/intranet/dashboard/assets/js/utils/carrersJson.json')
      .then((response) => 
            response.json())
      .then((json) => 
              {
                statusCarrers= json
              }
          );
  
  }   

  
function getProjects(){

    db.collection("projects_executed").onSnapshot(snapshot =>{

        let ctx = 0
        let p_projects = []

        values = snapshot.docs.map((doc) => ({
            ...doc.data(),id: doc.id
      }));

      if(values.length > 0){
        $('#tb-projects').DataTable().destroy()

        $("#tbody").html(
            values
              .map((data) => {

                ctx++
                p_projects.push(data)
    
                return `<tr style="cursor: pointer;" onclick="viewDetails('${encodeURIComponent(JSON.stringify(data))}')">
                <td style="font-size:12px;"><strong>${ctx}</strong></td>
                <td style="font-size:12px;">${data.title_project}</td>
                <td style="font-size:12px;">${data.semester}</td>
                <td style="font-size:12px;font-weight:400;">${data.created_by}</td>
                <td style="font-size:12px;font-weight:bold;color:#757575;">${statusJson[data.status].name_status}</td>
                </tr>`;
              })

          .join("")
      );
      createScriptDatatable()
      localStorage.setItem("p-executed",JSON.stringify(p_projects))
      document.getElementById("loader").style = "display:none;"
    }else{
      
        localStorage.removeItem("p-executed")
        createScriptDatatable()
        document.getElementById("loader").style = "display:none;"
      }

    })

}


function getProjectsFromCache(){

  document.getElementById("loader").style = "display:none;"

  fetch('/intranet/dashboard/assets/js/utils/status.json')
  .then((response) => 
        response.json())
  .then((json) => 
          {
            statusJson = json

            let ctx = 0

            $("#tbody").html(
              pCache
                .map((data) => {
          
                  ctx++
                  return `<tr style="cursor: pointer;" onclick="viewDetails('${encodeURIComponent(JSON.stringify(data))}')">
                  <td style="font-size:12px;"><strong>${ctx}</strong></td>
                  <td style="font-size:12px;">${data.title_project}</td>
                  <td style="font-size:12px;">${data.semester}</td>
                  <td style="font-size:12px;font-weight:400;">${data.created_by}</td>
                  <td style="font-size:12px;font-weight:bold;color:#757575;">${statusJson[data.status].name_status}</td>
                  </tr>`;
                })
          
            .join("")
          );
          createScriptDatatable()
          getProjects()

          }
      );
}


function viewDetails(data){
  let ctx = 0
  let ctx2 = 0
  data = JSON.parse(decodeURIComponent(data))
  var acction = document.getElementById("inputGroupSelectAcction")  

  isAproved(data.title_project)
  isObserved(data.title_project)

  $('#postulateProjectModal').modal('show')

  if(data.is_financed == true){
    document.getElementById("ps-financed").innerHTML = "SI"
    document.getElementById("ps-amount").innerHTML = "S/"+data.amount
  }else{
    document.getElementById("ps-financed").innerHTML = "NO"
    document.getElementById("ps-amount").innerHTML = "NINGUNO"
  }

  document.getElementById("ps-adviser").innerHTML = data.created_by
  document.getElementById("ps-title").innerHTML = data.title_project
  document.getElementById("ps-resume").value = data.resume
  document.getElementById("ps-semester").innerHTML = data.semester
  document.getElementById("ps-modality").innerHTML = statusMod[parseInt(data.modality)].name_modality
  document.getElementById("ps-faculty").innerHTML = data.faculty
  document.getElementById("ps-carrer").innerHTML = statusCarrers[parseInt(data.departament)].carrerName
  document.getElementById("docs-file").innerHTML = `
  <a target="_blank" href="${data.url_file_doc_project}">
  <div><center>
  <i class="bi bi-file-earmark-post-fill" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color: #000;cursor:pointer;">Proyecto (Documento)</label></center>
  </div></a>

  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_letter_engagment}">
  <div><center>
  <i class="bi bi-file-earmark-text" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Carta de Compromiso</label></center>
  </div></a>
  
  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_aproved_resolution}">
  <div><center>
  <i class="bi bi-file-earmark-check" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Resolucion de Aprobación</label></center>
  </div></a>
  
  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_list_assistance_beneficiaries}">
  <div><center>
  <i class="bi bi-list-check" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Lista de Beneficiarios</label></center>
  </div></a>

  `

  document.getElementById("docs-file-2").innerHTML = `
  
  <a target="_blank" href="${data.url_file_final_report}">
  <div><center>
  <i class="bi bi-file-earmark-break-fill" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Informe final</label></center>
  </div></a>

  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_evidence}">
  <div><center>
  <i class="bi bi-images" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Evidencia</label></center>
  </div></a>

   
  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_certificate_compliance}">
  <div><center>
  <i class="bi bi-file-earmark-diff" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Constancia de Conformidad de Comunidad Beneficiaria</label></center>
  </div></a>

  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_article}">
  <div><center>
  <i class="bi bi-file-earmark-diff" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Articulo de publicación</label></center>
  </div></a>

  `

  document.getElementById("tdbody-tch-std").innerHTML = ""
  document.getElementById("tdbody-tch-tch").innerHTML = ""

  data.students.forEach(student => {
    ctx++
    var stdbody =  `
    <tr>
    <th scope="row">${ctx}</th>
    <td>${student.fullName}</td>
    <td>${student.code}</td>
    <td>${student.dni}</td>
    </tr>
    `
    $(stdbody).appendTo('#tdbody-tch-std')
    
  });

  data.teacher.forEach(teacher => {
    ctx2++
    var stdbody =  `
    <tr>
    <th scope="row">${ctx2}</th>
    <td>${teacher.fullName}</td>
    <td>${teacher.dni}</td>
    </tr>
    `
    $(stdbody).appendTo('#tdbody-tch-tch')
    
  });

  
acction.addEventListener('change', function handleChange(event) {
  
  var value = event.target.value
  if(value == 1){
    document.getElementById("content-acction").innerHTML =  `<label class="input-group-text"
     style="font-weight: bold;color: rgb(255, 255, 255);font-size: 16px;background-color: #028400;">
     Subir Resolución de Reconocimiento</label>
    <input type="file" class="form-control" id="file-resolution">
    <div class="input-group mb-3" style="margin-top:10px;">
    <span class="input-group-text">Número de Resolución</span>
    <input type="tel" maxLength="4" style="font-weight:bold;color:#000;" id="num-resolution" class="form-control">
    <span class="input-group-text">Fecha</span>
    <input type="date" id="date-resolution" class="form-control" aria-label="date">
    </div>
    `
    document.getElementById("btn-footer").innerHTML = `<button type="button" onclick="aprovedProject('${encodeURIComponent(JSON.stringify(data))}')" class="btn btn-success">Guardar</button>`
    document.getElementById('date-resolution').scrollIntoView()
  }else{
    document.getElementById("btn-footer").innerHTML = ""
    document.getElementById("content-acction").innerHTML =  `<button onclick="observedProject('${encodeURIComponent(JSON.stringify(data))}')" id="btn-observe" class="btn btn-danger" 
    style="width: 100%;font-weight: bold;">Marcar Items de Observación</button>`
    document.getElementById('btn-observe').scrollIntoView()
  }
 
})


}

function aprovedProject(data){

data = JSON.parse(decodeURIComponent(data))

  var file = document.getElementById("file-resolution").files[0]
  var num = document.getElementById("num-resolution").value
  var dateResolution = document.getElementById("date-resolution").value
  
  let myTitle = document.getElementById("ps-title").innerHTML

  if(file != null){
    if(num != ""){
      if(dateResolution != ""){

        Swal.fire({
          title: 'Esta seguro de FINALIZAR este proyecto?',
          showCancelButton: true,
          confirmButtonText: 'FINALIZAR',
          cancelButtonText: `CANCELAR`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

            let ctx = 0
            let isUpdateObserve 

            db.collection("projects_finished").get().then(snapshot =>{

              snapshot.forEach(value => {
                
                if(value.data().title_project == myTitle ){
                  ctx++
                }

              });

              if(ctx == 0){

                if(data.modified_observed == true){

                    saving()
          
                    var namefile = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
                    var rName = namefile.split('.')[1]
                    var filename = "resolución de reconocimiento N°"+num+`.${rName}`
                    var path = "finish_projects_resolutions"+ '/'+filename
        
                    var storageRef = firebase.storage().ref(path)
                    var uploadTask = storageRef.put(file)
        
                    uploadTask.on('state_changed',
                                  (snapshot) => {
                                    console.log("Subiendo...")
                                },
                                (error) => {
                                    console.log(error)
                                },
                                () => {
                                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        
                                      data.num_resolution = num
                                      data.date_resolution = dateResolution
                                      data.status = 3
                                      data.is_observed = false
                                      data.url_file_recognition_resolution = downloadURL
        
                                      var resolution = {
                                        amount : data.amount,
                                        created_by : user.fullName,
                                        date_modified : null,
                                        date_register_resolution : Date.now(),
                                        date_resolution : dateResolution,
                                        departament : data.departament,
                                        dni_adviser : data.dni_adviser,
                                        faculty : data.faculty,
                                        id : "",
                                        is_financed : data.is_financed,
                                        modality : data.modality,
                                        name_adviser : data.created_by,
                                        students : data.students,
                                        teachers : data.teacher,
                                        is_observed : data.is_observed,
                                        num_observed : data.num_observed,
                                        modified_by : null,
                                        type_upload : "auto",
                                        title_project : data.title_project,
                                        type_resolution : "APROBACION DE INFORME FINAL",
                                        url_file_resolution : data.url_file_aproved_resolution,
                                        url_file_recognition_resolution : downloadURL,
                                        num_resolution : num
                                      }
        
                                      var docCc = db.collection("correlatives").doc("constancy")
                                     
     
                                      db.collection("projects_finished").doc(data.id).set(data)
                                      db.collection("projects").doc(data.id).update(data)
                                      db.collection("resolutions").add(resolution)

                                      
                                          docCc.get().then((doc) => {
                                            if (doc.exists) {

                                              const today = new Date()
                                              const year = today.getFullYear()

                                              var yearSnap = doc.data().year
                                              var num_C = doc.data().num
                                              var A_year
                                              var A_num 

                                              if(yearSnap < parseInt(year)){
                                                A_year = year
                                                A_num = 0
                                                db.collection("correlatives").doc("constancy").update({
                                                  year:parseInt(year),
                                                  num : 0
                                                })
                                  
                                              }else{
                                                A_year = yearSnap
                                                A_num = num_C
                                              }

                                              data.students.forEach(val => {
                                                
                                                db.collection("constancy").where("code","==",val.code).get().then(snapshot =>{

                                                  var ctx = 0

                                                  snapshot.forEach((v) => {
                                                   
                                                    if(v.data().code == val.code){
                                                      ctx++
                                                    }
                                                })

                                                if(ctx == 0){

                                                A_num++
            
                                                var constancy = {
                                                  code : val.code,
                                                  dni : val.dni,
                                                  fullName : val.fullName,
                                                  observe : "Ninguna",
                                                  url_constancy : "",
                                                  num_constancy : A_num,
                                                  type_create : "automatic",
                                                  date_register : Date.now(),
                                                  created_by : user.fullName,
                                                  modified_by : null,
                                                  date_modified : null,
                                                  year : A_year,
                                                  id : ""
                                              }
            
                                              db.collection("constancy").add(constancy)
                                              db.collection("correlatives").doc("constancy").update({
                                                num : A_num
                                              })
                                              ctx = 0
                                            }
                                          })      

                                        })


                                        sendEmailFinalize(data.institucional_mail)

                                      } else {

                                      }
                                        }).catch((error) => {
                                            console.log("Error getting document:", error);
                                        })

                                        cleanSaving()
        
                                      Swal.fire(
                                        'Muy bien!',
                                        'EL PROYECTO HA SIDO FINALIZADO!',
                                        'success'
                                    )
        
                                    $('#postulateProjectModal').modal('hide')
        
                                    })
                                  })
                                }else{
                                    Swal.fire(
                                        'Hey!',
                                        'El proyecto no ha sido levantado!',
                                        'info'
                                    )
                                }
                            
                            }else{
                Swal.fire(
                  'Hey!',
                  'El proyecto ya ha sido finalizado!',
                  'info'
              )
              }

              })
            
            //
      
          }
        })

      }else{
        Swal.fire(
          'Hey!',
          'Ingrese la fecha de Resolución!',
          'info'
      )
      }
    }else{
      Swal.fire(
        'Hey!',
        'Ingrese el número de Resolución!',
        'info'
    )
    }
  }else{
    Swal.fire(
      'Hey!',
      'Suba el archivo de Resolución!',
      'info'
  )
  }
}

function observedProject(data){

  data = JSON.parse(decodeURIComponent(data))

  $('#observedProjectModal').modal('show')

  document.getElementById("ob-footer").innerHTML = ""
  var btn = `<button type="button" onclick="closeModalObserved('${encodeURIComponent(JSON.stringify(data))}')" class="btn btn-success" data-dismiss="modal">Listo!</button>`
  $(btn).appendTo('#ob-footer')


}

function saving(){

  document.getElementById("btn-footer").style = "display:none;"
  document.getElementById("isUpload").style = "display:flex;"
  document.getElementById("btn-close-modal-project").style = "display:none;"
  document.getElementById("inputGroupSelectAcction").disabled = true
  document.getElementById("num-resolution").disabled = false
  document.getElementById("date-resolution").disabled = false
  document.getElementById("file-resolution").disabled = false

}

function cleanSaving(){
  document.getElementById('inputGroupSelectAcction').disabled = false
  document.getElementById("content-acction").innerHTML = ""
  document.getElementById("btn-close-modal-project").style = "display:block;"
  document.getElementById("isUpload").style = "display:none;"
  document.getElementById("btn-footer").innerHTML = ""
  document.getElementById('inputGroupSelectAcction').selectedIndex = 0
}

function createScriptDatatable(){

    $('#tb-projects').DataTable({
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



  function isAproved(title){
    db.collection("projects_finished").where("title_project" , "==" , title).get().then(snapshot =>{


      snapshot.forEach(data => {

        console.log(data.data())
        if(data.data().title_project == title){
          Swal.fire(
            'Este proyecto ya ha sido finalizado!',
            '',
            'success'
        )
        document.getElementById("div-acctions").style = "display:none;"
        }
        
      });
    })
  }

  function isObserved(title){
    db.collection("projects_observed").where("title_project" , "==" , title).get().then(snapshot =>{


      snapshot.forEach(data => {

        console.log(data.data())
        if(data.data().title_project == title){
          if(data.data().is_observed == true){
            Swal.fire(
              'Este proyecto ha sido observado!',
              '',
              'error'
          )
          document.getElementById("div-acctions").style = "display:none;"
          }
        }
      });
    })
  }

  function closeModalObserved(data){

    data = JSON.parse(decodeURIComponent(data))

    var chkItems = document.getElementsByClassName("observedChk")
    var chkInputs = document.getElementsByClassName("mytext")
    var labels = document.getElementsByClassName("container2")
  
    let ctx = 0
    let arrayObserved = []
  
    for(i=0;i<chkItems.length;i++){
      if(chkItems[i].checked == true){
        if(chkInputs[i].value == ""){
          ctx++
        }else{
          let value = {
            tag : labels[i].innerText,
            description : chkInputs[i].value
          }
          arrayObserved.push(value)
        }
      }
    }
  
    if(ctx > 0){
      alert("Complete los campos")
    }else{
      localStorage.setItem("currentArrayObserved",JSON.stringify(arrayObserved))
      $('#observedProjectModal').modal('hide')
      document.getElementById("btn-footer").innerHTML = `<button onclick="saveObservedData('${encodeURIComponent(JSON.stringify(data))}')" type="button" class="btn btn-danger">Observar Proyecto</button>`
      document.getElementById('btn-observe').scrollIntoView()
  
    }
  
  }

  function saveObservedData(data){

    data = JSON.parse(decodeURIComponent(data))
    let nums = data.num_observed
    //let currentID = data.id

    let title = data.title_project

    let currentData = JSON.parse(localStorage.getItem("currentArrayObserved"))

    if(currentData.length != 0){

      databaseLoad()

      let ctx = 0

      db.collection("projects_observed").get().then(snapshot =>{

        snapshot.forEach(data => {
          if(data.data().title_project == title && data.data().is_observed == true){
            ctx++
          }
        })

        if(ctx <= 0){

          data.is_observed = true
          data.type_observed = "APROBACIÓN DE INFORME FINAL"
          data.num_observed = nums+1
          data.items_observed_final_report = currentData
          data.modified_observed = false

          
          db.collection("projects_observed").doc(data.id).set(data)
          db.collection("projects").doc(data.id).update(data)
    
          completeLoad()

          Swal.fire(
            'Muy bien!',
            'Este proyecto ha sido observado!',
            'success'
        )
    
        $('#postulateProjectModal').modal('hide')

        sendEmail(data.institucional_mail)

        }else{

          completeLoad()

        Swal.fire({
          title: 'Hey!',
          text: "Este proyecto ya está observado!",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#fff',
          cancelButtonColor: '#d33',
          cancelButtonText : 'Cancelar',
          confirmButtonText: 'Volver a observar!'
        }).then((result) => {
          if (result.isConfirmed) {

            databaseLoad()

            db.collection("projects_observed").where("title_project","==",data.title_project).get().then(snapshot =>{

              snapshot.forEach(data => {
                
                if(data.data().title_project == title && data.data().is_observed == true){

                  let up = {
                    num_observed : nums+1,
                    items_observed : currentData,
                    modified_observed : false
                  }
                  
                  db.collection("projects_observed").doc(data.id).update(up)
                  db.collection("projects").doc(data.id).update(up)
            
                  completeLoad()

                  Swal.fire(
                    'Muy bien!',
                    'Este proyecto ha sido observado!',
                    'success'
                )
            
                $('#postulateProjectModal').modal('hide')
                sendEmail(data.data().institucional_mail)

                }

              })

            })
          }
        })


        }

      })

     

    }else{
      Swal.fire(
        'Hey!',
        'Debe selecccionar al menos una opción de observación!',
        'info'
    )
    }
    
  }


  function databaseLoad(){
    document.getElementById("isUpload").style = "display:flex;"
    document.getElementById("btn-close-modal-project").style = "display:none;"
    document.getElementById("btn-footer").style = "display:none;"
  }

  function completeLoad(){
    document.getElementById("isUpload").style = "display:none;"
    document.getElementById("btn-close-modal-project").style = "display:block;"
    document.getElementById("btn-footer").style = "display:flex;"
  }

  function sendEmail(email) {
 
    const parameters = { 
       header_email :"DPSEC-OBSERVACIÓN",
       email:"proyeccionsocial.unamad@gmail.com",
	     password :"uwzttrdoispffwca",
       to :email,
       message : "Su proyecto ha sido OBSERVADO!!, porfavor ingrese a su cuenta y corrija los items observados.",
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

  function sendEmailFinalize(email) {
 
    const parameters = { 
       header_email :"DPSEC-FINALIZADO",
       email:"proyeccionsocial.unamad@gmail.com",
	     password :"uwzttrdoispffwca",
       to :email,
       message : "Su proyecto ha sido FINALIZADO EXITOSAMENTE!!, porfavor ingrese a su cuenta para descargar su RESOLUCIÓN DE RECONOCIMIENTO.",
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

