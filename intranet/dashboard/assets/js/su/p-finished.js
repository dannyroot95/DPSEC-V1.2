var statusJson
var statusMod
var statusCarrers
let cache = localStorage.getItem("f-projects")
let pCache = JSON.parse(cache)
let user = JSON.parse(localStorage.getItem("currentUserData"))   

fetchModality()
fetchCarrers()

if(pCache == null){
    document.getElementById("loader").style = "display:block;"
    allFetch()
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

    db.collection("projects_finished").onSnapshot(snapshot =>{

        let ctx = 0
        let a_projects = []

        values = snapshot.docs.map((doc) => ({
            ...doc.data(),id: doc.id
      }));

      if(values.length > 0){
        $('#tb-projects').DataTable().destroy()

        $("#tbody").html(
            values
              .map((data) => {

                ctx++
                a_projects.push(data)
    
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
      localStorage.setItem("f-projects",JSON.stringify(a_projects))
      document.getElementById("loader").style = "display:none;"
    }else{
      
        localStorage.removeItem("f-projects")
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


  function viewDetails(data){
    let ctx = 0
    let ctx2 = 0
    data = JSON.parse(decodeURIComponent(data))
    
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
    
  }

