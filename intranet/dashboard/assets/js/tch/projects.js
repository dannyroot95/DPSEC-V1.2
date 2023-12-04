var statusJson
var statusMod
var statusCarrers
let cache = localStorage.getItem("myProjects")
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

    db.collection("projects").where("id_user","==",user.id).onSnapshot(snapshot =>{

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

                let ok = data.is_observed
                if(ok != false){
                    ok = `Si <i class="bi bi-check-square-fill" style="font-size : 25px;color:#fc0000;"></i>`
                }else{
                    ok = `No <i class="bi bi-file-excel-fill" style="font-size : 25px;color:#5bbd00"></i>`
                }

                if(data.items_observed == null){
                    data.items_observed = []
                }
    
                return `<tr style="cursor: pointer;" onclick="viewDetails('${encodeURIComponent(JSON.stringify(data))}')">
                <td style="font-size:12px;"><strong>${ctx}</strong></td>
                <td style="font-size:12px;">${data.title_project}</td>
                <td style="font-size:12px;">${data.semester}</td>
                <td style="font-size:12px;font-weight:bold;color:#757575;">${statusJson[data.status].name_status}</td>
                <td style="font-size:12px;">${ok}</td>
                <td style="font-size:12px;">${data.items_observed.length}</td>
                <td style="font-size:12px;">${data.num_observed}</td>
                </tr>`;
              })

          .join("")
      );
      createScriptDatatable()
      localStorage.setItem("myProjects",JSON.stringify(p_projects))
      document.getElementById("loader").style = "display:none;"
    }else{
      
        localStorage.removeItem("myProjects")
        createScriptDatatable()
        document.getElementById("loader").style = "display:none;"
      }

    })

}

function viewDetails(data){

    let ctx = 0
    let ctx2 = 0
    data = JSON.parse(decodeURIComponent(data))
    
    console.log(data)

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
    document.getElementById("docs-file").innerHTML = ""
    document.getElementById("docs-file-2").innerHTML = ""

    if(data.status == 0){

      document.getElementById("docs-file").innerHTML = `<a target="_blank" href="${data.url_file_doc_project}">
    <div><center>
    <i class="bi bi-file-earmark-post-fill" style="color: #000;font-size: 80px;"></i>
      <p></p>
      <label style="font-size: 17px;color: #000;cursor:pointer;">Proyecto (Documento)</label></center>
    </div></a>
  
    <div style="margin-left: 30px;margin-right: 30px;"></div>
  
    <a target="_blank" href="${data.url_file_letter_engagment}">
    <div><center>
    <i class="bi bi-file-earmark-text" style="color: #000;font-size: 80px;"></i>
      <p></p>
      <label style="font-size: 17px;color:#000;cursor:pointer;">Carta de Compromiso</label></center>
    </div></a>
    `
  }
    else if(data.status == 1){

      document.getElementById("docs-file").innerHTML = `<a target="_blank" href="${data.url_file_doc_project}">
    <div><center>
    <i class="bi bi-file-earmark-post-fill" style="color: #000;font-size: 80px;"></i>
      <p></p>
      <label style="font-size: 17px;color: #000;cursor:pointer;">Proyecto (Documento)</label></center>
    </div></a>
  
    <div style="margin-left: 30px;margin-right: 30px;"></div>
  
    <a target="_blank" href="${data.url_file_letter_engagment}">
    <div><center>
    <i class="bi bi-file-earmark-text" style="color: #000;font-size: 80px;"></i>
      <p></p>
      <label style="font-size: 17px;color:#000;cursor:pointer;">Carta de Compromiso</label></center>
    </div></a>
    
    <div style="margin-left: 30px;margin-right: 30px;"></div>

    <a target="_blank" href="${data.url_file_doc_project}">
    <div><center>
    <i class="bi bi-file-earmark-post-fill" style="color: #000;font-size: 80px;"></i>
      <p></p>
      <label style="font-size: 17px;color: #000;cursor:pointer;">Resolución de Aprobación</label></center>
    </div></a>

    `

    }else if(data.status == 2){

      document.getElementById("docs-file").innerHTML = `<a target="_blank" href="${data.url_file_doc_project}">
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
    
      <a target="_blank" href="${data.url_file_resolution}">
      <div><center>
      <i class="bi bi-file-earmark-check" style="color: #007C9D;font-size: 45px;"></i>
        <p></p>
        <label style="font-size: 13px;color:#000;cursor:pointer;">Resolucion de Aprobación</label></center>
      </div></a>
      
      <div style="margin-left: 18px;margin-right: 18px;"></div>
    
      <a target="_blank" href="${data.url_file_list_assistance_beneficiaries}">
      <div><center>
      <i class="bi bi-list-check" style="color: #000;font-size: 45px;"></i>
        <p></p>
        <label style="font-size: 13px;color:#000;cursor:pointer;">Lista de Beneficiarios</label></center>
      </div></a>`
  
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
    }else if(data.status == 3){

   document.getElementById("docs-file").innerHTML = `<a target="_blank" href="${data.url_file_doc_project}">
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
  
    <a target="_blank" href="${data.url_file_resolution}">
    <div><center>
    <i class="bi bi-file-earmark-check" style="color: #007C9D;font-size: 45px;"></i>
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
    
    <div style="margin-left: 18px;margin-right: 18px;"></div>

    <a target="_blank" href="${data.url_file_article}">
    <div><center>
    <i class="bi bi-file-earmark-diff" style="color: #000;font-size: 45px;"></i>
      <p></p>
      <label style="font-size: 13px;color:#000;cursor:pointer;">Articulo de publicación</label></center>
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

  <a target="_blank" href="${data.url_file_recognition_resolution}">
  <div><center>
  <i class="bi bi-file-earmark-check" style="color: #5bbd00;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Resolucion de reconocimiento</label></center>
  </div></a>

   
  <div style="margin-left: 18px;margin-right: 18px;"></div>

  <a target="_blank" href="${data.url_file_certificate_compliance}">
  <div><center>
  <i class="bi bi-file-earmark-diff" style="color: #000;font-size: 45px;"></i>
    <p></p>
    <label style="font-size: 13px;color:#000;cursor:pointer;">Constancia de Conformidad de Comunidad Beneficiaria</label></center>
  </div></a>
  `
}


  
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

    if(data.is_observed == true){
       
      if(data.type_observed == "APROBACIÓN DE PROYECTO PARA EJECUCIÓN"){
        document.getElementById("content-acction").innerHTML = ""
        document.getElementById("content-acction").innerHTML = `
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="background-color:#008BB0;color:#fff;font-weight:bold;">Subir Proyecto</label>
            <input type="file" class="form-control" id="fileObserved">
            </div>
            <br>
            <div class="input-group mb-3" style="display: flex;justify-content: center;align-items: center;">
            <button style="width:100%;font-weight:bold;" 
                onclick="itemsObserved('${encodeURIComponent(JSON.stringify(data))}')" 
                class="btn btn-danger">Ver Items</button>
            </div>
        `
      }else{
        document.getElementById("content-acction").innerHTML = ""
        document.getElementById("content-acction").innerHTML = `
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="background-color:#229954;color:#fff;font-weight:bold;">Subir Informe final</label>
            <input type="file" class="form-control" id="fileObserved">
            </div>
            <br>
            <div class="input-group mb-3" style="display: flex;justify-content: center;align-items: center;">
            <button style="width:100%;font-weight:bold;" 
                onclick="itemsObserved('${encodeURIComponent(JSON.stringify(data))}')" 
                class="btn btn-danger">Ver Items</button>
            </div>
        `
      }  

        document.getElementById("btn-footer").innerHTML = ""
        document.getElementById("btn-footer").innerHTML = `<button 
        class="btn btn-success" onclick="changeData('${encodeURIComponent(JSON.stringify(data))}')">Levantar Observación</button>`
    }else if(data.status == 1 && data.is_observed != true){

document.getElementById("content-acction").innerHTML = ""
        document.getElementById("content-acction").innerHTML = `
     
            <div style="margin-top:50px;display:flex;color:#198754;justify-content: center;align-items: center;" class="input-group mb-3">
            <h3>*Ejecución de Proyecto*</h3>
            </div>
            <div style="margin-top:-20px;display:flex;font-face:monserrat;justify-content: center;align-items: center;" class="input-group mb-3">
            <h6>Presentacion de informe final</h6>
            </div>
            <br>
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="color:#000;font-weight:bold;">Listas de asistencias de beneficiarios del proyecto</label>
            <input type="file" class="form-control" id="fileData1">
            </div>
            <br>
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="color:#000;font-weight:bold;">Constancia de conformidad de la comunidad beneficiaria</label>
            <input type="file" class="form-control" id="fileData2">
            </div>
            <br>
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="color:#000;font-weight:bold;">Informe final</label>
            <input type="file" class="form-control" id="fileData3">
            </div>
            <br>
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="color:#000;font-weight:bold;">Evidencia (Fotos , mapas , croquis) en PDF todo adjuntado</label>
            <input type="file" class="form-control" id="fileData4">
            </div>
            <br>
            <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile" style="color:#000;font-weight:bold;">Artículo para publicación</label>
            <input type="file" class="form-control" id="fileData5">
            </div>
            <br>
            <div class="input-group mb-3" style="display: flex;justify-content: center;align-items: center;">
            <button id="btn-executed" style="width:100%;font-weight:bold;" 
                onclick="executedProject('${encodeURIComponent(JSON.stringify(data))}')" 
                class="btn btn-success">Ejecutar proyecto</button>
            </div>
        `
      
    }else{
        document.getElementById("content-acction").innerHTML = ""
        document.getElementById("btn-footer").innerHTML = ""
    }

   

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
                      
                      
                    let ok = data.is_observed
                    if(ok != false){
                        ok = `Si <i class="bi bi-check-square-fill" style="font-size : 25px;color:#fc0000;"></i>`
                    }else{
                        ok = `No <i class="bi bi-file-excel-fill" style="font-size : 25px;color:#5bbd00"></i>`
                    }
    
                    if(data.items_observed == null){
                        data.items_observed = []
                    }
        
                    return `<tr style="cursor: pointer;" onclick="viewDetails('${encodeURIComponent(JSON.stringify(data))}')">
                    <td style="font-size:12px;"><strong>${ctx}</strong></td>
                    <td style="font-size:12px;">${data.title_project}</td>
                    <td style="font-size:12px;">${data.semester}</td>
                    <td style="font-size:12px;font-weight:bold;color:#757575;">${statusJson[data.status].name_status}</td>
                    <td style="font-size:12px;">${ok}</td>
                    <td style="font-size:12px;">${data.items_observed.length}</td>
                    <td style="font-size:12px;">${data.num_observed}</td>
                    </tr>`;
                  })
            
              .join("")
            );
            createScriptDatatable()
            getProjects()
  
            }
        );
  }

  function itemsObserved(data){
    data = JSON.parse(decodeURIComponent(data))

    if(data.type_observed == "APROBACIÓN DE PROYECTO PARA EJECUCIÓN"){
      $('#observedProjectModal').modal('show')

      document.getElementById("ob-footer").innerHTML = ""
      var btn = `<button type="button" onclick="closeModalObserved()" class="btn btn-dark" data-dismiss="modal">Cerrar</button>`
      $(btn).appendTo('#ob-footer')
    
      var chkItems = document.getElementsByClassName("observedChk")
      var labels = document.querySelectorAll(".container2")
      var chkInputs = document.getElementsByClassName("mytext")
      var chkDiv = document.getElementsByClassName("description")
      var items = data.items_observed
    
      let newLabel = []
    
      for(i = 0 ; i<labels.length; i++){
        let value = {
          tag : labels[i].innerText.split("\n")[0]
        }
        newLabel.push(value)
      }
    
     for(i = 0 ; i<labels.length;i++){
    
      for(j=0;j<items.length;j++){
    
        if(items[j].tag == newLabel[i].tag){
          
          chkItems[i].checked = true
          chkDiv[i].style = "display:flex;"
          chkInputs[i].value = items[j].description
    
        }
      }
     }
    }else{

      $('#observedProjectModalFinal').modal('show')

      document.getElementById("ob-footer-final").innerHTML = ""
      var btn = `<button type="button" onclick="closeModalObservedFinal()" class="btn btn-dark" data-dismiss="modal">Cerrar</button>`
      $(btn).appendTo('#ob-footer-final')
    
      var chkItems = document.getElementsByClassName("observedChk")
      var labels = document.querySelectorAll(".container2")
      var chkInputs = document.getElementsByClassName("mytext")
      var chkDiv = document.getElementsByClassName("description")
      var items = data.items_observed_final_report
    
      let newLabel = []
    
      for(i = 0 ; i<labels.length; i++){
        let value = {
          tag : labels[i].innerText.split("\n")[0]
        }
        newLabel.push(value)
      }
    
     for(i = 0 ; i<labels.length;i++){
    
      for(j=0;j<items.length;j++){
    
        if(items[j].tag == newLabel[i].tag){
          
          chkItems[i].checked = true
          chkDiv[i].style = "display:flex;"
          chkInputs[i].value = items[j].description
    
        }
      }
     }

    }

  }

  function closeModalObserved(){
    $('#observedProjectModal').modal('hide')
  }

  function closeModalObservedFinal(){
    $('#observedProjectModalFinal').modal('hide')
  }

  function changeData(data){
    var file = document.getElementById("fileObserved").files[0]
    data = JSON.parse(decodeURIComponent(data))
    let title = data.title_project
    let typeObserved = data.type_observed
    let idProject = data.id


    if(data.modified_observed != true){

      if(file != null){

        databaseLoad()

        db.collection("projects_observed").where("title_project","==",data.title_project).get().then(snapshot =>{

            snapshot.forEach(data => {
              
                if(data.data().title_project == title){

                    if(data.data().modified_observed != true){

                      var name  
                      var rName  
                      var filename  
                      var path  
                      var storageRef  
                      var uploadTask  

                      if(typeObserved == "APROBACIÓN DE PROYECTO PARA EJECUCIÓN"){

                        name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
                        rName = name.split('.')[1]
                        filename = `proyecto.${rName}`
    
                        path = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename
                        storageRef = firebase.storage().ref(path)
                        uploadTask = storageRef.put(file)

                      }else{

                        name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
                        rName = name.split('.')[1]
                        filename = `informe_final.${rName}`
    
                        path = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename
                        storageRef = firebase.storage().ref(path)
                        uploadTask = storageRef.put(file)

                      }
               
                    uploadTask.on('state_changed',
                            (snapshot) => {
                            
                            console.log("Subiendo...")

                            },
                            (error) => {
                                console.log(error)
                            },
                            () => {

                            uploadTask.snapshot.ref.getDownloadURL()
                                .then(downloadURL => {

                                  let up 

                                  if(typeObserved == "APROBACIÓN DE PROYECTO PARA EJECUCIÓN"){
                                    up = {
                                      url_file_doc_project : downloadURL,
                                      modified_observed : true
                                  }
                                  }else{
                                    up = {
                                      url_file_final_report : downloadURL,
                                      modified_observed : true
                                  }
                                  }

                                    db.collection("projects_observed").doc(idProject).update(up)
                                    db.collection("projects").doc(idProject).update(up)
                                    completeLoad()
                                    $('#postulateProjectModal').modal('hide')
                                    Swal.fire(
                                        'Muy bien!',
                                        'El proyecto ha sido levantado!',
                                        'success'
                                    )
                                    
                                })
                            })

                    }else{
                        completeLoad()
                        Swal.fire(
                            'Hey!',
                            'El proyecto ya ha sido levantado!',
                            'info'
                        )
                    }

                        }
                    })
                })
            
            }else{
                Swal.fire(
                    'Hey!',
                    'Suba un archivo!',
                    'info'
                )}
              }else{
                Swal.fire(
                  'Hey!',
                  'El proyecto ya ha sido corregido!',
                  'info'
              )
              }
 }

  function executedProject(data){

    data = JSON.parse(decodeURIComponent(data))

    let file1 = document.getElementById("fileData1").files[0]
    let file2 = document.getElementById("fileData2").files[0]
    let file3 = document.getElementById("fileData3").files[0]
    let file4 = document.getElementById("fileData4").files[0]
    let file5 = document.getElementById("fileData5").files[0]
    
    if(file1 != null && file2 != null && file3 != null && file4 != null && file5 != null){

      onExecuted()
      databaseLoad()
      
      var name = file1.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file1.name.split('.').pop()
      var rName = name.split('.')[1]
      var filename = `lista_beneficiarios.${rName}`

      var path = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename
      var storageRef = firebase.storage().ref(path)
      var uploadTask = storageRef.put(file1)

      var name2 = file2.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file2.name.split('.').pop()
      var rName2 = name2.split('.')[1]
      var filename2 = `constancia_conformidad.${rName2}`
      var path2 = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename2
      var storageRef2 = firebase.storage().ref(path2)
      var uploadTask2 = storageRef2.put(file2)

      var name3 = file3.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file3.name.split('.').pop()
      var rName3 = name3.split('.')[1]
      var filename3 = `informe_final.${rName3}`
      var path3 = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename3
      var storageRef3 = firebase.storage().ref(path3)
      var uploadTask3 = storageRef3.put(file3)

      var name4 = file4.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file4.name.split('.').pop()
      var rName4 = name4.split('.')[1]
      var filename4 = `evidencia.${rName4}`
      var path4 = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename4
      var storageRef4 = firebase.storage().ref(path4)
      var uploadTask4 = storageRef4.put(file4)

      var name5 = file5.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file5.name.split('.').pop()
      var rName5 = name5.split('.')[1]
      var filename5 = `articulo.${rName5}`
      var path5 = "projects"+ '/'+data.id_user+'/'+data.id_announcement+'/'+ filename5
      var storageRef5 = firebase.storage().ref(path5)
      var uploadTask5 = storageRef5.put(file5)

      uploadTask.on('state_changed',
      (snapshot) => {
      
      console.log("Subiendo 1...")

      },
      (error) => {
          console.log(error)
      },
      () => {

      uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {

                uploadTask2.on('state_changed',
                (snapshot) => {
                
                console.log("Subiendo 2...")
          
                },
                (error) => {
                    console.log(error)
                },
                () => {
          
                uploadTask2.snapshot.ref.getDownloadURL()
                    .then(downloadURL2 => {
          

                            uploadTask3.on('state_changed',
                            (snapshot) => {
                            
                            console.log("Subiendo 3...")

                            },
                            (error) => {
                                console.log(error)
                            },
                            () => {

                            uploadTask3.snapshot.ref.getDownloadURL()
                                .then(downloadURL3 => {

                                  uploadTask4.on('state_changed',
                                  (snapshot) => {
                                  
                                  console.log("Subiendo 3...")
      
                                  },
                                  (error) => {
                                      console.log(error)
                                  },
                                  () => {
      
                                  uploadTask4.snapshot.ref.getDownloadURL()
                                      .then(downloadURL4 => {

                                        uploadTask5.on('state_changed',
                                        (snapshot) => {
                                        
                                        console.log("Subiendo.......")
            
                                        },
                                        (error) => {
                                            console.log(error)
                                        },
                                        () => {
            
                                        uploadTask5.snapshot.ref.getDownloadURL()
                                            .then(downloadURL5 => {

                                              data.url_file_list_assistance_beneficiaries = downloadURL
                                              data.url_file_certificate_compliance = downloadURL2
                                              data.url_file_final_report = downloadURL3
                                              data.url_file_evidence = downloadURL4
                                              data.url_file_article = downloadURL5
                                              data.status = 2
                                              data.date_modified = Date.now()
                                              data.modified_by = user.fullName
                                              data.modified_observed = true
                                            
                                              db.collection("projects_executed").doc(data.id).set(data)
                                              db.collection("projects").doc(data.id).update(data)
                                              completeExecuted()
                                              completeLoad()
                                              $('#postulateProjectModal').modal('hide')
                                              Swal.fire(
                                                  'Muy bien!',
                                                  'El proyecto ha sido ejecutado!',
                                                  'success'
                                              )

                                            })
                                          })

                                      })
                                  })

                             })
                           })
          
                    })
                  })

          })
        })

    }else{
      Swal.fire(
        'Hey!',
        'Suba todos los archivos!',
        'info'
    )
  }

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

  function onExecuted(){
    document.getElementById("btn-executed").disabled = true
    document.getElementById("fileData1").disabled = true
    document.getElementById("fileData2").disabled = true
    document.getElementById("fileData3").disabled = true
  }

function completeExecuted(){
    document.getElementById("btn-executed").disabled = false
    document.getElementById("fileData1").disabled = false
    document.getElementById("fileData2").disabled = false
    document.getElementById("fileData3").disabled = false
  }