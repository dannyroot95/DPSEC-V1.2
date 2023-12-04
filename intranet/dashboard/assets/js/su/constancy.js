var codeStudent = document.getElementById('code')
codeStudent.addEventListener('input', updateValue);
function updateValue(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').toLowerCase()
    var code = e.srcElement.value
    if(code.length == 8){
      getStudent(code) 
    }else{
        clearInputs()
    }
}

let cacheCs = localStorage.getItem("constancy")
let pCache = JSON.parse(cacheCs)

if(pCache == null){
  getConstancy()
}else{
  getConstancyFromCache()
  document.getElementById("loader").style = "display:none;"
}



function getConstancy(){

    document.getElementById("loader").style = "display:block;"

    db.collection("constancy").onSnapshot((querySnapshot) => {

        let ctx = 0
        let constancy = []
        
          values = querySnapshot.docs.map((doc) => ({
                  ...doc.data(),id: doc.id
            }));

            console.log(values)

            if(values.length > 0){

              $('#tb-constancy').DataTable().destroy()
            
              $("#tbody").html(
                values
                  .map((data) => {

                    ctx++
                    constancy.push(data)
                    var type = ""
                    var url 

                    if(data.type_create == "manual"){
                        type = "Manual"
                    }else{
                        type = "Automático"
                    }

                    if(data.url_constancy != ""){

                      url = `<a href="${data.url_constancy}" target="_blank">
                      <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
                      </a>`

                    }else{
                      url = `<a style="cursor: pointer;" 
                      onclick="printConstancy('${data.fullName}','${data.code}','${data.num_constancy}','${data.year}','${data.date_register}')">
                      <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
                      </a>`
                    }
    
                    return `<tr style="cursor: pointer;" onclick="detailConstancy('${encodeURIComponent(JSON.stringify(data))}')">
                    <td style="font-size:12px;"><strong>${ctx}</strong></td>
                    <td style="font-size:12px;">${data.fullName}</td>
                    <td style="font-size:12px;">${data.code}</td>
                    <td style="font-size:12px;font-weight:600;">${type}</td>
                    <td style="font-size:12px;">${data.num_constancy}</td>
                    <td style="font-size:12px;">
                    `+url+`
                    </td>
                    </tr>`;

                   
                  })

              .join("")
          );

          createScriptDatatable()
          localStorage.setItem("constancy",JSON.stringify(constancy))
          document.getElementById("loader").style = "display:none;"

        }else{
          createScriptDatatable()
          document.getElementById("loader").style = "display:none;"
        }

        }) 


}

function getConstancyFromCache(){

  let ctx = 0
  
  $("#tbody").html(

    pCache.map((data) => {

                    ctx++
                    var type = ""
                    var url 

                    if(data.type_create == "manual"){
                        type = "Manual"
                    }else{
                        type = "Automático"
                    }

                    if(data.url_constancy != ""){

                      url = `<a href="${data.url_constancy}" target="_blank">
                      <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
                      </a>`

                    }else{
                      url = `<a style="cursor: pointer;" 
                      onclick="printConstancy('${data.fullName}','${data.code}','${data.num_constancy}','${data.year}')">
                      <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
                      </a>`
                    }
    
                    return `<tr style="cursor: pointer;" onclick="detailConstancy('${encodeURIComponent(JSON.stringify(data))}')">
                    <td style="font-size:12px;"><strong>${ctx}</strong></td>
                    <td style="font-size:12px;">${data.fullName}</td>
                    <td style="font-size:12px;">${data.code}</td>
                    <td style="font-size:12px;font-weight:600;">${type}</td>
                    <td style="font-size:12px;">${data.num_constancy}</td>
                    <td style="font-size:12px;">
                    `+url+`
                    </td>
                    </tr>`;

                   
                  })

              .join("")
  );

  createScriptDatatable()
  getConstancy()

}

function clearInputs(){
    document.getElementById("code").disabled = false
    document.getElementById("fullname").value = ""
    document.getElementById("dni").value = ""
}

function getStudent(code){

  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzg0ZjE1OS0wNjQzLTRkYzItOTM5Yi1iMGQwOWVhNDg3MmQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZnRpbmVvIiwibmFtZSI6ImZ0aW5lbyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFwaUNvbnN1bWVyIiwiZXhwIjoxNjgyNjIwMDk5LCJpc3MiOiJjOTg0ZGZiMWEwMTdhM2VmOGI5N2UyNTM5ZjdlY2FhYSJ9.wDUHQegt-ILgiUxOTZOSjqaBKUzsaHF4OevO8qceiHc"

    fetch(`https://daa-documentos.unamad.edu.pe:8081/api/getStudentInfo/${code}`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`
          }
         }).then((res) => res.json())
            .then(data => {
              console.log(data)
              if(data.length == 0){
                Swal.fire(
                  'Oopss!',
                  'Estudiante no encontrado!',
                  'warning'
                )
              }else{
                let stdFound = { fullName: data[0].fullName, carrer_name: data[0].carrerName, code: data[0].userName, dni: "" }
                document.getElementById("fullname").value = (stdFound.fullName).replace(",","")
                document.getElementById("dni").value = ""
              }
            })      

}


  function createConstancy(){

    var code = document.getElementById("code").value
    var name = document.getElementById("fullname").value
    var dni = document.getElementById("dni").value
    var num_constancy = document.getElementById("num_constancy").value
    var year = document.getElementById("year").value
    var observe = document.getElementById("observe").value
    var file = document.getElementById("fileConstancy").files[0]  
    let user = JSON.parse(localStorage.getItem("currentUserData"))   
    var count = 0
    

    if(code != "" && name != "" && num_constancy != "" && year != ""){

        if(file != null){

            onUpload()
            var namefile = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
            var rName = namefile.split('.')[1]
            var filename = code+`.${rName}`
            var path = "constancy"+ '/'+filename

            db.collection("constancy").where("code" , "==" , code).get().then((query) =>{

                query.forEach((val) => {
                  
                  if(val.data().code == code){
                    count++            
                  }
                });
              
                if(count == 0){

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

                            var data = {
                                code : code,
                                dni : dni,
                                fullName : name,
                                observe : observe,
                                url_constancy : downloadURL,
                                num_constancy : num_constancy,
                                type_create : "manual",
                                date_register : Date.now(),
                                created_by : user.fullName,
                                modified_by : null,
                                date_modified : null,
                                year : year,
                                id : ""
                            }

                db.collection("constancy").add(data).then((docRef) => {

                    db.collection("constancy").doc(docRef.id).update({id:docRef.id})

                    clear()
                    onComplete()
                    document.getElementById("code").disabled = false
                    Swal.fire(
                      'Muy Bien!',
                      'Se creó la constancia!',
                      'success'
                    )
                    
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });


              })
            })

                }else{
                    clear()
                    onComplete()
                    Swal.fire(
                        'Oopss!',
                        'Ya existe esta constancia!',
                        'warning'
                      )
                }

            })

        }else{

          onUpload()
            
          db.collection("constancy").where("code" , "==" , code).get().then((query) =>{

            query.forEach((val) => {
              
              if(val.data().code == code){
                count++            
              }
            });
          
            if(count == 0){

               
                            var data = {
                            code : code,
                            dni : dni,
                            fullName : name,
                            observe : observe,
                            url_constancy : "",
                            num_constancy : num_constancy,
                            type_create : "automatic",
                            date_register : Date.now(),
                            created_by : user.fullName,
                            modified_by : null,
                            date_modified : null,
                            year : year,
                            id : ""
                        }

                      db.collection("constancy").add(data).then((docRef) => {

                          db.collection("constancy").doc(docRef.id).update({id:docRef.id})

                          clear()
                          onComplete()
                          document.getElementById("code").disabled = false
                          Swal.fire(
                            'Muy Bien!',
                            'Se creó la constancia!',
                            'success'
                          )
                          
                      })
                      .catch((error) => {
                          console.error("Error adding document: ", error);
                      });

                

            }else{
                clear()
                onComplete()
                Swal.fire(
                    'Oopss!',
                    'Ya existe esta constancia!',
                    'warning'
                  )
            }

        })

        }

    }else{
        Swal.fire(
            'Oopss!',
            'Complete los campos!',
            'warning'
          )

    }
  }

  function detailConstancy(data){
    data = JSON.parse(decodeURIComponent(data))
    $('#createConstancyModal').modal('show')
    document.getElementById("titleModal").innerHTML = "Detalle de constancia N°"+data.num_constancy
    document.getElementById("code").value = data.code
    document.getElementById("fullname").value = data.fullName
    document.getElementById("dni").value = data.dni
    document.getElementById("num_constancy").value = data.num_constancy
    document.getElementById("year").value = data.year
    document.getElementById("observe").value = data.observe

    document.getElementById("footer").innerHTML = `<div id="isUpload" style="display: none;">
        <label style="font-weight: bold;color:#000">Guardando datos...</label> &nbsp; <div class="smallLoader"></div>
        </div>
        <div id="div-buttons">
        <button type="button" class="btn btn-dark" id="btn-save" style="border-color: #000;" onclick="editConstancy()">Editar constancia</button>  
        <button type="button" class="btn btn-danger" id="btn-save" style="border-color: #FC0000;" onclick="deleteConstancy('${data.id}')">Eliminar</button>  
        </div>`

  }

  function clear(){

        document.getElementById("code").value = ""
        document.getElementById("fullname").value = ""
        document.getElementById("dni").value = ""
        document.getElementById("num_constancy").value = ""
        document.getElementById("year").value = ""
        document.getElementById("observe").value = "Ninguna"
        document.getElementById("fileConstancy").value = ""
        document.getElementById("titleModal").innerHTML = "Crear nueva constancia"
        document.getElementById("footer").innerHTML = `<div id="isUpload" style="display: none;">
        <label style="font-weight: bold;color:#000">Guardando datos...</label> &nbsp; <div class="smallLoader"></div>
        </div>
        <div id="div-buttons">
        <button type="button" class="btn btn-primary" id="btn-save" style="background-color: #c5236f;border-color: #c5236f;" onclick="createConstancy()">Crear constancia</button>  
        </div>`

  }

function onUpload(){
    document.getElementById("modal-close").style = "display:none;"
    document.getElementById("code").disabled = true
    document.getElementById("year").disabled = true
    document.getElementById("num_constancy").disabled = true
    document.getElementById("observe").disabled = true
    document.getElementById("fileConstancy").disabled = true
    document.getElementById("isUpload").style = "display:flex;justify-content:center;align-items:center;"
    document.getElementById("div-buttons").style = "display:none;"
}

function onComplete(){
    document.getElementById("modal-close").style = "display:block;"
    document.getElementById("code").disabled = false
    document.getElementById("year").disabled = false
    document.getElementById("observe").disabled = false
    document.getElementById("num_constancy").disabled = false
    document.getElementById("fileConstancy").disabled = false
    document.getElementById("isUpload").style = "display:none;"
    document.getElementById("div-buttons").style = "display:block;"
}

function deleteConstancy(id){
  db.collection("constancy").doc(id).delete()
  closeModal()
                          Swal.fire(
                              'Muy bien!',
                              'La constancia ha sido eliminado!',
                              'success'
                          )
}

function createScriptDatatable(){

    $('#tb-constancy').DataTable({
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

  function printConstancy(name,code,num,year,dateRegister){

    Swal.fire({
      title: 'En breves se descargará el archivo!',
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    if(num.length == 1){
      num = "00"+num
    }else if(num.length == 2){
      num = "0"+num
    }

    db.collection("templates").doc("constancy").get().then(snapshot =>{
    
      var doc = new jspdf.jsPDF();
            var image1 = new Image()
            var image2 = new Image()
            var firm = new Image()
            var sll = new Image()
            var vb = new Image()
            var width = doc.internal.pageSize.getWidth();
          
            var date = onlyDateNumberString(parseInt(dateRegister)).split("/")
            var day = date[0]
            var month = date[1]
            var yearA = date[2]


            //imgen fondo
            image1.src = "/intranet/images/unamad.png";
            doc.addImage(image1, 'JPEG', 33, 90, 140, 140);
            
            image2.src = "/intranet/images/logo.png";
            doc.addImage(image2, 'JPEG', 10, 5, 23, 25);
            doc.setFontSize(14);
            doc.setFont(undefined,'bold');
            doc.setFont("Arial Narrow");
            doc.text('UNIVERSIDAD NACIONAL AMAZONICA DE MADRE DE DIOS', width / 2, 13, { align: 'center' });
            doc.setFontSize(12);
            doc.text('VICERRECTORADO ACADÉMICO', width / 2, 18, { align: 'center' });
            doc.text('DIRECCIÓN DE PROYECION SOCIAL Y EXTENSION CULTURAL', width / 2, 23, { align: 'center' });
            doc.setFontSize(11);
            doc.text('“'+snapshot.data().year+'”', width / 2, 28, { align: 'center' });
            doc.text('“Madre de Dios Capital de la Biodiversidad del Perú”', width / 2, 33, { align: 'center' });
            doc.line(17, 34, 190, 34, 'F');
            doc.line(17, 34.3, 190, 34.3, 'F');
            var tex = "CONSTANCIA DPSEC N°"+num+"-"+year;
            doc.setFontSize(14);
            doc.text(tex, 110, 45);
            doc.setFontSize(28);
            doc.setFont("Rockwell Condensed");
            doc.text('CONSTANCIA', width / 2, 65, { align: 'center' });
            doc.setFontSize(16);
            doc.setFont(undefined,'none');
            doc.setFont("Arial Narrow");
            doc.text('La Dirección de Proyección Social y Extensión Cultural de la Universidad', width / 2, 85, { align: 'center' });
            doc.text('Nacional Amazónica de Madre de Dios, hace constar que el alumno(a):', width / 2, 95, { align: 'center' });
            doc.setFontSize(18);
            doc.setFont(undefined,'bold');
            doc.setFont("Rockwell Condensed");
            doc.text(name, width / 2, 115, { align: 'center' });
            doc.setFontSize(12);
            doc.setFont("Agency FB");
            doc.text("CÓDIGO ESTUDIANTE: " + code, width / 2, 120, { align: 'center' });
            doc.setFontSize(16);
            doc.setFont(undefined,'none');
            doc.setFont("Arial Narrow");
            doc.text('Ha   participado   en   actividades    de', 40, 140);
            doc.setFont(undefined,'bold');
            doc.text('Responsabilidad   Social', 132, 140);
            doc.setFont(undefined,'none');
            doc.setFont("Arial Narrow");
            doc.text('desarrollado por la Universidad Nacional Amazónica de Madre de Dios a ', 22, 150);
            doc.text('través de la Dirección de Proyección Social y Extensión Cultural.', 22, 160);
            doc.text('Se expide la presente constancia a solicitud del interesado para', 40, 190);
            doc.text('los fines que estime conveniente.', 22, 200);
            doc.setFontSize(14);
            doc.setFont(undefined,'bold');
            doc.text(' Puerto Maldonado, ' + day + ' de ' + month + ' ' + yearA + '', 100, 220);

            firm.src = "/intranet/images/firma1.png";
            doc.addImage(firm, 'JPEG', 20, 240, 70, 30);

            sll.src = "/intranet/images/sello_1.png";
            doc.addImage(sll, 'JPEG', 100, 240, 30, 30);

            vb.src = "/intranet/images/firma2.png";
            doc.addImage(vb, 'JPEG', 140, 243, 23, 23);

            doc.line(17, 280, 190, 280, 'F');
            doc.line(17, 280.3, 190, 280.3, 'F');
            doc.setFontSize(10);
            doc.setFont('calibri');
            doc.setFont(undefined,'bold');
            doc.text("Ciudad Universitaria Av. jorge Chávez N° 1160 - Puerto Maldonado - Madre de Dios ", width / 2, 285, { align: 'center' });
            //save pdf
            doc.save(''+code+'.pdf');

    })

  }

  

  function closeModal(){
   
    $('#createConstancyModal').modal('hide')
    document.getElementById("code").value = ""
    document.getElementById("fullname").value = ""
    document.getElementById("dni").value = ""
    document.getElementById("num_constancy").value = ""
    document.getElementById("year").value = ""
    document.getElementById("observe").value = "Ninguna"
    document.getElementById("fileConstancy").value = ""
    document.getElementById("titleModal").innerHTML = "Crear nueva constancia"
    document.getElementById("footer").innerHTML = `<div id="isUpload" style="display: none;">
    <label style="font-weight: bold;color:#000">Guardando datos...</label> &nbsp; <div class="smallLoader"></div>
    </div>
    <div id="div-buttons">
    <button type="button" class="btn btn-primary" id="btn-save" style="background-color: #c5236f;border-color: #c5236f;" onclick="createConstancy()">Crear constancia</button>  
    </div>`
    
  }



  function test(){
    
    var arrayWord = ['Al contrario del PENSAMIENTO POPULAR, el texto de Lorem Ipsum no es simplemente texto aleatorio. Tiene sus raices en una pieza cl´sica de la literatura del Latin, que data del año 45 antes de Cristo, haciendo que este adquiera mas de 2000 años de antiguedad. Richard McClintock, un profesor de Latin de la Universidad de Hampden-Sydney en Virginia, encontró una de las palabras más oscuras de la lengua del latín, "consecteur", en un pasaje de Lorem Ipsum, y al seguir leyendo distintos textos del latín, descubrió la fuente indudable. Lorem Ipsum viene de las secciones 1.10.32 y 1.10.33 de "de Finnibus Bonorum et Malorum" (Los Extremos del Bien y El Mal) por Cicero, escrito en el año 45 antes de Cristo. Este libro es un tratado de teoría de éticas, muy popular durante el Renacimiento. La primera linea del Lorem Ipsum, "Lorem ipsum dolor sit amet..", viene de una linea en la sección 1.10.32',
                     'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
                     'El trozo de texto estándar de Lorem Ipsum usado desde el año 1500 es reproducido debajo para aquellos interesados. Las secciones 1.10.32 y 1.10.33 de "de Finibus Bonorum et Malorum" por Cicero son también reproducidas en su forma original exacta, acompañadas por versiones en Inglés de la traducción realizada en 1914 por H. Rackham.']

    var doc = new jspdf.jsPDF();
    var image1 = new Image();
    var image2 = new Image();
    var width = doc.internal.pageSize.getWidth();
  
    //imgen fondo
    image1.src = "/images/unamad.png";
    doc.addImage(image1, 'JPEG', 33, 90, 140, 140);
    
    image2.src = "/images/logo.png";
    doc.addImage(image2, 'JPEG', 10, 5, 23, 25);
    doc.setFontSize(14);
    doc.setFont(undefined,'bold');
    doc.setFont("Arial Narrow");
    doc.text('UNIVERSIDAD NACIONAL AMAZONICA DE MADRE DE DIOS', width / 2, 13, { align: 'center' });
    doc.setFontSize(12);
    doc.text('VICERRECTORADO ACADÉMICO', width / 2, 18, { align: 'center' });
    doc.text('DIRECCIÓN DE PROYECION SOCIAL Y EXTENSION CULTURAL', width / 2, 23, { align: 'center' });
    doc.setFontSize(11);
    doc.text('“Año del Fortalecimiento de la Soberanía Nacional”', width / 2, 28, { align: 'center' });
    doc.text('“Madre de Dios Capital de la Biodiversidad del Perú”', width / 2, 33, { align: 'center' });
    doc.line(17, 34, 190, 34, 'F');
    doc.line(17, 34.3, 190, 34.3, 'F');

    doc.setFont(undefined,'');

    var init = 45
    var valueParagraph = 5.2
    for(var i = 0;i<arrayWord.length;i++){
      var splitTitle = doc.splitTextToSize(arrayWord[i], 175);
      doc.text(17, init, splitTitle);
      init = parseInt((letterCount(arrayWord[i])*valueParagraph)+init)
    }

    doc.save('xd'+'.pdf');

  }

  function letterCount(word) {
    var limit = 110
    var ctx = 0
    var c = 1
    for(var i = 0 ; i<word.length ; i++){
      ctx++
      if(ctx == limit){
        c++
        ctx = 0
      }
    }
return c
  }