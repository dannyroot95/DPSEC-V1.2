document.getElementById("semester").value = getSemester()
//localStorage.removeItem("announcements")
var cCache = localStorage.getItem("announcements")
var cache = JSON.parse(cCache)
var isFinancedValue = false
var modalityJson



if(cache == null){
  document.getElementById("loader").style = "display:block;margin-top:14px;"
  getAnnoucementsFromDatabase()
}else{

  getAnnoucementsFromCache()
  getAnnoucementsFromDatabase()

}

getRules()
getArticles()
isFinanced()
allModality()

function isFinanced(){
  $(document).ready(function() {
    $('#is-financed').change(function() {
      if ($(this).is(":checked")) {
        isFinancedValue = true
      }else{
        isFinancedValue = false
      }
    });
  });
}


function getAnnoucementsFromDatabase(){


  db.collection("announcements").onSnapshot((querySnapshot) => {

        let ctx = 0
        let announcements = []
  
          values = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            if(values.length > 0){

              $('#tb-announcements').DataTable().destroy()
            
              $("#tbody").html(
                values
                  .map((data) => {

                    if(getSemester() == data.semester){
                      ctx++
                      announcements.push(data)
  
                      return `<tr style="cursor: pointer" onclick="setData('${ctx}','${data.id}','${data.date_start}',
                      '${data.date_end}','${data.observe_date_start}','${data.observe_date_end}',
                      '${data.inf_date_start}','${data.inf_date_end}','${data.url_base}',
                      '${data.url_timeline}','${data.modality}','${data.is_financed}')">
    
                      <td style="font-size:14px;"><strong>${ctx}</strong></td>
                      <td style="font-size:14px;">${data.semester}</td>
                      <td style="font-size:14px;">${onlyDateNumber(data.date_start)}</td>
                      <td style="font-size:14px;">${onlyDateNumber(data.date_end)}</td>
                      </tr>`;
                    }

                  })

              .join("")
          );

          createScriptDatatable()
          localStorage.setItem("announcements",JSON.stringify(announcements))
          document.getElementById("loader").style = "display:none;"
          
        }

        }) 

}

function getAnnoucementsFromCache(){

  let ctx = 0

  $("#tbody").html(
    
    cache.map((data) => {

        ctx++
 
        return `<tr style="cursor: pointer" 
        onclick="setData('${ctx}','${data.id}','${data.date_start}','${data.date_end}','${data.observe_date_start}',
        '${data.observe_date_end}','${data.inf_date_start}','${data.inf_date_end}','${data.url_base}',
        '${data.url_timeline}','${data.modality}','${data.is_financed}')">
  
        <td style="font-size:14px;"><strong>${ctx}</strong></td>
                    <td style="font-size:14px;">${data.semester}</td>
                    <td style="font-size:14px;">${onlyDateNumber(data.date_start)}</td>
                    <td style="font-size:14px;">${onlyDateNumber(data.date_end)}</td>
        </tr>`;

      })

  .join("")
);

$('#tb-announcements').DataTable().destroy()
createScriptDatatable()

}

function createAnnoucement(){

var dt = document.getElementById("date-start-and-end").value
var dt2 = document.getElementById("obs-date-start-and-end").value
var dt3 = document.getElementById("inf-date-start-and-end").value
var dates =  dt.split(" - ")
var dates2 = dt2.split(" - ")
var dates3 = dt3.split(" - ")
var url_file_timeline = ""
var url_base = ""
var modality = $("#inputGroupSelect option:selected").text()
var md = document.getElementById("inputGroupSelect").value
var amount = document.getElementById("amountvalue").value
var chk = document.getElementById("is-financed").checked

//verificar si el monto esta activa y vacio

if(dt != "" && dt2 != "" && dt3 != "" && modality != ""){

  var file = document.getElementById("file").files[0]
  var file2 = document.getElementById("file2").files[0]

  if(file != null){

    if(chk == true){

      if(amount != ""){

        hideButtons()
  var progress = document.getElementsByClassName('progress')[0];
  var percent = document.getElementsByClassName('percent')[0];
  var pause = document.getElementsByClassName('pause')[0];
  var resume = document.getElementsByClassName('resume')[0];
  var cancel = document.getElementsByClassName('cancel')[0];
  var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
  var name2 = file2.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file2.name.split('.').pop()
  var path = "announcements" + '/' + name
  var path2 = "announcements" + '/' + name2

  document.getElementById("file").disabled = true
  document.getElementById("file2").disabled = true
  document.getElementById("upload-area").style = "display:block;"
  document.getElementById("statusCharge").style = "display:block;"
  document.getElementById("statusCharge").innerHTML = "1/3 Subiendo archivo...<div class='smallLoader'></div>"

  var storageRef = firebase.storage().ref(path)
  var storageRef2 = firebase.storage().ref(path2)
  var uploadTask = storageRef.put(file)
  var uploadTask2 = storageRef2.put(file2)

  

  pause.onclick = function () {
    uploadTask.pause();
    resume.style.display = 'inline-block';
    pause.style.display = 'none';
    document.getElementById("file").style = "display:block;"
    document.getElementById("file2").style = "display:block;"
}
resume.onclick = function () {
    uploadTask.resume();
    resume.style.display = 'none';
    pause.style.display = 'inline-block';
}
cancel.onclick = function () {
    uploadTask.cancel();
    progress.style.width = '0%';
    percent.innerHTML = '0%';
    document.getElementById("upload-area").style = "display:none;"
    document.getElementById("file").value = ""
    document.getElementById("file2").value = ""
}

percent.innerHTML = '0%';

  uploadTask.on('state_changed',
        (snapshot) => {
          var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
            progress.style.width = progressValue + '%';
            percent.innerHTML = progressValue + '%';
            percent.style = "font-size:12px;color:black;"
        },
        (error) => {
            console.log(error)
        },
        () => {

          uploadTask.snapshot.ref.getDownloadURL()
              .then(downloadURL => {

                url_file_timeline = downloadURL
                console.log(url_file_timeline);

                percent.innerHTML = 'Subido';
                percent.style = "font-size:12px;color:black;"
                document.getElementById("div-controls").style = "display:none;"
                document.getElementById("statusCharge").innerHTML = "2/3 Guardando datos...<div class='smallLoader'></div>"

                //----------------------------------------------------------------------------------------------------------

                uploadTask2.on('state_changed',
                          (snapshot) => {

                            var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
                                progress.style.width = progressValue + '%';
                                percent.innerHTML = progressValue + '%';
                                percent.style = "font-size:12px;color:black;"

                          },
                          (error) => {
                              console.log(error)
                          },
                          () => {

                            uploadTask2.snapshot.ref.getDownloadURL()
                                    .then(downloadURL => {

                                      url_base = downloadURL
                                      console.log(url_base)

                                      var data = {
                                        created_by : "SUPER ADMINISTRADOR",
                                        date_start : toTimestamp(dates[0]),
                                        date_end : toTimestamp(dates[1]),
                                        observe_date_start : toTimestamp(dates2[0]),
                                        observe_date_end : toTimestamp(dates2[1]),
                                        inf_date_start : toTimestamp(dates3[0]),
                                        inf_date_end : toTimestamp(dates3[1]),
                                        date_register : Date.now(),
                                        date_modified : null,
                                        modified_by : null,
                                        semester : getSemester(),
                                        url_base : url_base,
                                        url_timeline : url_file_timeline,
                                        modality : md,
                                        is_financed : isFinancedValue,
                                        amount : amount,
                                        id:""
                                      }

                                      db.collection("announcements").add(data).then((snapshot) => {

                                        db.collection("announcements").doc(snapshot.id).update({id:snapshot.id})
                                        document.getElementById("statusCharge").innerHTML = "Completado!"
                                        document.getElementById("statusCharge").style = "font-weight:bold;font-size:18px;"
                                        clearInputs()
                                        showButtons()
                      
                                      }).catch((error) => {
                                        console.log(error)
                                      })
                                    })
                                  })
                                })
                              })

      }else{
        Swal.fire(
          "Hey!",
          "Ingrese el monto!",
          "info"
        )
      }

    }else{

      hideButtons()
      var progress = document.getElementsByClassName('progress')[0];
      var percent = document.getElementsByClassName('percent')[0];
      var pause = document.getElementsByClassName('pause')[0];
      var resume = document.getElementsByClassName('resume')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
      var name2 = file2.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file2.name.split('.').pop()
      var path = "announcements" + '/' + name
      var path2 = "announcements" + '/' + name2
    
      document.getElementById("file").disabled = true
      document.getElementById("file2").disabled = true
      document.getElementById("upload-area").style = "display:block;"
      document.getElementById("statusCharge").style = "display:block;"
      document.getElementById("statusCharge").innerHTML = "1/3 Subiendo archivo...<div class='smallLoader'></div>"
    
      var storageRef = firebase.storage().ref(path)
      var storageRef2 = firebase.storage().ref(path2)
      var uploadTask = storageRef.put(file)
      var uploadTask2 = storageRef2.put(file2)
    
      
    
      pause.onclick = function () {
        uploadTask.pause();
        resume.style.display = 'inline-block';
        pause.style.display = 'none';
        document.getElementById("file").style = "display:block;"
        document.getElementById("file2").style = "display:block;"
    }
    resume.onclick = function () {
        uploadTask.resume();
        resume.style.display = 'none';
        pause.style.display = 'inline-block';
    }
    cancel.onclick = function () {
        uploadTask.cancel();
        progress.style.width = '0%';
        percent.innerHTML = '0%';
        document.getElementById("upload-area").style = "display:none;"
        document.getElementById("file").value = ""
        document.getElementById("file2").value = ""
    }
    
    percent.innerHTML = '0%';
    
      uploadTask.on('state_changed',
            (snapshot) => {
              var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
                progress.style.width = progressValue + '%';
                percent.innerHTML = progressValue + '%';
                percent.style = "font-size:12px;color:black;"
            },
            (error) => {
                console.log(error)
            },
            () => {
    
              uploadTask.snapshot.ref.getDownloadURL()
                  .then(downloadURL => {
    
                    url_file_timeline = downloadURL
                    console.log(url_file_timeline);
    
                    percent.innerHTML = 'Subido';
                    percent.style = "font-size:12px;color:black;"
                    document.getElementById("div-controls").style = "display:none;"
                    document.getElementById("statusCharge").innerHTML = "2/3 Guardando datos...<div class='smallLoader'></div>"
    
                    //----------------------------------------------------------------------------------------------------------
    
                    uploadTask2.on('state_changed',
                              (snapshot) => {
    
                                var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
                                    progress.style.width = progressValue + '%';
                                    percent.innerHTML = progressValue + '%';
                                    percent.style = "font-size:12px;color:black;"
    
                              },
                              (error) => {
                                  console.log(error)
                              },
                              () => {
    
                                uploadTask2.snapshot.ref.getDownloadURL()
                                        .then(downloadURL => {
    
                                          url_base = downloadURL
                                          console.log(url_base)
    
                                          var data = {
                                            created_by : "SUPER ADMINISTRADOR",
                                            date_start : toTimestamp(dates[0]),
                                            date_end : toTimestamp(dates[1]),
                                            observe_date_start : toTimestamp(dates2[0]),
                                            observe_date_end : toTimestamp(dates2[1]),
                                            inf_date_start : toTimestamp(dates3[0]),
                                            inf_date_end : toTimestamp(dates3[1]),
                                            date_register : Date.now(),
                                            date_modified : null,
                                            modified_by : null,
                                            semester : getSemester(),
                                            url_base : url_base,
                                            url_timeline : url_file_timeline,
                                            modality : md,
                                            is_financed : isFinancedValue,
                                            amount : "",
                                            id:""
                                          }
    
                                          db.collection("announcements").add(data).then((snapshot) => {
    
                                            db.collection("announcements").doc(snapshot.id).update({id:snapshot.id})
                                            document.getElementById("statusCharge").innerHTML = "Completado!"
                                            document.getElementById("statusCharge").style = "font-weight:bold;font-size:18px;"
                                            clearInputs()
                                            showButtons()
                          
                                          }).catch((error) => {
                                            console.log(error)
                                          })
                                        })
                                      })
                                    })
                                  })

    }

  
                            
                            }else{

                                Swal.fire(
                                  "Hey!",
                                  "Suba un archivo!",
                                  "info"
                                )
                              }
                              

  }else{

    Swal.fire(
      "Hey!",
      "Seleccione las fechas correspondientes!",
      "info"
    )

  }
}

function setData(ctx,id,start,end,obsStart,obsEnd,infStart,infEnd,urlBase,urlTimeline,modality,isFinanced){

  $('#detailModal').modal('show')
  document.getElementById("footerDetail").innerHTML = ""
  document.getElementById("detail-title").innerHTML = "Convocatoria #"+ctx
  document.getElementById("startDate").value = onlyDateNumber(parseInt(start))
  document.getElementById("endDate").value = onlyDateNumber(parseInt(end))
  document.getElementById("obs-startDate").value = onlyDateNumber(parseInt(obsStart))
  document.getElementById("obs-endDate").value = onlyDateNumber(parseInt(obsEnd))
  document.getElementById("inf-startDate").value = onlyDateNumber(parseInt(infStart))
  document.getElementById("inf-endDate").value = onlyDateNumber(parseInt(infEnd))
  document.getElementById("link_base").href = urlBase
  document.getElementById("link_timeline").href = urlTimeline

  let deleteAnnouncement = `<button onclick="deleteAnnouncement('${id}')" type="button" class="btn btn-danger">Eliminar</button>
  <button type="button" class="btn btn-warning">Editar</button>`
  $(deleteAnnouncement).appendTo('#footerDetail')

  //alert(modalityJson[parseInt(modality)].name_modality)

}


function deleteAnnouncement(id){

  Swal.fire({
    title: 'Estas seguro de eliminar?',
    showCancelButton: true,
    confirmButtonText: 'Si',
    cancelButtonText :'Cancelar',
  }).then((result) => {

    if (result.isConfirmed) {
      db.collection("announcements").doc(id).delete().catch((error) => {
        console.error("Error removing document: ", error);
    });
        $('#detailModal').modal('hide')
        Swal.fire('Eliminado!', '', 'success')
        console.log("Document successfully deleted!");
    } 
  })

}

function is_financed(){
  // Get the checkbox
  var checkBox = document.getElementById("is-financed");

  if (checkBox.checked == true){
    isFinanced = true
    document.getElementById("amount").style = "position: relative;display: flex;flex-wrap: wrap;align-items: stretch;width: 100%;"
  } else {
      isFinanced = false
      document.getElementById("amount").style = "display:none;"
  }
}

function createScriptDatatable(){

  $('#tb-announcements').DataTable({
    language: {
          "decimal": "",
          "emptyTable": "No hay información",
          "info": "Mostrando START a END de TOTAL datos",
          "infoEmpty": "Mostrando 0 to 0 of 0 datos",
          "infoFiltered": "(Filtrado de MAX total datos)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Listado de convocatorias",
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

function uploadRules(){

  var file = document.getElementById("file-rule").files[0]

  if(file != null){

    document.getElementById("div-ld-rules").style = "display:block"
    document.getElementById("btn-upload-rules").style = "display:none"

     var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
     var path = "docs" + '/rules/' + name
     document.getElementById("file").style = "display:none;"

     var storageRef = firebase.storage().ref(path)
     var uploadTask = storageRef.put(file)

     uploadTask.on('state_changed',
        (snapshot) => {
          var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
            document.getElementById("upload-p-rule").innerHTML = "Subiendo "+progressValue+"%"
        },
        (error) => {
            console.log(error)
            document.getElementById("div-ld-rules").style = "display:none"
            document.getElementById("btn-upload-rules").style = "display:block"
        },
        () => {

          uploadTask.snapshot.ref.getDownloadURL()
              .then(downloadURL => {
              
                var data = {
                  url_rule : downloadURL,
                  created_by : "SUPER ADMINISTRADOR",
                  date_register : Date.now(),
                  modified_by : null,
                  date_modified : null
                }

                
                db.collection("docs_announcements").doc("rules").set(data).then((snapshot) => {

                  localStorage.setItem("url-rules",downloadURL)
  
                  Swal.fire(
                    "Exito!",
                    "El documento ha sido subido!",
                    "success"
                  )

                  document.getElementById("md-body-rules").innerHTML = ""
                  document.getElementById("md-body-rules").innerHTML = `<div style="text-align:center;">
                  <a href="${downloadURL}" target="_blank"><img 
                  src="/intranet/dashboard/assets/img/file_icon.png" 
                  width="120px;">
                  <br>
                  <label style="font-size:22px;color:black;font-weight:bold;">VER REGLAMENTO</label>
                  </a><div>`
              
                  

                }).catch((error) => {
                  console.log(error)
                })

              })
            })


          }else{
            Swal.fire(
              "Hey!",
              "Suba un documento!",
              "warning"
            )
          }
        
}

function uploadArticles(){

  var file = document.getElementById("file-article").files[0]

  if(file != null){

    document.getElementById("div-ld-article").style = "display:block"
    document.getElementById("btn-upload-article").style = "display:none"

     var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
     var path = "docs" + '/articles/' + name
     document.getElementById("file").style = "display:none;"

     var storageRef = firebase.storage().ref(path)
     var uploadTask = storageRef.put(file)

     uploadTask.on('state_changed',
        (snapshot) => {
          var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
            document.getElementById("upload-p-article").innerHTML = "Subiendo "+progressValue+"%"
        },
        (error) => {
            console.log(error)
            document.getElementById("div-ld-article").style = "display:none"
            document.getElementById("btn-upload-article").style = "display:block"
        },
        () => {

          uploadTask.snapshot.ref.getDownloadURL()
              .then(downloadURL => {
              
                var data = {
                  url_article : downloadURL,
                  created_by : "SUPER ADMINISTRADOR",
                  date_register : Date.now(),
                  modified_by : null,
                  date_modified : null
                }

                
                db.collection("docs_announcements").doc("articles").set(data).then((snapshot) => {

                  localStorage.setItem("url-article",downloadURL)
  
                  Swal.fire(
                    "Exito!",
                    "El documento ha sido subido!",
                    "success"
                  )

                  document.getElementById("md-body-article").innerHTML = ""
                  document.getElementById("md-body-article").innerHTML = `<div style="text-align:center;">
                  <a href="${downloadURL}" target="_blank"><img 
                  src="/intranet/dashboard/assets/img/file_icon.png" 
                  width="120px;">
                  <br>
                  <label style="font-size:22px;color:black;font-weight:bold;">VER FORMATO DE ARTÍCULO</label>
                  </a><div>`
              
                  

                }).catch((error) => {
                  console.log(error)
                })

              })
            })


          }else{
            Swal.fire(
              "Hey!",
              "Suba un documento!",
              "warning"
            )
          }
        
}

function getRules(){

  //localStorage.removeItem("url-rules")
  var rule = localStorage.getItem("url-rules")

  if(rule == null){

    db.collection("docs_announcements").doc("rules").get().then((snapshot) =>{

      if(snapshot.exists){

        var rule = snapshot.data().url_rule
        console.log(rule)
      
        localStorage.setItem("url-rules",rule)
        document.getElementById("md-body-rules").innerHTML = ""
        document.getElementById("md-body-rules").innerHTML = `<div style="text-align:center;">
        <a href="${rule}" target="_blank"><img 
        src="/intranet/dashboard/assets/img/file_icon.png" 
        width="120px;">
        <br>
        <label style="font-size:22px;color:black;font-weight:bold;">VER REGLAMENTO</label>
        </a>
        <br><br>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateRuleModal">Actualizar reglamento</button>
        <div>`
  
      }else{

        document.getElementById("div-ld-rules-db").style = "display:none;"
        document.getElementById("block-upload").style = "text-align: center;display: block;"

      }
  
    })

  }else{

    document.getElementById("md-body-rules").innerHTML = ""
    document.getElementById("md-body-rules").innerHTML = `<div style="text-align:center;">
    <a href="${rule}" target="_blank"><img 
    src="/intranet/dashboard/assets/img/file_icon.png" 
    width="120px;">
    <br>
    <label style="font-size:22px;color:black;font-weight:bold;">VER REGLAMENTO</label>
    </a>
    <br><br>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateRuleModal">Actualizar reglamento</button>
    <div>`

    db.collection("docs_announcements").doc("rules").get().then((snapshot) =>{

      if(snapshot.exists){

        var rule = snapshot.data().url_rule
        console.log(rule)
      
        localStorage.setItem("url-rules",rule)
        document.getElementById("md-body-rules").innerHTML = ""
        document.getElementById("md-body-rules").innerHTML = `<div style="text-align:center;">
        <a href="${rule}" target="_blank"><img 
        src="/intranet/dashboard/assets/img/file_icon.png" 
        width="120px;">
        <br>
        <label style="font-size:22px;color:black;font-weight:bold;">VER REGLAMENTO</label>
        </a>
        <br><br>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateRuleModal">Actualizar reglamento</button>
        <div>`
  
      }
    })
  }
}

function updateRules(){

  var file = document.getElementById("file-up-rule").files[0]

  if(file != null){

    document.getElementById("btn-update-rule").style = "display:none"

     var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
     var path = "docs" + '/rules/' + name
     document.getElementById("file-up-rule").disabled = true

     var storageRef = firebase.storage().ref(path)
     var uploadTask = storageRef.put(file)

     uploadTask.on('state_changed',
        (snapshot) => {
          var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
            document.getElementById("update-rule-label").innerHTML = "Subiendo "+progressValue+"%"
        },
        (error) => {
            console.log(error)
            document.getElementById("div-ld-up-rules").style = "display:none"
            document.getElementById("btn-update-rule").style = "display:block"
        },
        () => {

          uploadTask.snapshot.ref.getDownloadURL()
              .then(downloadURL => {
              
                var data = {
                  url_rule : downloadURL,
                  modified_by : null,
                  date_modified : null
                }

                
                db.collection("docs_announcements").doc("rules").update(data).then((snapshot) => {

                  localStorage.setItem("url-rules",downloadURL)
                  document.getElementById("btn-update-rule").style = "display:block;"
                  document.getElementById("update-rule-label").innerHTML = "SUBE UN NUEVO ARCHIVO"
                  document.getElementById("file-up-rule").disabled = false
                  document.getElementById("file-up-rule").value = ""

                  $('#rulesModal').modal('show')
                  $('#updateRuleModal').modal('hide')
  
                  Swal.fire(
                    "Exito!",
                    "El documento ha sido actualizado!",
                    "success"
                  )

                    document.getElementById("md-body-rules").innerHTML = ""
                    document.getElementById("md-body-rules").innerHTML = `<div style="text-align:center;">
                    <a href="${downloadURL}" target="_blank"><img 
                    src="/intranet/dashboard/assets/img/file_icon.png" 
                    width="120px;">
                    <br>
                    <label style="font-size:22px;color:black;font-weight:bold;">VER REGLAMENTO</label>
                    </a>
                    <br><br>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateRuleModal">Actualizar reglamento</button>
                    <div>`
                          

                }).catch((error) => {
                  console.log(error)
                })

              })
            })


          }else{
            Swal.fire(
              "Hey!",
              "Suba un documento!",
              "warning"
            )
          }

}

function updateArticle(){

  var file = document.getElementById("file-up-article").files[0]

  if(file != null){

    document.getElementById("btn-update-article").style = "display:none"

     var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
     var path = "docs" + '/articles/' + name
     document.getElementById("file-up-article").disabled = true

     var storageRef = firebase.storage().ref(path)
     var uploadTask = storageRef.put(file)

     uploadTask.on('state_changed',
        (snapshot) => {
          var progressValue = String((snapshot.bytesTransferred / snapshot.totalBytes) * 100).split('.')[0];
            document.getElementById("update-article-label").innerHTML = "Subiendo "+progressValue+"%"
        },
        (error) => {
            console.log(error)
            document.getElementById("div-ld-up-article").style = "display:none"
            document.getElementById("btn-update-article").style = "display:block"
        },
        () => {

          uploadTask.snapshot.ref.getDownloadURL()
              .then(downloadURL => {
              
                var data = {
                  url_article : downloadURL,
                  modified_by : null,
                  date_modified : null
                }

                
                db.collection("docs_announcements").doc("articles").update(data).then((snapshot) => {

                  localStorage.setItem("url-article",downloadURL)
                  document.getElementById("btn-update-article").style = "display:block;"
                  document.getElementById("update-article-label").innerHTML = "SUBE UN NUEVO ARCHIVO"
                  document.getElementById("file-up-article").disabled = false
                  document.getElementById("file-up-article").value = ""

                  $('#articleModal').modal('show')
                  $('#updateArticleModal').modal('hide')
  
                  Swal.fire(
                    "Exito!",
                    "El documento ha sido actualizado!",
                    "success"
                  )

                    document.getElementById("md-body-article").innerHTML = ""
                    document.getElementById("md-body-article").innerHTML = `<div style="text-align:center;">
                    <a href="${downloadURL}" target="_blank"><img 
                    src="/intranet/dashboard/assets/img/file_icon.png" 
                    width="120px;">
                    <br>
                    <label style="font-size:22px;color:black;font-weight:bold;">VER FORMATO DE ARTÍCULO</label>
                    </a>
                    <br><br>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateArticleModal">Actualizar formato de artículo</button>
                    <div>`
                          

                }).catch((error) => {
                  console.log(error)
                })

              })
            })


          }else{
            Swal.fire(
              "Hey!",
              "Suba un documento!",
              "warning"
            )
          }

}

function getArticles(){

  //localStorage.removeItem("url-article")
  var article = localStorage.getItem("url-article")

  if(article == null){

    db.collection("docs_announcements").doc("articles").get().then((snapshot) =>{

      if(snapshot.exists){

        var articleUrl = snapshot.data().url_article
        console.log(articleUrl)
      
        localStorage.setItem("url-article",articleUrl)
        document.getElementById("md-body-article").innerHTML = ""
        document.getElementById("md-body-article").innerHTML = `<div style="text-align:center;">
        <a href="${articleUrl}" target="_blank"><img 
        src="/intranet/dashboard/assets/img/file_icon.png" 
        width="120px;">
        <br>
        <label style="font-size:22px;color:black;font-weight:bold;">VER FORMATO DE ARTÍCULO</label>
        </a>
        <br><br>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateArticleModal">Actualizar formato de artículo</button>
        <div>`
  
      }else{

        document.getElementById("div-ld-article-db").style = "display:none;"
        document.getElementById("block-upload-article").style = "text-align: center;display: block;"

      }
  
    })

  }else{

    document.getElementById("md-body-article").innerHTML = ""
    document.getElementById("md-body-article").innerHTML = `<div style="text-align:center;">
    <a href="${article}" target="_blank"><img 
    src="/intranet/dashboard/assets/img/file_icon.png" 
    width="120px;">
    <br>
    <label style="font-size:22px;color:black;font-weight:bold;">VER FORMATO DE ARTÍCULO</label>
    </a>
    <br><br>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateArticleModal">Actualizar formato de artículo</button>
    <div>`


    db.collection("docs_announcements").doc("articles").get().then((snapshot) =>{

      if(snapshot.exists){

        var article = snapshot.data().url_article
        console.log(article)
      
        localStorage.setItem("url-articles",article)
        document.getElementById("md-body-article").innerHTML = ""
        document.getElementById("md-body-article").innerHTML = `<div style="text-align:center;">
        <a href="${article}" target="_blank"><img 
        src="/intranet/dashboard/assets/img/file_icon.png" 
        width="120px;">
        <br>
        <label style="font-size:22px;color:black;font-weight:bold;">VER FORMATO DE ARTÍCULO</label>
        </a>
        <br><br>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateArticleModal">Actualizar formato de artículo</button>
        <div>`

      }
  
    })


  }


}

function clearInputs(){

  document.getElementById("date-start-and-end").value = ""
  document.getElementById("obs-date-start-and-end").value = ""
  document.getElementById("inf-date-start-and-end").value = ""
  document.getElementById("file").value = ""
  document.getElementById("file2").value = ""
  document.getElementById("file").disabled = false
  document.getElementById("file2").disabled = false

}

function hideButtons(){
  document.getElementById("btn-close-modal").disabled = true
  document.getElementById("btn-create").disabled = true
  document.getElementById("btn-close").style = "display:none;"
  document.getElementById("amountvalue").disabled = true
}

function showButtons(){
  var progress = document.getElementsByClassName('progress')[0];
  var percent = document.getElementsByClassName('percent')[0];
  progress.style.width = '0%';
  percent.innerHTML = '0%';
  document.getElementById("upload-area").style = "display:none;"
  document.getElementById("file").value = ""
  document.getElementById("file2").value = ""
  document.getElementById("file").disabled = false
  document.getElementById("file2").disabled = false
  document.getElementById("btn-close-modal").disabled = false
  document.getElementById("btn-close").style = "display:block;"
  document.getElementById("btn-create").disabled = false
  document.getElementById("amountvalue").disabled = false
}

function allModality(){

  fetch('../../../../dashboard/assets/js/utils/modality.json')
    .then((response) => 
          response.json())
    .then((json) => 
            {
              modalityJson = json
            }
        );
}