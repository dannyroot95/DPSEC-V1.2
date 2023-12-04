
var chkTitle = document.getElementById("switchTitle")
var chkText = document.getElementById("switchContent")
var chkImage = document.getElementById("switchImage")

chkTitle.addEventListener('change', function() {
    if (this.checked) {
      document.getElementById("title-div").style = "display:flex;"
    } else {
        document.getElementById("title-div").style = "display:none;"
    }
  });

  chkText.addEventListener('change', function() {
    if (this.checked) {
      document.getElementById("text-div").style = "display:flex;"
    } else {
        document.getElementById("text-div").style = "display:none;"
    }
  });

  chkImage.addEventListener('change', function() {
    if (this.checked) {
      document.getElementById("img-div").style = "display:flex;"
    } else {
        document.getElementById("img-div").style = "display:none;"
    }
  });  

let cachePop = localStorage.getItem("popups")
let pCache = JSON.parse(cachePop)

if(pCache == null){
    getPopups()
  }else{
    getPopupsFromCache()
    document.getElementById("loader").style = "display:none;"
  }
  

 


  function savePopup(type){

    var title = document.getElementById("i-title").value
    var text = document.getElementById("i-text").value
    var file = document.getElementById("i-file").files[0]     

    if(chkTitle.checked == false && chkText.checked == false && chkImage.checked == false){
        //Seleccionar al menos una opcion   
        Swal.fire(
            'Hey!',
            'Seleccionar al menos una opcion!',
            'warning'
        )
    }else if(chkTitle.checked == true && chkText.checked == false && chkImage.checked == false){

        //Solo titulo
        if(title != ""){

            if(type == "create"){
                toDatabase(title,"","")
            }else{
                //edit
            }
            

        }else{
            alertSweet()
        }

    }else if(chkTitle.checked == false && chkText.checked == true && chkImage.checked == false){

         //Solo texto
         if(text != ""){
            if(type == "create"){
                toDatabase("",text,"")
            }else{
                //edit
            }
            
        }else{
            alertSweet()
        }

    }else if(chkTitle.checked == false && chkText.checked == false && chkImage.checked == true){

        //Solo imagen
        if(file != null){
            if(type == "create"){
                toDatabase("","",file)
            }else{
                //edit
            }
            
        }else{
            alertSweet()
        }

    }else if(chkTitle.checked == true && chkText.checked == true && chkImage.checked == false){

        //Solo titulo y texto
        if(title != "" && text != ""){
            if(type == "create"){
                toDatabase(title,text,"")
            }else{
                //edit
            }
            
        }else{
            alertSweet()
        }

    }else if(chkTitle.checked == false && chkText.checked == true && chkImage.checked == true){

        //Solo texto y imagen
        if(text != "" && file != null){
            if(type == "create"){
                toDatabase("",text,file)
            }else{
                //edit
            }
           
        }else{
            alertSweet()
        }

    }else if(chkTitle.checked == true && chkText.checked == false && chkImage.checked == true){

        //Solo titulo y imagen
        if(title != "" && file != null){
            if(type == "create"){
                toDatabase(title,"",file)
            }else{
                //edit
            }
            
        }else{
            alertSweet()
        }

    }else{
        //Todo
        if(title != "" && file != null && text != ""){
            if(type == "create"){
                toDatabase(title,text,file)
            }else{
                //edit
            }
            
        }else{
            alertSweet()
        }
    }

  }

  function toDatabase(title,text,file){

    let user = JSON.parse(localStorage.getItem("currentUserData"))  

    document.getElementById("isUpload").style = "display:flex;justify-content:center;align-items:center;"
    document.getElementById("div-buttons").style = "display:none;"
    document.getElementById("md-close").style = "display:none;"

    if(file != ""){

            var namefile = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
            var path = "popups"+ '/'+namefile
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

                                var data = {title : title , 
                                    text : text , 
                                    url_image : downloadURL , 
                                    date_register:Date.now(),
                                    modified_by : null,
                                    date_modified : null,
                                    created_by : user.fullName,
                                    id:""
                                }

                            db.collection("popups").add(data)
                            document.getElementById("isUpload").style = "display:none;"
                            document.getElementById("div-buttons").style = "display:block;"
                            document.getElementById("md-close").style = "display:block;"
                            $('#createPopup').modal('hide')
                            Swal.fire(
                                'Muy bien!',
                                'Se guardaron los datos!',
                                'success'
                            )

              })
            })

    }else{
        var data = {title : title , 
            text : text , 
            url_image : "", date_register:Date.now(),
            modified_by : null,
            date_modified : null,
            created_by : user.fullName,
            id:""
        }
        db.collection("popups").add(data)
        document.getElementById("isUpload").style = "display:none;"
        document.getElementById("div-buttons").style = "display:block;"
        document.getElementById("md-close").style = "display:block;"
        $('#createPopup').modal('hide')
        Swal.fire(
            'Muy bien!',
            'Se guardaron los datos!',
            'success'
        )
    }

  }

  function alertSweet(){
    Swal.fire(
        'Hey!',
        'Complete los campos!',
        'warning'
    )
  }

  function getPopups(){

    document.getElementById("loader").style = "display:block;"

    db.collection("popups").onSnapshot((querySnapshot) => {

        let ctx = 0
        let popups = []
    
          values = querySnapshot.docs.map((doc) => ({
              ...doc.data(),id: doc.id
            }));


            if(values.length > 0){

              $('#tb-popups').DataTable().destroy()
            
              $("#tbody").html(
                values
                  .map((data) => {

                    ctx++
                    popups.push(data)
                    var title 
                    var text 
                    var img

                    if (data.title != "") {
                        title = `<label style="font-size:12px;">${data.title}</label>`
                    }else{
                        title = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
                        No disponible
                        </a>`
                    }

                    if (data.text != "") {
                        text = `<ion-icon size="large" style="color:#229954;" name="checkbox-outline"></ion-icon>`
                    }else{
                        text = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
                        No disponible
                        </a>`
                    }

                    if (data.url_image != "") {
                        img = `<a href="${data.url_image}" target="_blank">
                        <ion-icon style="color:#000;" size="large" name="image"></ion-icon>
                        </a>`
                    }else{
                        img = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
                        No disponible
                        </a>`
                    }


    
                    return `<tr style="cursor:pointer;" onclick="detailPopup('${data.id}','${data.title}','${data.text}','${data.url_image}')">
                    <td style="font-size:12px;"><strong>${ctx}</strong></td>
                    <td style="font-size:12px;">${title}</td>
                    <td style="font-size:12px;">${text}</td>
                    <td style="font-size:12px;font-weight:600;">${img}</td>
                    <td style="font-size:12px;">${onlyDateNumber(data.date_register)}</td>
                    </tr>`;

                   
                  })

              .join("")
          );

          createScriptDatatable()
          localStorage.setItem("popups",JSON.stringify(popups))
          document.getElementById("loader").style = "display:none;"

        }else{
          localStorage.removeItem("popups")
          createScriptDatatable()
          document.getElementById("loader").style = "display:none;"
        }

        }) 


}

function getPopupsFromCache(){
    let ctx = 0

    $("#tbody").html(
        pCache.map((data) => {

            ctx++
            var title 
            var text 
            var img

            if (data.title != "") {
                title = `<label style="font-size:12px;">${data.title}</label>`
            }else{
                title = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
                No disponible
                </a>`
            }

            if (data.text != "") {
                text = `<ion-icon size="large" style="color:#229954;" name="checkbox-outline"></ion-icon>`
            }else{
                text = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
                No disponible
                </a>`
            }

            if (data.url_image != "") {
                img = `<a href="${data.url_image}" target="_blank">
                <ion-icon style="color:#000;" size="large" name="image"></ion-icon>
                </a>`
            }else{
                img = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
                No disponible
                </a>`
            }



            return `<tr style="cursor:pointer;" onclick="detailPopup('${data.id}','${data.title}','${data.text}','${data.url_image}')">
            <td style="font-size:12px;"><strong>${ctx}</strong></td>
            <td style="font-size:12px;">${title}</td>
            <td style="font-size:12px;">${text}</td>
            <td style="font-size:12px;font-weight:600;">${img}</td>
            <td style="font-size:12px;">${onlyDateNumber(data.date_register)}</td>
            </tr>`;

           
          })

      .join("")
  );

  createScriptDatatable()
  getPopups()
  
}

  function createScriptDatatable(){

    $('#tb-popups').DataTable({
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

  function clearModal(){
     document.getElementById("createPopupLabel").innerHTML = "Crear nuevo anuncio"
     document.getElementById("switchTitle").checked = false
     document.getElementById("switchContent").checked = false
     document.getElementById("switchImage").checked = false
     document.getElementById("i-title").value = ""
     document.getElementById("i-text").value = ""
     document.getElementById("i-file").value = ""
     document.getElementById("title-div").style = "display:none;"
     document.getElementById("text-div").style = "display:none;"
     document.getElementById("img-div").style = "display:none;"
     document.getElementById("show-image").innerHTML = ""
     document.getElementById("footer").innerHTML = `<div id="isUpload" style="display: none;">
     <label style="font-weight: bold;color:#000">Guardando datos...</label> &nbsp; <div class="smallLoader"></div></div>
     <div id="div-buttons">
     <button type="button" class="btn btn-primary" id="btn-save" onclick="savePopup('create')">Guardar</button>
     </div>`
  }

  function detailPopup(id,title,text,image){
    $('#createPopup').modal('show')
    document.getElementById("createPopupLabel").innerHTML = "Editar anuncio"
    document.getElementById("footer").innerHTML = `
    <button type="button" class="btn btn-dark" onclick="editPopup('${id}',)">Editar</button>
    <button type="button" class="btn btn-danger" onclick="deletePopup('${id}')">Eliminar</button> `

    if(title != ""){
        document.getElementById("switchTitle").checked = true
        document.getElementById("title-div").style = "display:flex;"
        document.getElementById("i-title").value = title
    }

    if(text != ""){
        document.getElementById("switchContent").checked = true
        document.getElementById("text-div").style = "display:flex;"
        document.getElementById("i-text").value = text
    }

    if(image != ""){
        document.getElementById("show-image").innerHTML = `<center><img src='${image}' width="50%"></center><p></p>`
    }

  }

  function deletePopup(id){
    db.collection("popups").doc(id).delete()
    $('#createPopup').modal('hide')
                            Swal.fire(
                                'Muy bien!',
                                'El anuncio ha sido eliminado!',
                                'success'
                            )
  }
  