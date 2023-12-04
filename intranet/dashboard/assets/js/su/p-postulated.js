var statusJson
var statusMod
var statusCarrers
let cache = localStorage.getItem("p-projects")
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

    db.collection("projects").onSnapshot(snapshot =>{

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
                <td style="font-size:12px;font-weight:bold;color:#757575;">Postulado</td>
                </tr>`;
              })

          .join("")
      );
      createScriptDatatable()
      localStorage.setItem("p-projects",JSON.stringify(p_projects))
      document.getElementById("loader").style = "display:none;"
    }else{
      
        localStorage.removeItem("p-projects")
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
                  <td style="font-size:12px;font-weight:bold;color:#757575;">Postulado</td>
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
  document.getElementById("docs-file").innerHTML = `<a target="_blank" href="${data.url_file_doc_project}">
  <div><center>
  <i class="bi bi-file-earmark-post-fill" style="color: #000;font-size: 100px;"></i>
    <p></p>
    <label style="font-size: 25px;color: #000;cursor:pointer;">Proyecto (Documento)</label></center>
  </div></a>

  <div style="margin-left: 40px;margin-right: 40px;"></div>

  <a target="_blank" href="${data.url_file_letter_engagment}">
  <div><center>
  <i class="bi bi-file-earmark-text" style="color: #000;font-size: 100px;"></i>
    <p></p>
    <label style="font-size: 25px;color:#000;cursor:pointer;">Carta de Compromiso</label></center>
  </div></a>`

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
     Subir Resolución de Aprobación</label>
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

  var file = document.getElementById("file-resolution").files[0]
  var num = document.getElementById("num-resolution").value
  var dateResolution = document.getElementById("date-resolution").value
  
  let myTitle = document.getElementById("ps-title").innerHTML

  if(file != null){
    if(num != ""){
      if(dateResolution != ""){

        Swal.fire({
          title: 'Esta seguro de APROBAR este proyecto?',
          showCancelButton: true,
          confirmButtonText: 'APROBAR',
          cancelButtonText: `CANCELAR`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

            let ctx = 0

            db.collection("projects_aproved").get().then(snapshot =>{

              snapshot.forEach(value => {
                
                if(value.data().title_project == myTitle ){
                  ctx++
                }

              });

              if(ctx == 0){

                saving()
          
                data = JSON.parse(decodeURIComponent(data))
          
                var namefile = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
                var rName = namefile.split('.')[1]
                var filename = "resolución de aprobación N°"+num+`.${rName}`
                var path = "aproved_projects_resolutions"+ '/'+filename
    
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
                                  data.url_file_aproved_resolution = downloadURL
                                  data.status = 1
                                  data.is_observed = false
                                  data.modified_observed = true
    
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
                                    type_resolution : "APROBACION DE PROYECTO PARA EJECUCIÓN",
                                    url_file_aproved_resolution : downloadURL,
                                    num_resolution : num
                                  }
    
                                  db.collection("projects_aproved").doc(data.id).set(data)
                                  db.collection("projects").doc(data.id).set(data)
                                  db.collection("resolutions").doc(data.id).set(resolution)

                                  sendEmailAproved(data.institucional_mail)
          
                                  cleanSaving()
    
                                  Swal.fire(
                                    'Muy bien!',
                                    'EL PROYECTO HA SIDO APROBADO!',
                                    'success'
                                )
    
                                $('#postulateProjectModal').modal('hide')
    
                                })
                              })
                  

              }else{
                Swal.fire(
                  'Hey!',
                  'El proyecto ya ha sido aprobado!',
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
    db.collection("projects_aproved").where("title_project" , "==" , title).get().then(snapshot =>{


      snapshot.forEach(data => {

        console.log(data.data())
        if(data.data().title_project == title){
          Swal.fire(
            'Este proyecto ya ha sido aprobado!',
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
          data.type_observed = "APROBACIÓN DE PROYECTO PARA EJECUCIÓN"
          data.num_observed = data.num_observed+1
          data.items_observed = currentData
          data.status = 4
          data.modified_observed = false
          
          db.collection("projects_observed").doc(data.id).set(data)
          data.status = 0
          db.collection("projects").doc(data.id).update(data)
    
          completeLoad()

          Swal.fire(
            'Muy bien!',
            'Este proyecto ha sido observado!',
            'success'
        )
    
        $('#postulateProjectModal').modal('hide')
        sendEmail(data.data().institucional_mail)
        }else{

          completeLoad()

          Swal.fire(
            'Hey!',
            'Este proyecto ya está observado!',
            'info'
        )
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

  function sendEmailAproved(email) {
 
    const parameters = { 
       header_email :"DPSEC-APROBACIÓN",
       email:"proyeccionsocial.unamad@gmail.com",
	     password :"uwzttrdoispffwca",
       to :email,
       message : "Su proyecto ha sido APROBADO!!, porfavor ingrese a su cuenta para descargar su RESOLUCIÓN DE APROBACIÓN.",
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