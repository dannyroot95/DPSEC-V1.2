var isFinanced = false
var stdFound
var tchFound
var modalityJson
var carrersJson
var selectModality = document.getElementById("inputGroupSelect")
var selectResolution = document.getElementById("inputGroupSelectTypeResolution")
let user = JSON.parse(localStorage.getItem("currentUserData"))
var facultySelect = document.getElementById("inputGroupSelectFaculty")
const chkEnableTCH = document.getElementById("chk-active-tch")

chkEnableTCH .addEventListener("change", function() {
  // Aquí puedes realizar acciones basadas en el estado del checkbox
  if (chkEnableTCH .checked) {
   document.getElementById("div-in-tch").style = "display:flex;"
   document.getElementById("fieldsetTCH").style = "display:block;"
  } else {
   document.getElementById("div-in-tch").style = "display:none;"
   document.getElementById("fieldsetTCH").style = "display:none;"
  }
});

allFetch()

selectModality.addEventListener("change", function () {
  cancelStd()
  document.getElementById("tdbody-tch-std").innerHTML = ""
});

selectResolution.addEventListener("change", function (event) {
  var value = event.target.value
  if (value == "APROBACION DE PROYECTO PARA EJECUCIÓN") {
    optionAproved()
  } else {
    optionFinal()
  }
});


facultySelect.addEventListener('change', function handleChange(event) {

  var value = event.target.value
  var options = document.getElementById("inputGroupSelectCarrer")
  document.getElementById("groupDepartaments").style = "display:flex;"

  if (value == "ECOTURISMO") {
    options.innerHTML = `
    <option selected disabled>Seleccione una opción</option>
            <option value="2">DEPARTAMENTO ACADÉMICO DE CONTABILIDAD Y ADMINISTRACIÓN</option>
            <option value="7">DEPARTAMENTO ACADÉMICO DE ECOTURISMO</option>
             `
  } else if (value == "INGENIERÍA") {
    options.innerHTML = `
    <option selected disabled>Seleccione una opción</option>
            <option value="12">DEPARTAMENTO ACADÉMICO DE CIENCIAS BÁSICAS</option>
            <option value="8">DEPARTAMENTO ACADÉMICO DE INGENIERÍA FORESTAL Y MEDIO AMBIENTE</option>
            <option value="9">DEPARTAMENTO ACADÉMICO DE INGENIERÍA DE SISTEMAS E INFORMÁTICA</option>
            <option value="10">DEPARTAMENTO ACADÉMICO DE INGENIERÍA AGROINDUSTRIAL</option>
            <option value="11">DEPARTAMENTO ACADÉMICO DE MEDICINA VETERINARIA - ZOOTECNIA</option>
             `
  } else {
    options.innerHTML = `
    <option selected disabled>Seleccione una opción</option>
            <option value="1">DEPARTAMENTO ACADÉMICO DE DERECHO Y CIENCIAS POLÍTICAS</option>
            <option value="14">DEPARTAMENTO ACADÉMICO DE ENFERMERÍA</option>
            <option value="13">DEPARTAMENTO ACADÉMICO DE EDUCACIÓN Y HUMANIDADES</option>
            <option value="0">PROGRAMA ACADÉMICO DE DERECHO Y CIENCIAS POLÍTICAS</option>
            <option value="3">PROGRAMA ACADÉMICO DE INICIAL Y ESPECIALIDAD</option>
            <option value="4">PROGRAMA ACADÉMICO DE PRIMARIA E INFORMÁTICA</option>
            <option value="5">PROGRAMA ACADÉMICO DE MATEMÁTICA Y COMPUTACIÓN</option>
            <option value="6">PROGRAMA ACADÉMICO DE ENFERMERÍA</option>
   `
  }

});

let cache = localStorage.getItem("resolutions")
let pCache = JSON.parse(cache)

if (pCache == null) {
  document.getElementById("loader").style = "display:block;"
  getResolutions()
} else {
  getResolutionsFromCache()
}



function getResolutions() {

  db.collection("resolutions").onSnapshot((querySnapshot) => {

    let ctx = 0
    let resolutions = []

    values = querySnapshot.docs.map((doc) => ({
      ...doc.data(), id: doc.id
    }));

    console.log(values)

    if (values.length > 0) {

      $('#tb-resolution').DataTable().destroy()

      $("#tbody").html(
        values
          .map((data) => {

            ctx++
            resolutions.push(data)

            return `<tr style="cursor: pointer" onclick="editResolution('${encodeURIComponent(JSON.stringify(data))}')">
                  <td style="font-size:12px;"><strong>${ctx}</strong></td>
                  <td style="font-size:12px;">${data.num_resolution}</td>
                  <td style="font-size:12px;">${data.date_resolution}</td>
                  <td style="font-size:12px;">${data.name_adviser}</td>
                  <td style="font-size:12px;font-weight:600;color:black;">${modalityJson[parseInt(data.modality)].name_modality}</td>
                  <td style="font-size:12px;">${carrersJson[parseInt(data.departament)].carrerName}</td>
                  <td style="font-size:11px;">${data.type_resolution}</td>
                  <td style="font-size:12px;">
                  <a href="${data.url_file_resolution}" target="_blank">
                  <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
                  </a>
                  </td>
                  </tr>`;

          })

          .join("")
      );

      createScriptDatatable()
      document.getElementById("loader").style = "display:none;"
      localStorage.setItem("resolutions", JSON.stringify(resolutions))

    } else {
      createScriptDatatable()
      document.getElementById("loader").style = "display:none;"
    }

  })
}

function getResolutionsFromCache() {

  document.getElementById("loader").style = "display:none;"

  fetch('../../../../dashboard/assets/js/utils/modality.json')
    .then((response) =>
      response.json())
    .then((json) => {
      modalityJson = json

      let ctx = 0

      $("#tbody").html(
        pCache.map((data) => {

          ctx++

          return `<tr style="cursor: pointer" onclick="editResolution('${encodeURIComponent(JSON.stringify(data))}')">
      <td style="font-size:12px;"><strong>${ctx}</strong></td>
      <td style="font-size:12px;">${data.num_resolution}</td>
      <td style="font-size:12px;">${data.date_resolution}</td>
      <td style="font-size:12px;">${data.name_adviser}</td>
      <td style="font-size:12px;font-weight:600;color:black;">${modalityJson[parseInt(data.modality)].name_modality}</td>
      <td style="font-size:12px;">${carrersJson[parseInt(data.departament)].carrerName}</td>
      <td style="font-size:11px;">${data.type_resolution}</td>
      <td style="font-size:12px;">
      <a href="${data.url_file_resolution}" target="_blank">
      <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
      </a>
      </td>
      </tr>`;

        })

          .join("")
      );

      createScriptDatatable()
      getResolutions()
    });

}

function is_financed() {
  // Get the checkbox
  var checkBox = document.getElementById("chk-financed");

  if (checkBox.checked == true) {
    isFinanced = true
    document.getElementById("amount").style = "position: relative;display: flex;flex-wrap: wrap;align-items: stretch;width: 100%;"
  } else {
    isFinanced = false
    document.getElementById("amount").style = "display:none;"
  }
}

function allFetch() {

  fetch('../../../../dashboard/assets/js/utils/modality.json')
    .then((response) =>
      response.json())
    .then((json) => {
      modalityJson = json
    }
    );

  fetch('../../../../dashboard/assets/js/utils/carrersJson.json')
    .then((response) =>
      response.json())
    .then((json) => {
      carrersJson = json
    }
    );

}


function searchStd() {

  let code = document.getElementById("codeStd").value
  var btn_searchStd = document.getElementById("btn-std-table")
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzg0ZjE1OS0wNjQzLTRkYzItOTM5Yi1iMGQwOWVhNDg3MmQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZnRpbmVvIiwibmFtZSI6ImZ0aW5lbyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFwaUNvbnN1bWVyIiwiZXhwIjoxNjgyNjIwMDk5LCJpc3MiOiJjOTg0ZGZiMWEwMTdhM2VmOGI5N2UyNTM5ZjdlY2FhYSJ9.wDUHQegt-ILgiUxOTZOSjqaBKUzsaHF4OevO8qceiHc"


  if (code != "" && code.length == 8) {


    btn_searchStd.disabled = true
    code.disabled = true

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

          stdFound = {}
          btn_searchStd.disabled = false
          code.disabled = false
          code.value = ""
        }else{
          stdFound = { fullName: data[0].fullName, carrer_name: data[0].carrerName, code: data[0].userName, dni: "" }

          document.getElementById("codeStd").disabled = true
          document.getElementById("codeStd").value = (data[0].fullName).replace(",","")
          document.getElementById("btn-std-table").style = "display:none;"
          document.getElementById("addToTableSTD").style = "display:block;"
          document.getElementById("deleteQueryStd").style = "display:block;"
          btn_searchStd.disabled = false
          code.disabled = false
        }
      })

  } else {

    Swal.fire(
      'Hey!',
      'Ingrese el código de estudiante válido',
      'info'
    )

  }

}

function addStd() {

  var ctx = document.getElementById("tdbody-tch-std").rows.length;
  var e = document.getElementById("inputGroupSelect");
  var value = e.value;
  var ex = document.getElementById("inputGroupSelectCarrer");
  var valueX = ex.value;
  //var valueTxt = e.options[e.selectedIndex].text;


  if ((ctx + 1) <= modalityJson[parseInt(value)].max_std) {

    if (searchCode() < 1) {

      var data = `
      
        <tr>
        <th scope="row">${ctx + 1}</th>
        <td>${stdFound.fullName}</td>
        <td>${stdFound.code}</td>
        <td>${stdFound.dni}</td>
        <td><button class="btn btn-danger btnDel" onclick="deleteStd(this)" type="button">X</button></td>
        </tr>
        `

      $(data).appendTo('#tdbody-tch-std');
      document.getElementById("btn-std-table").style = "display:block;"
      cancelStd()

    } else {
      alert("ya existe en la tabla")
      cancelStd()
    }

  } else {
    alert("Excede el limite!")
    cancelStd()
  }

}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

function addStdMod2() {
  var ctx = document.getElementById("tdbody-tch-std").rows.length;
  var e = document.getElementById("inputGroupSelect");
  var value = e.value;
  var ex = document.getElementById("inputGroupSelectCarrer");
  var valueX = ex.value;

  var nombre = $('#SEfullname').val();
  var apep = $('#SElastnameP').val();
  var apem = $('#SElastnameM').val();

  var nombres =  apep + " " + apem  + " " + nombre;
  var parseNombres = removeAccents(nombres.toUpperCase())

  if (nombre, apep, apem != "") {

    if ((ctx + 1) <= modalityJson[parseInt(value)].max_std) {

      var data = `
      
        <tr>
        <th scope="row">${ctx + 1}</th>
        <td>${parseNombres}</td>
        <td></td>
     <td></td>
        <td><button class="btn btn-danger btnDel" onclick="deleteStd(this)" type="button">X</button></td>
        </tr>
        `
      $(data).appendTo('#tdbody-tch-std');

      clearMod2();

    } else {
      alert("Excede el limite!")
    }
  }
  else {
    Swal.fire(
      'Hey!',
      'Rellene los campos',
      'info'
    )
  }

}


function deleteStd(btn) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function clearMod2() {
  $('#SEfullname').val("");
  $('#SElastnameP').val("");
  $('#SElastnameM').val("");
  $('#openSearchStudents').modal('hide');
}
function countStdTable() {
  var ctx = 0
  var array = []
  var resume_table = document.getElementById("tbStd");

  for (var i = 1, row; row = resume_table.rows[i]; i++) {
    ctx++
    array.push(ctx)
  }

  //array.sort(function(a, b){return b - a});

  for (var i = 1, row; row = resume_table.rows[i]; i++) {
    resume_table.rows[i].cells[0].innerHTML = array[i - 1]
  }

}

function searchCode() {
  var filter, table, tr, td, i, txtValue;
  var existStd = 0
  filter = stdFound.code
  table = document.getElementById("tbStd");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1]
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue == stdFound.code) {
        //console.log("same")
        existStd++

      } else {
        //console.log("none")
      }
    }
  }

  return existStd

}

function cancelStd() {
  document.getElementById("btn-std-table").style = "display:block;"
  document.getElementById("codeStd").value = ""
  document.getElementById("codeStd").disabled = false
  document.getElementById("addToTableSTD").style = "display:none;"
  document.getElementById("deleteQueryStd").style = "display:none;"
  stdFound = null
}

function cancelTch() {
  document.getElementById("btn-tch-table").style = "display:block;"
  document.getElementById("codeTch").value = ""
  document.getElementById("codeTch").disabled = false
  document.getElementById("addToTableTCH").style = "display:none;"
  document.getElementById("deleteQueryTch").style = "display:none;"
  tchFound = null
}

function searchTch() {

  let dni = document.getElementById("codeTch").value
  let dni_adviser = document.getElementById("dni").value

  if (dni_adviser != "") {

    if (dni_adviser != dni) {

      if (dni != "") {

        fetchDni()

      } else {

        Swal.fire(
          'Hey!',
          'Ingrese el dni del docente',
          'info'
        )

      }

    } else {
      Swal.fire(
        'Hey!',
        'Imposible agregar este docente a la lista',
        'info'
      )
    }

  } else {
    Swal.fire(
      'Hey!',
      'Agrege el dni del docente asesor',
      'info'
    )
  }


}


function addTch() {

  var ctx = document.getElementById("tdbody-tch-tch").rows.length;
  var e = document.getElementById("inputGroupSelect");
  var value = e.value;


  if ((ctx + 1) <= modalityJson[parseInt(value)].max_tch) {

    if (searchCodeTch() < 1) {


      var data = `
      <tr>
      <th scope="row">${ctx + 1}</th>
      <td>${tchFound.fullName}</td>
      <td>${tchFound.dni}</td>
      <td><button class="btn btn-danger" onclick="deleteStd(this)" type="button">X</button></td>
      </tr>
      `

      $(data).appendTo('#tdbody-tch-tch');
      document.getElementById("btn-tch-table").style = "display:block;"
      cancelTch()


    } else {
      alert("ya existe en la tabla")
      cancelTch()
    }

  } else {
    alert("Excede el limite!")
    cancelTch()
  }

}

function searchCodeTch() {
  var filter, table, tr, td, i, txtValue;
  var existTch = 0
  filter = tchFound.code
  table = document.getElementById("tbTch");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1]
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue == tchFound.code) {
        //console.log("same")
        existTch++

      } else {
        //console.log("none")
      }
    }
  }
  return existTch
}


function fetchDni() {

  var dni = document.getElementById('codeTch')
  var btn_searchTch = document.getElementById("btn-tch-table")
  var responseClone


  if (dni.value.length == 8) {

    dni.disabled = true
    btn_searchTch.disabled = true
    dni.value = dni.value.replace(/[^0-9]/g, '').toLowerCase()
    var value = dni.value

    fetch('/intranet/dashboard/assets/js/utils/controllerDNI.php' + "?dni=" + value)
      .then(response => {
        responseClone = response.clone(); // 2
        return response.json();
      })
      .then(data => {
        tchFound = { fullName: data.nombre, dni: data.numeroDocumento }
        document.getElementById("codeTch").disabled = true
        document.getElementById("codeTch").value = data.nombre.replaceAll(",", "")
        document.getElementById("addToTableTCH").style = "display:block;"
        document.getElementById("deleteQueryTch").style = "display:block;"
        document.getElementById("btn-tch-table").style = "display:none;"
        dni.disabled = false
        btn_searchTch.disabled = false

      }, function (rejectionReason) { // 3
        console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
        responseClone.text() // 5
          .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText); // 6
            dni.disabled = false
            btn_searchTch.disabled = false
            dni.value = ""
            Swal.fire(
              'Oops!',
              'Sin resultados!',
              'info'
            )
          });
      });

  } else {
    dni.disabled = false
    btn_searchTch.disabled = false
    Swal.fire(
      'Hey!',
      'El DNI debe contener 8 caracteres!',
      'info'
    )
  }

}



function createFinalResolution() {

  let num_resolution = document.getElementById("num-resolution").value
  let date_resolution = document.getElementById("date-resolution").value
  let e = document.getElementById("inputGroupSelect")
  var valueModality = e.options[e.selectedIndex].text
  let amount = document.getElementById("amountvalue").value
  let dni_adviser = document.getElementById("dni").value
  let name_adviser = document.getElementById("fullname").value
  let title_project = document.getElementById("title-project").value
  let carrer_name = document.getElementById("inputGroupSelectCarrer")
  var valueCarrer = carrer_name.options[carrer_name.selectedIndex].text
  let faculty = document.getElementById("inputGroupSelectFaculty")
  var valueFaculty = faculty.options[faculty.selectedIndex].text


  var tb1 = $('#tbStd tr:has(td)').map(function (i, v) {
    var $td = $('td', this);
    return {
      fullName: $td.eq(0).text(),
      code: $td.eq(1).text(),
      dni: $td.eq(2).text()
    }
  }).get();

  var tb2 = $('#tbTch tr:has(td)').map(function (i, v) {
    var $td = $('td', this);
    return {
      fullName: $td.eq(0).text(),
      dni: $td.eq(1).text()
    }
  }).get();

  var fileResolution = document.getElementById("file-resolution").files[0]
  var fileExpediente = document.getElementById("file-expediente").files[0]

  if (num_resolution != "") {

    if (date_resolution != "") {

      if (e.value >= 0 && valueModality != "") {

        if (dni_adviser != "" && name_adviser != "") {

          if (title_project != "") {


            if (valueFaculty != "") {

                if (fileResolution != null) {

                  if (isFinanced == false && amount == "") {


                    if (carrer_name.value >= 0 && valueCarrer != "") {

                      if (fileExpediente != null) {
                        saveFinalResolution(num_resolution, date_resolution, e.value, isFinanced, amount, dni_adviser,
                          name_adviser, title_project, carrer_name.value, tb1, tb2, fileResolution, valueFaculty, fileExpediente)
                      } else {
                        saveFinalResolution(num_resolution, date_resolution, e.value, isFinanced, amount, dni_adviser,
                          name_adviser, title_project, carrer_name.value, tb1, tb2, fileResolution, valueFaculty, "")
                      }

                    } else {
                      Swal.fire(
                        'Hey!',
                        'Seleccione un departamento!',
                        'info'
                      )
                    }


                  } else {

                    if (amount != "") {

                      //ACA
                      if (carrer_name.value >= 0 && valueCarrer != "") {
                        saveFinalResolution(num_resolution, date_resolution, e.value, isFinanced, amount, dni_adviser,
                          name_adviser, title_project, carrer_name.value, tb1, tb2, fileResolution, valueFaculty, "")
                      } else {
                        Swal.fire(
                          'Hey!',
                          'Seleccione un departamento!',
                          'info'
                        )
                      }

                    } else {

                      Swal.fire(
                        'Hey!',
                        'Ingrese el monto del financiamiento!',
                        'info'
                      )
                    }

                  }

                } else {
                  Swal.fire(
                    'Hey!',
                    'Suba el archivo de resolución!!',
                    'info'
                  )
                }

            } else {
              Swal.fire(
                'Hey!',
                'Seleccione una facultad!!',
                'info'
              )
            }

          } else {
            Swal.fire(
              'Hey!',
              'Ingrese al título del proyecto!!',
              'info'
            )
          }

        } else {
          Swal.fire(
            'Hey!',
            'Agrege un docente asesor!!',
            'info'
          )
        }

      } else {
        Swal.fire(
          'Hey!',
          'Seleccione una modalidad!!',
          'info'
        )
      }

    } else {
      Swal.fire(
        'Hey!',
        'Ingrese la fecha de resolución!!',
        'info'
      )
    }

  } else {
    Swal.fire(
      'Hey!',
      'Ingrese el número de resolución!!',
      'info'
    )
  }

}

function saveFinalResolution(num_resolution, date_resolution, e, isFinanced, amount, dni_adviser,
  name_adviser, title_project, carrer_name, tb1, tb2, fileResolution, faculty, fileExpediente) {


  if (fileExpediente != "") {
    var name = fileResolution.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileResolution.name.split('.').pop()
    var rName = name.split('.')[1]
    var filename = `resolucion N°` + `${num_resolution}` + `.` + `${rName}`

    var nameEx = fileExpediente.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileExpediente.name.split('.').pop()
    var rNameEx = nameEx.split('.')[1]
    var filenameEx = `Expediente ` + `${num_resolution}` + `.` + `${rNameEx}`

    var path = "resolutions" + '/' + dni_adviser + '/' + filename
    var pathEx = "file" + '/' + dni_adviser + '/' + filenameEx
    var count = 0
    var typeRS = $("#inputGroupSelectTypeResolution option:selected").text()

    if (typeRS != "Seleccione una opccion...") {

      hideElementsOnUpload()

      db.collection("resolutions").where("num_resolution", "==", num_resolution).get().then((query) => {

        query.forEach((val) => {

          if (val.data().num_resolution == num_resolution) {
            count++
          }

        });

        if (count == 0) {

          var storageRef = firebase.storage().ref(path)
          var storageRefEx = firebase.storage().ref(pathEx)
          var uploadTask = storageRef.put(fileResolution)
          var uploadTaskEx = storageRefEx.put(fileExpediente)

          uploadTask.on('state_changed',
            (snapshot) => {

              console.log("Subiendo resolucion...")

            },
            (error) => {
              console.log(error)
            },
            () => {

              uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => {

                  uploadTaskEx.on('state_changed',
                    (snapshot) => {

                      console.log("Subiendo expediente...")
                    },

                    (error) => {
                      console.log(error)
                    },
                    () => {
                      uploadTaskEx.snapshot.ref.getDownloadURL()
                        .then(downloadURLEx => {


                          var data = {
                            num_resolution: num_resolution,
                            date_resolution: date_resolution,
                            modality: e,
                            is_financed: isFinanced,
                            amount: amount,
                            dni_adviser: dni_adviser,
                            name_adviser: name_adviser,
                            title_project: title_project,
                            departament: carrer_name,
                            students: tb1,
                            teachers: tb2,
                            id: "",
                            url_file_resolution: downloadURL,
                            url_file_proceedings: downloadURLEx,
                            date_register_resolution: Date.now(),
                            modified_by: null,
                            type_resolution: typeRS,
                            type_upload:"manual",
                            date_modified: null,
                            faculty: faculty,
                            created_by: user.fullName
                          }

                          db.collection("resolutions").add(data).then((docRef) => {

                            db.collection("resolutions").doc(docRef.id).update({ id: docRef.id })

                            showElementsOnUpload()
                            Swal.fire(
                              'Muy Bien!',
                              'La resolución ha sido creada!',
                              'success'
                            )

                          })

                        })
                    })
                })
            })

        } else {
          showElementsOnUpload()
          Swal.fire(
            'Error!',
            'Esta resolución ya existe!',
            'warning'
          )
        }

      })
    } else {
      Swal.fire(
        'Error!',
        'Seleccione el tipo de resolución!',
        'warning'
      )
    }
  } else {

    var name = fileResolution.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileResolution.name.split('.').pop()
    var rName = name.split('.')[1]
    var filename = `resolucion N°` + `${num_resolution}` + `.` + `${rName}`

    var path = "resolutions" + '/' + dni_adviser + '/' + filename
    var count = 0
    var typeRS = $("#inputGroupSelectTypeResolution option:selected").text()

    if (typeRS != "Seleccione una opccion...") {


      hideElementsOnUpload()

      db.collection("resolutions").where("num_resolution", "==", num_resolution).get().then((query) => {

        query.forEach((val) => {

          if (val.data().num_resolution == num_resolution) {
            count++
          }

        });

        if (count == 0) {

          var storageRef = firebase.storage().ref(path)
          var uploadTask = storageRef.put(fileResolution)

          uploadTask.on('state_changed',
            (snapshot) => {

              console.log("Subiendo resolucion...")

            },
            (error) => {
              console.log(error)
            },
            () => {

              uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => {


                  var data = {
                    num_resolution: num_resolution,
                    date_resolution: date_resolution,
                    modality: e,
                    is_financed: isFinanced,
                    amount: amount,
                    dni_adviser: dni_adviser,
                    name_adviser: name_adviser,
                    title_project: title_project,
                    departament: carrer_name,
                    students: tb1,
                    teachers: tb2,
                    id: "",
                    url_file_resolution: downloadURL,
                    url_file_proceedings: "",
                    date_register_resolution: Date.now(),
                    modified_by: null,
                    type_resolution: typeRS,
                    date_modified: null,
                    faculty: faculty,
                    created_by: user.fullName
                  }

                  db.collection("resolutions").add(data).then((docRef) => {

                    db.collection("resolutions").doc(docRef.id).update({ id: docRef.id })

                    showElementsOnUpload()
                    Swal.fire(
                      'Muy Bien!',
                      'La resolución ha sido creada!',
                      'success'
                    )

                  })

                })
            })

        } else {
          showElementsOnUpload()
          Swal.fire(
            'Error!',
            'Esta resolución ya existe!',
            'warning'
          )
        }

      })
    } else {
      Swal.fire(
        'Error!',
        'Seleccione el tipo de resolución!',
        'warning'
      )
    }

  }
}

function saveAprovedResolution(num_resolution, date_resolution, e, isFinanced, amount, dni_adviser,
  name_adviser, title_project, carrer_name, fileResolution, faculty) {

  var name = fileResolution.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileResolution.name.split('.').pop()
  var rName = name.split('.')[1]
  var filename = `resolucion N°` + `${num_resolution}` + `.` + `${rName}`

  var count = 0
  var path = "resolutions" + '/' + dni_adviser + '/' + filename
  var typeRS = $("#inputGroupSelectTypeResolution option:selected").text()

  hideElementsOnUpload()

  db.collection("resolutions").where("num_resolution", "==", num_resolution).get().then((query) => {

    query.forEach((val) => {

      if (val.data().num_resolution == num_resolution) {
        count++
      }

    });

    if (count == 0) {

      var storageRef = firebase.storage().ref(path)
      var uploadTask = storageRef.put(fileResolution)

      uploadTask.on('state_changed',
        (snapshot) => {

          console.log("Subiendo resolucion...")

        },
        (error) => {
          console.log(error)
        },
        () => {

          uploadTask.snapshot.ref.getDownloadURL()
            .then(downloadURL => {

              var data = {
                num_resolution: num_resolution,
                date_resolution: date_resolution,
                modality: e,
                is_financed: isFinanced,
                amount: amount,
                dni_adviser: dni_adviser,
                name_adviser: name_adviser,
                title_project: title_project,
                departament: carrer_name,
                id: "",
                url_file_resolution: downloadURL,
                url_file_proceedings: "",
                date_register_resolution: Date.now(),
                modified_by: null,
                type_resolution: typeRS,
                date_modified: null,
                faculty: faculty,
                created_by: user.fullName
              }

              db.collection("resolutions").add(data).then((docRef) => {

                db.collection("resolutions").doc(docRef.id).update({ id: docRef.id })

                showElementsOnUpload()

                Swal.fire(
                  'Muy Bien!',
                  'La resolución ha sido creada!',
                  'success'
                )

              })

            })
        })


    }

  })

}


function updateAprovedResolution(num_resolution, date_resolution, e, isFinanced, amount, dni_adviser,
  name_adviser, title_project, carrer_name, tb1, tb2, fileResolution, faculty, fileExpediente, id) {

  hideElementsOnUpload()

  var data
  var typeRS = $("#inputGroupSelectTypeResolution option:selected").text()

  if (fileExpediente == null && fileResolution == null) {
    data = {
      date_resolution: date_resolution,
      modality: e,
      is_financed: isFinanced,
      amount: amount,
      dni_adviser: dni_adviser,
      name_adviser: name_adviser,
      title_project: title_project,
      departament: carrer_name,
      students: tb1,
      teachers: tb2,
      modified_by: user.fullName,
      type_resolution: typeRS,
      date_modified: Date.now(),
      faculty: faculty,
    }

    db.collection("resolutions").doc(id).update(data)
    $('#createConstancyModal').modal('hide')
    Swal.fire(
      'Muy Bien!',
      'La resolución ha sido modificada!',
      'success'
    )

  } else if (fileExpediente == null && fileResolution != null) {

    var name = fileResolution.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileResolution.name.split('.').pop()
    var rName = name.split('.')[1]
    var filename = `resolucion N°` + `${num_resolution}` + `.` + `${rName}`
    var path = "resolutions" + '/' + dni_adviser + '/' + filename

    data = {
      date_resolution: date_resolution,
      modality: e,
      is_financed: isFinanced,
      amount: amount,
      dni_adviser: dni_adviser,
      name_adviser: name_adviser,
      title_project: title_project,
      departament: carrer_name,
      students: tb1,
      teachers: tb2,
      url_file_resolution: "",
      modified_by: user.fullName,
      type_resolution: typeRS,
      date_modified: Date.now(),
      faculty: faculty,
    }

    var storageRef = firebase.storage().ref(path)
    var uploadTask = storageRef.put(fileResolution)

    uploadTask.on('state_changed',
      (snapshot) => {

        console.log("Subiendo resolucion...")
      },

      (error) => {
        $('#createConstancyModal').modal('hide')
        Swal.fire(
          'Error!',
          'La resolución no ha sido modificada!',
          'error'
        )
        console.log(error)
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {

            data.url_file_resolution = downloadURL
            db.collection("resolutions").doc(id).update(data)
            $('#createConstancyModal').modal('hide')
            Swal.fire(
              'Muy Bien!',
              'La resolución ha sido modificada!',
              'success'
            )

          })

      })


  } else if (fileResolution == null && fileExpediente != null) {

    var nameEx = fileExpediente.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileExpediente.name.split('.').pop()
    var rNameEx = nameEx.split('.')[1]
    var filenameEx = `Expediente ` + `${num_resolution}` + `.` + `${rNameEx}`
    var pathEx = "file" + '/' + dni_adviser + '/' + filenameEx

    data = {
      date_resolution: date_resolution,
      modality: e,
      is_financed: isFinanced,
      amount: amount,
      dni_adviser: dni_adviser,
      name_adviser: name_adviser,
      title_project: title_project,
      departament: carrer_name,
      students: tb1,
      teachers: tb2,
      url_file_proceedings: "",
      modified_by: user.fullName,
      type_resolution: typeRS,
      date_modified: Date.now(),
      faculty: faculty,
    }

    var storageRefEx = firebase.storage().ref(pathEx)
    var uploadTaskEx = storageRefEx.put(fileExpediente)


    uploadTaskEx.on('state_changed',
      (snapshot) => {

        console.log("Subiendo expediente...")
      },

      (error) => {
        $('#createConstancyModal').modal('hide')
        Swal.fire(
          'Error!',
          'La resolución no ha sido modificada!',
          'error'
        )
        console.log(error)
      },
      () => {
        uploadTaskEx.snapshot.ref.getDownloadURL()
          .then(downloadURLEx => {

            data.url_file_proceedings = downloadURLEx
            db.collection("resolutions").doc(id).update(data)
            $('#createConstancyModal').modal('hide')
            Swal.fire(
              'Muy Bien!',
              'La resolución ha sido modificada!',
              'success'
            )

          })

      })


  } else {

    var name = fileResolution.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileResolution.name.split('.').pop()
    var rName = name.split('.')[1]
    var filename = `resolucion N°` + `${num_resolution}` + `.` + `${rName}`
    var path = "resolutions" + '/' + dni_adviser + '/' + filename

    var nameEx = fileExpediente.name.split('.').shift() + Math.floor(Math.random() * 10) + 10 + '.' + fileExpediente.name.split('.').pop()
    var rNameEx = nameEx.split('.')[1]
    var filenameEx = `Expediente ` + `${num_resolution}` + `.` + `${rNameEx}`
    var pathEx = "file" + '/' + dni_adviser + '/' + filenameEx

    var storageRef = firebase.storage().ref(path)
    var storageRefEx = firebase.storage().ref(pathEx)
    var uploadTask = storageRef.put(fileResolution)
    var uploadTaskEx = storageRefEx.put(fileExpediente)

    uploadTask.on('state_changed',
      (snapshot) => {

        console.log("Subiendo resolucion...")

      },
      (error) => {
        $('#createConstancyModal').modal('hide')
        Swal.fire(
          'Error!',
          'La resolución no ha sido modificada!',
          'error'
        )
      },
      () => {

        uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {

            uploadTaskEx.on('state_changed',
              (snapshot) => {

                console.log("Subiendo expediente...")
              },

              (error) => {
                $('#createConstancyModal').modal('hide')
                Swal.fire(
                  'Error!',
                  'La resolución no ha sido modificada!',
                  'error'
                )
                console.log(error)
              },
              () => {
                uploadTaskEx.snapshot.ref.getDownloadURL()
                  .then(downloadURLEx => {


                    data = {

                      url_file_resolution: downloadURL,
                      url_file_proceedings: downloadURLEx,
                      date_resolution: date_resolution,
                      modality: e,
                      is_financed: isFinanced,
                      amount: amount,
                      dni_adviser: dni_adviser,
                      name_adviser: name_adviser,
                      title_project: title_project,
                      departament: carrer_name,
                      students: tb1,
                      teachers: tb2,
                      modified_by: user.fullName,
                      type_upload: "manual",
                      type_resolution: typeRS,
                      date_modified: Date.now(),
                      faculty: faculty
                    }

                    db.collection("resolutions").doc(id).update(data)
                    $('#createConstancyModal').modal('hide')
                    Swal.fire(
                      'Muy Bien!',
                      'La resolución ha sido modificada!',
                      'success'
                    )
                  })
              })
          })
      })


  }
}


function createResolution() {
  var type = $("#inputGroupSelectTypeResolution option:selected").text()

  if (type == "APROBACION DE PROYECTO PARA EJECUCIÓN") {
    createAprovedResolution()
  } else if (type == "APROBACION DE INFORME FINAL") {
    createFinalResolution()
  } else if (type == "Seleccione una opccion...") {
    Swal.fire(
      'Hey!',
      'Seleccione una opción!',
      'info'
    )
  }

}


function editResolution(data) {

  data = JSON.parse(decodeURIComponent(data))
  var ctx = 0
  var ctx2 = 0
  var contentFile
  var btnEdit

  $('#createConstancyModal').modal('show')

  if (data.type_resolution == "APROBACION DE INFORME FINAL") {

    document.getElementById("div-rs-final").style = "display:block;"
    document.getElementById("div-buttons").innerHTML = ""
    document.getElementById("modalLabelTitle").innerHTML = "Detalle de resolución N°" + data.num_resolution
    document.getElementById("inputGroupSelectTypeResolution").value = data.type_resolution
    document.getElementById("num-resolution").value = data.num_resolution
    document.getElementById("num-resolution").disabled = true
    document.getElementById("date-resolution").value = data.date_resolution
    document.getElementById("inputGroupSelect").value = data.modality

    if (data.is_financed != true) {
      document.getElementById("chk-financed").checked = false
    } else {
      document.getElementById("chk-financed").checked = true
      document.getElementById("amount").style = "display:flex"
      document.getElementById("amountvalue").value = data.amount
    }

    document.getElementById("dni").value = data.dni_adviser
    document.getElementById("fullname").value = data.name_adviser
    document.getElementById("title-project").value = data.title_project
    document.getElementById("inputGroupSelectFaculty").value = data.faculty
    document.getElementById("groupDepartaments").style = "display:flex;"
    document.getElementById("inputGroupSelectCarrer").value = data.departament

    data.students.forEach(student => {
      ctx++
      var stdbody = `
        <tr>
        <th scope="row">${ctx}</th>
        <td>${student.fullName}</td>
        <td>${student.code}</td>
        <td>${student.dni}</td>
        <td><button class="btn btn-danger btnDel" onclick="deleteStd(this)" type="button">X</button></td>
        </tr>
        `
      $(stdbody).appendTo('#tdbody-tch-std')

    });

    data.teachers.forEach(teacher => {
      ctx2++
      var stdbody = `
        <tr>
        <th scope="row">${ctx2}</th>
        <td>${teacher.fullName}</td>
        <td>${teacher.dni}</td>
        <td><button class="btn btn-danger btnDel" onclick="deleteStd(this)" type="button">X</button></td>
        </tr>
        `
      $(stdbody).appendTo('#tdbody-tch-tch')

    });


    contentFile = `<hr class="solid">
      <center>
      <label style="font-size: 22px;font-weight: bold;color: #000;">Archivos Subidos</label><br><p></p>
     
      <div style="display: flex;justify-content:center;align-items:center;">
        <div>
          <a href="${data.url_file_recognition_resolution}" target="_blank">
            <ion-icon style="color:rgb(0, 41, 175);font-size: 45px;" name="document-attach-outline"></ion-icon>
          </a><br>
          <label>Resolución de reconocimiento</label>
        </div>
   
      </div>
  
     </center>
      <hr class="solid">`
    $(contentFile).appendTo('#contentFile')



    btnEdit = `<button type="button" class="btn btn-primary" id="btn-save" style="background-color: #000;border-color: #000;" 
      onclick="editAprovedResolution('${data.id}')">Editar resolución</button>
      
      <button type="button" class="btn btn-primary" id="btn-save" style="background-color: #fc0000;border-color: #fc0000;" 
      onclick="deleteResolution('${data.id}')">Eliminar resolución</button>
      
      `
    $(btnEdit).appendTo('#div-buttons')

  } else {

    document.getElementById("div-rs-final").style = "display:block;"

    document.getElementById("optionsModalityStd").style = "display:none;"
    document.getElementById("fieldsetSTD").style = "display:none;"
    document.getElementById("optionsModalityTch").style = "display:none;"
    document.getElementById("fieldsetTCH").style = "display:none;"
    document.getElementById("div-ex").style = "display:none;"

    document.getElementById("div-buttons").innerHTML = ""
    document.getElementById("modalLabelTitle").innerHTML = "Detalle de resolución N°" + data.num_resolution
    document.getElementById("inputGroupSelectTypeResolution").value = data.type_resolution
    document.getElementById("num-resolution").value = data.num_resolution
    document.getElementById("num-resolution").disabled = true
    document.getElementById("date-resolution").value = data.date_resolution
    document.getElementById("inputGroupSelect").value = data.modality

    if (data.is_financed != true) {
      document.getElementById("chk-financed").checked = false
    } else {
      document.getElementById("chk-financed").checked = true
      document.getElementById("amount").style = "display:flex"
      document.getElementById("amountvalue").value = data.amount
    }

    document.getElementById("dni").value = data.dni_adviser
    document.getElementById("fullname").value = data.name_adviser
    document.getElementById("title-project").value = data.title_project
    document.getElementById("inputGroupSelectFaculty").value = data.faculty
    document.getElementById("groupDepartaments").style = "display:flex;"
    document.getElementById("inputGroupSelectCarrer").value = data.departament

    contentFile = `<hr class="solid">
      <center>
      <label style="font-size: 22px;font-weight: bold;color: #000;">Archivos Subidos</label><br><p></p>
     
      <div style="display: flex;justify-content:center;align-items:center;">
        <div>
          <a href="${data.url_file_resolution}" target="_blank">
            <ion-icon style="color:rgb(162, 0, 130);font-size: 45px;" name="document-attach-outline"></ion-icon>
          </a><br>
          <label>Resolución de aprobación</label>
        </div>
      </div>
  
     </center>
      <hr class="solid">`
    $(contentFile).appendTo('#contentFile')

    var btnEdit
    btnEdit = `<button type="button" class="btn btn-primary" id="btn-save" style="background-color: #fc0000;border-color: #fc0000;" 
    onclick="deleteResolution('${data.id}')">Eliminar resolución</button>
    
    `
  $(btnEdit).appendTo('#div-buttons')

  }

}

function deleteResolution(id){
  Swal.fire({
    title: 'Esta seguro de eliminar esta resolución?',
    showCancelButton: true,
    confirmButtonText: 'Si',
    cancelButtonText:'No'
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $('#createConstancyModal').modal('hide')
      db.collection("resolutions").doc(id).delete()
      Swal.fire('Resolución eliminada!', '', 'success')
    } 
  })
}

function editAprovedResolution(id) {

  let num_resolution = document.getElementById("num-resolution").value
  let date_resolution = document.getElementById("date-resolution").value
  let e = document.getElementById("inputGroupSelect")
  var valueModality = e.options[e.selectedIndex].text
  let amount = document.getElementById("amountvalue").value
  let dni_adviser = document.getElementById("dni").value
  let name_adviser = document.getElementById("fullname").value
  let title_project = document.getElementById("title-project").value
  let carrer_name = document.getElementById("inputGroupSelectCarrer")
  var valueCarrer = carrer_name.options[carrer_name.selectedIndex].text
  let faculty = document.getElementById("inputGroupSelectFaculty")
  var valueFaculty = faculty.options[faculty.selectedIndex].text
  var financed = document.getElementById("chk-financed").checked


  var tb1 = $('#tbStd tr:has(td)').map(function (i, v) {
    var $td = $('td', this);
    return {
      fullName: $td.eq(0).text(),
      code: $td.eq(1).text(),
      dni: $td.eq(2).text()
    }
  }).get();

  var tb2 = $('#tbTch tr:has(td)').map(function (i, v) {
    var $td = $('td', this);
    return {
      fullName: $td.eq(0).text(),
      dni: $td.eq(1).text()
    }
  }).get();

  var fileResolution = document.getElementById("file-resolution").files[0]
  var fileExpediente = document.getElementById("file-expediente").files[0]


  if (date_resolution != "") {

    if (e.value >= 0 && valueModality != "") {

      if (dni_adviser != "" && name_adviser != "") {

        if (title_project != "") {

          if (valueFaculty != "") {

            if (carrer_name.value >= 0 && valueCarrer != "") {

              if (tb1.length != 0 && tb2.length != 0) {

                if (financed == false && amount == "") {

                  updateAprovedResolution(num_resolution, date_resolution, e.value, false, amount, dni_adviser,
                    name_adviser, title_project, carrer_name.value, tb1, tb2, fileResolution, valueFaculty, fileExpediente, id)

                } else {

                  if (amount != "") {

                    updateAprovedResolution(num_resolution, date_resolution, e.value, true, amount, dni_adviser,
                      name_adviser, title_project, carrer_name.value, tb1, tb2, fileResolution, valueFaculty, fileExpediente, id)

                  } else {

                    Swal.fire(
                      'Hey!',
                      'Ingrese el monto del financiamiento!',
                      'info'
                    )
                  }

                }


              } else {
                Swal.fire(
                  'Hey!',
                  'Agrege la lista de participantes!',
                  'warning'
                )
              }

            } else {
              Swal.fire(
                'Hey!',
                'Seleccione un departamento!!',
                'info'
              )
            }

          } else {
            Swal.fire(
              'Hey!',
              'Seleccione una facultad!!',
              'info'
            )
          }

        } else {
          Swal.fire(
            'Hey!',
            'Ingrese al título del proyecto!!',
            'info'
          )
        }

      } else {
        Swal.fire(
          'Hey!',
          'Agrege un docente asesor!!',
          'info'
        )
      }

    } else {
      Swal.fire(
        'Hey!',
        'Seleccione una modalidad!!',
        'info'
      )
    }

  } else {
    Swal.fire(
      'Hey!',
      'Ingrese la fecha de resolución!!',
      'info'
    )
  }
}

function createAprovedResolution() {
  let num_resolution = document.getElementById("num-resolution").value
  let date_resolution = document.getElementById("date-resolution").value
  let e = document.getElementById("inputGroupSelect")
  var valueModality = e.options[e.selectedIndex].text
  let amount = document.getElementById("amountvalue").value
  let dni_adviser = document.getElementById("dni").value
  let name_adviser = document.getElementById("fullname").value
  let title_project = document.getElementById("title-project").value
  let carrer_name = document.getElementById("inputGroupSelectCarrer")
  var valueCarrer = carrer_name.options[carrer_name.selectedIndex].text
  let facultyX = document.getElementById("inputGroupSelectFaculty")
  var valueFaculty = facultyX.options[facultyX.selectedIndex].text
  var fileResolution = document.getElementById("file-resolution").files[0]

  if (num_resolution != "") {

    if (date_resolution != "") {

      if (e.value >= 0 && valueModality != "") {

        if (dni_adviser != "" && name_adviser != "") {

          if (title_project != "") {

            if (valueFaculty != "Seleccione una opción") {

              if (carrer_name.value >= 0 && valueCarrer != "") {

                if (fileResolution != null) {

                  if (isFinanced == false && amount == "") {

                    saveAprovedResolution(num_resolution, date_resolution, e.value, isFinanced, amount, dni_adviser,
                      name_adviser, title_project, carrer_name.value, fileResolution, valueFaculty)

                  } else {

                    if (amount != "") {

                      saveAprovedResolution(num_resolution, date_resolution, e.value, isFinanced, amount, dni_adviser,
                        name_adviser, title_project, carrer_name.value, fileResolution, valueFaculty)

                    } else {
                      Swal.fire(
                        'Hey!',
                        'Ingrese el monto del financiamiento!',
                        'info'
                      )
                    }
                  }
                } else {
                  Swal.fire(
                    'Hey!',
                    'Suba el archivo de resolución!!',
                    'info'
                  )
                }
              } else {
                Swal.fire(
                  'Hey!',
                  'Seleccione un departamento!',
                  'info'
                )
              }
            } else {
              Swal.fire(
                'Hey!',
                'Seleccione una facultad!!',
                'info'
              )
            }
          } else {
            Swal.fire(
              'Hey!',
              'Ingrese al título del proyecto!!',
              'info'
            )
          }
        } else {
          Swal.fire(
            'Hey!',
            'Agrege un docente asesor!!',
            'info'
          )
        }
      } else {
        Swal.fire(
          'Hey!',
          'Seleccione una modalidad!!',
          'info'
        )
      }
    } else {
      Swal.fire(
        'Hey!',
        'Ingrese la fecha de resolución!!',
        'info'
      )
    }
  } else {
    Swal.fire(
      'Hey!',
      'Ingrese el número de resolución!!',
      'info'
    )
  }

}


function hideElementsOnUpload() {

  document.getElementById("num-resolution").disabled = true
  document.getElementById("date-resolution").disabled = true
  document.getElementById("inputGroupSelect").disabled = true
  document.getElementById("inputGroupSelectTypeResolution").disabled = true
  document.getElementById("amountvalue").disabled = false
  document.getElementById("dni").disabled = true
  document.getElementById("title-project").disabled = true
  document.getElementById("inputGroupSelectCarrer").disabled = true
  document.getElementById("inputGroupSelectFaculty").disabled = true
  document.getElementById("file-resolution").disabled = true

  document.getElementById("fullname").disabled = true

  document.getElementById("btn-std-table").disabled = true
  document.getElementById("btn-tch-table").disabled = true
  document.getElementById("codeStd").disabled = true
  document.getElementById("codeTch").disabled = true
  document.getElementById("modal-close").style = "display:none;"
  document.getElementById("isUpload").style = "display:flex;justify-content:center;align-items:center;"
  document.getElementById("div-buttons").style = "display:none;"

  document.getElementById("fieldsetSTD").disabled = true
  document.getElementById("fieldsetTCH").disabled = true

}

function showElementsOnUpload() {

  document.getElementById("modalLabelTitle").innerHTML = "Crear nueva resolución"

  document.getElementById("num-resolution").disabled = false
  document.getElementById("num-resolution").value = ""

  document.getElementById("date-resolution").disabled = false
  document.getElementById("date-resolution").value = ""

  document.getElementById("chk-financed").checked = false
  document.getElementById("amountvalue").disabled = false
  document.getElementById("amountvalue").value = ""
  document.getElementById("amount").style = "display:none;"

  document.getElementById("dni").disabled = false
  document.getElementById("dni").value = ""

  document.getElementById("fullname").value = ""

  document.getElementById("title-project").disabled = false
  document.getElementById("title-project").value = ""

  document.getElementById("inputGroupSelectTypeResolution").disabled = false
  document.getElementById("inputGroupSelectTypeResolution").value = ""
  document.getElementById("inputGroupSelect").disabled = false
  document.getElementById("inputGroupSelect").value = ""
  document.getElementById("inputGroupSelectCarrer").disabled = false
  document.getElementById("inputGroupSelectCarrer").value = ""
  document.getElementById("inputGroupSelectFaculty").disabled = false
  document.getElementById("inputGroupSelectFaculty").value = ""

  document.getElementById("file-resolution").disabled = false
  document.getElementById("file-resolution").value = ""

  document.getElementById("btn-std-table").disabled = false
  document.getElementById("btn-tch-table").disabled = false
  document.getElementById("codeStd").disabled = false
  document.getElementById("codeTch").disabled = false
  document.getElementById("modal-close").style = "display:block;"
  document.getElementById("isUpload").style = "display:none;"

  document.getElementById("div-buttons").innerHTML = ""
  document.getElementById("div-buttons").innerHTML = `<button type="button" class="btn btn-primary" id="btn-save" 
    style="background-color: #c5236f;border-color: #c5236f;" onclick="createResolution()">Crear resolución</button>  `
  document.getElementById("div-buttons").style = "display:block;"

  document.getElementById("fieldsetSTD").disabled = false
  document.getElementById("fieldsetTCH").disabled = false
  document.getElementById("tdbody-tch-tch").innerHTML = ""
  document.getElementById("tdbody-tch-std").innerHTML = ""
  document.getElementById("contentFile").innerHTML = ""

  document.getElementById("div-rs-final").style = "display:none;"

}

function createScriptDatatable() {

  $('#tb-resolution').DataTable({
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


function optionAproved() {
  document.getElementById("div-rs-final").style = "display:block;"
  document.getElementById("optionsModalityStd").style = "display:none;"
  document.getElementById("fieldsetSTD").style = "display:none;"
  document.getElementById("optionsModalityTch").style = "display:none;"
  document.getElementById("fieldsetTCH").style = "display:none;"
  document.getElementById("div-ex").style = "display:none;"
}

function optionFinal() {
  document.getElementById("div-rs-final").style = "display:block;"
  document.getElementById("optionsModalityStd").style = "display:block;"
  document.getElementById("fieldsetSTD").style = "display:block;"
  document.getElementById("optionsModalityTch").style = "display:block;"
  document.getElementById("fieldsetTCH").style = "display:block;"
  document.getElementById("div-ex").style = "display:none;"
}