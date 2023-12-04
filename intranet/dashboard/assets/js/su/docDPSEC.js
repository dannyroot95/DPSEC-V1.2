var type__doc;
let user = JSON.parse(localStorage.getItem("currentUserData"))

if(user.type_user == "teacher"){
    document.getElementById("btn-create").remove()
}

document.querySelector('#file').addEventListener('change', () => {
    let pdffile = document.querySelector('#file').files[0];

    console.log(pdffile)
    console.log(pdffile.size / 1000);

    let palabraSplit = pdffile.name.split('.')
    let ultimoSplit = palabraSplit.length - 1;

    type__doc = palabraSplit[ultimoSplit];

    console.log("type documento: " + palabraSplit[ultimoSplit])
    if (palabraSplit[ultimoSplit] == "rar") {
        let urlrar = '../../img/rar.jpeg'
        document.querySelector('#visualizar').setAttribute('src', urlrar);
    }
    else if (palabraSplit[ultimoSplit] == "pdf") {
        let pdfurl = URL.createObjectURL(pdffile) + "#toolbar=0";
        document.querySelector('#visualizar').setAttribute('src', pdfurl);
    }

})
//cache
var cCache = localStorage.getItem("docDPSEC")
var cache = JSON.parse(cCache)

if (cache == null) {
    document.getElementById("loader").style = "display:block;margin-top:14px;"
    getDocDPSECFromDatabase()
} else {
    getDocDPSECFromCache()
    getDocDPSECFromDatabase()
}

function getDocDPSECFromDatabase() {


    db.collection("docDPSEC").where("date_register", "<", Date.now()).orderBy("date_register", "desc")
        .onSnapshot((querySnapshot) => {

            let ctx = 0
            let docDPSEC = []

            values = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (values.length > 0) {

                document.getElementById("accordionDocDPSEC").innerHTML = ""


                $("#accordionDocDPSEC").html(
                    values
                        .map((data) => {

                            ctx++
                            docDPSEC.push(data)

                            return `<tr style="border-bottom:1px #dee2e6 solid">
                      <td style="text-align:center">${ctx}</td>
                      <td style="text-align:center">
                      <strong class="type_doc">${data.type_doc}</strong></td>
                      <td>
                      <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-h${ctx}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#flush-c${ctx}" aria-expanded="false" aria-controls="flush-c${ctx}">
                      &nbsp;&nbsp;${data.title_doc} -&nbsp;${data.created_by}
                      </button>
                      </h2>
  
                      <div id="flush-c${ctx}" class="accordion-collapse collapse" aria-labelledby="flush-h${ctx}" 
                      data-bs-parent="#accordionDocDPSEC">
                      <br>
                      <label style="color:black;font-size:22px;">Fecha de inicio : <strong>${onlyDateNumber(data.date_register * 1000)}</strong></label>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <label style="color:black;font-size:22px;">Creado por : <strong>${data.created_by}</strong></label>
                      <br>
                      <br>
                      <div>
                      <label style="width:80%;"></label>
                      <div class="btn-group" role="group">
                          <button type="button" class="btn btn-danger" onclick="deleteDocDPSEC('${data.id}')">Eliminar</button>
                          <button type="button" class="btn btn-warning" onclick="updateDocDPSEC('${data.id}')">Modificar</button>
                      </div>
                      </div>
                      <br>
  
                      <iframe src="${data.url_timeline}" 
                      width="100%" height="500" frameborder="2"></iframe>
                      </div>
                      </div>
                      </td></tr>`;
                        }
                        )

                        .join("")

                );

                localStorage.setItem("docDPSEC", JSON.stringify(docDPSEC))

                document.getElementById("loader").style = "display:none;"

                var clase = document.querySelectorAll('.type_doc');
                for (var k = 0; k < clase.length; k++) {
                    if (clase[k].outerText == 'pdf') {
                        clase[k].innerHTML = '<i style=" font-size:35px"class="bi bi-file-earmark-pdf"></i>'
                    }
                    if (clase[k].outerText == 'jpg') {
                        clase[k].innerHTML = '<i style=" font-size:35px"class="bi bi-filetype-jpg"></i>'
                    }
                    if (clase[k].outerText == 'rar') {
                        clase[k].innerHTML = '<i style=" font-size:35px"class="bi bi-file-earmark-zip"></i>'
                    }
                }

            }

        })
}

function getDocDPSECFromCache() {

    let ctx = 0

    $("#accordionDocDPSEC").html(

        cache.map((data) => {

            ctx++

            return `<tr style="border-bottom:1px #dee2e6 solid">
                      <td style="text-align:center">${ctx}</td>
                      <td style="text-align:center">
                      <strong class="type_doc">${data.type_doc}</strong></td>
                      <td>
                      <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-h${ctx}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#flush-c${ctx}" aria-expanded="false" aria-controls="flush-c${ctx}">
                      &nbsp;&nbsp;${data.title_doc} -&nbsp;${data.created_by}
                      </button>
                      </h2>
  
                      <div id="flush-c${ctx}" class="accordion-collapse collapse" aria-labelledby="flush-h${ctx}" 
                      data-bs-parent="#accordionDocDPSEC">
                      <br>
                      <label style="color:black;font-size:22px;">Fecha de inicio : <strong>${onlyDateNumber(data.date_register * 1000)}</strong></label>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <label style="color:black;font-size:22px;">Creado por : <strong>${data.created_by}</strong></label>
                      <br>
                      <br>
                      <div>
                      <label style="width:80%;"></label>
                      <div class="btn-group" role="group">
                          <button type="button" class="btn btn-danger" onclick="deleteDocDPSEC('${data.id}')">Eliminar</button>
                          <button type="button" class="btn btn-warning" onclick="updateDocDPSEC('${data.id}')">Modificar</button>
                      </div>
                      </div>
                      <br>
  
                      <iframe src="${data.url_timeline}" 
                      width="100%" height="500" frameborder="2"></iframe>
                      </div>
                      </div>
                      </td></tr>`;
        })

            .join("")
    );
    var clase = document.querySelectorAll('.type_doc');
    for (var k = 0; k < clase.length; k++) {
        if (clase[k].outerText == 'pdf') {
            clase[k].innerHTML = '<i style=" font-size:35px"class="bi bi-file-earmark-pdf"></i>'
        }
        if (clase[k].outerText == 'jpg') {
            clase[k].innerHTML = '<i style=" font-size:35px"class="bi bi-filetype-jpg"></i>'
        }
        if (clase[k].outerText == 'rar') {
            clase[k].innerHTML = '<i style=" font-size:35px"class="bi bi-file-earmark-zip"></i>'
        }
    }
}

function createDocDPSEC() {
    console.log("subiendo")

    var NameFile = document.getElementById("fullnameFile").value
    //var dates = dt.split(" - ")
    var today = new Date();

    var now = today.toLocaleString();

    var dates = now;
    var url_file = ""

    if (NameFile != "") {

        var file = document.getElementById("file").files[0]

        if (file != null) {

            // hideButtons()
            var progress = document.getElementsByClassName('progress')[0];
            var percent = document.getElementsByClassName('percent')[0];
            var pause = document.getElementsByClassName('pause')[0];
            var resume = document.getElementsByClassName('resume')[0];
            var cancel = document.getElementsByClassName('cancel')[0];
            var name = file.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + file.name.split('.').pop()
            var path = 'docs/DPSEC/' + name

            document.getElementById("file").style = "display:none;"
            document.getElementById("upload-area").style = "display:block;"
            document.getElementById("statusCharge").style = "display:block;"
            document.getElementById("statusCharge").innerHTML = "1/1 Subiendo archivo...<div class='smallLoader'></div>"

            var storageRef = firebase.storage().ref(path)
            var uploadTask = storageRef.put(file)

            pause.onclick = function () {
                uploadTask.pause();
                resume.style.display = 'inline-block';
                pause.style.display = 'none';
                document.getElementById("file").style = "display:block;"
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

                            url_file = downloadURL
                            console.log(url_file);

                            percent.innerHTML = 'Subido';
                            percent.style = "font-size:12px;color:black;"
                            document.getElementById("div-controls").style = "display:none;"

                            var data = {
                                created_by: "ADMINISTRADOR",
                                title_doc: NameFile,
                                type_doc: type__doc,
                                date_register: Date.now() / 1000,
                                date_modified: null,
                                modified_by: null,
                                url_timeline: url_file,
                                id: ""
                            }

                            db.collection("docDPSEC").add(data).then((snapshot) => {

                                db.collection("docDPSEC").doc(snapshot.id).update({ id: snapshot.id })
                                document.getElementById("statusCharge").innerHTML = "Completado!"
                                clearInputs()
                                showButtons()

                            }).catch((error) => {
                                console.log(error)
                            })


                        })

                }
            )

        } else {

            Swal.fire(
                "Hey!",
                "Suba un archivo!",
                "info"
            )

        }
    } else {

        Swal.fire(
            "Hey!",
            "rellene los campos!",
            "info"
        )

    }
}
function updateDocDPSEC(id) {
    alert(id);
}
function deleteDocDPSEC(id) {

    Swal.fire({
        title: 'Estas seguro de eliminar?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
    }).then((result) => {

        if (result.isConfirmed) {
            db.collection("docDPSEC").doc(id).delete().catch((error) => {
                console.error("Error removing document: ", error);
            });
            Swal.fire('Eliminado!', '', 'success')
            console.log("Document successfully deleted!");
        }
    })

}
function clearInputs() {

    document.getElementById("fullnameFile").value = ""
    document.getElementById("file").style = "display:none;"
    document.getElementById("file").value = ""
    document.querySelector('#visualizar').removeAttribute("src");

}
function clearBox() {

    document.getElementById("fullnameFile").value = ""
    document.getElementById("file").value = ""
    document.querySelector('#visualizar').removeAttribute("src");
}
function showButtons() {
    var progress = document.getElementsByClassName('progress')[0];
    var percent = document.getElementsByClassName('percent')[0];
    progress.style.width = '0%';
    percent.innerHTML = '0%';
    document.getElementById("upload-area").style = "display:none;"
    document.getElementById("file").value = ""
    document.getElementById("file").style = "display:block; margin-bottom:20px; border:none"
    document.getElementById("btn-close-modal").disabled = false
    document.getElementById("btn-close").style = "display:block;"
    document.getElementById("btn-create").disabled = false
}
