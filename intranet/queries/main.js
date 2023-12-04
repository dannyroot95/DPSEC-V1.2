
//<button class="btn btn-outline-light" onclick="searchResoluionStd('code')" style="font-weight:bold;border-color: rgb(43,115,196);color:rgb(43,115,196)">Consultar resoluciones</button>
function setCode(){///constancia - code student \\ resolucion - nombre
    document.getElementById("content").innerHTML = ''

    document.getElementById("types").style = "display: flex;justify-content:center;align-items:center;margin-top: -20px;"
  
    var input = `
    
    <select id="optionSearch" class="form-select"  style="margin-bottom:.5rem"aria-label="Default select example">
          <option value="init" disabled selected>Seleccione busqueda</option>
          <option value="Constancia">Constancia</option>
          <option value="Resolución">Resolución</option>
    </select>

    <div id="content-input-search" class="input-group mb-3">
          <div class="input-group-prepend">
            <span id="label-search" class="input-group-text" style="font-weight:bold;">Seleccione busqueda</span>
          </div>
          <input type="tel" maxlength="8" id="code" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
    </div>

        <button id="btn-search-constancia" class="btn btn-outline-light" onclick="query('code')" style="font-weight:bold;border-color: rgb(196, 43, 119);color:rgb(196, 43, 119)">Consultar constancia</button>
        &nbsp;
        

    `;

    $(input).appendTo('#content');
    document.getElementById("code").disabled = true
    document.getElementById("content-input-search").hidden = true;
    document.getElementById("btn-search-constancia").hidden = true

    optionSearch.addEventListener("change",(e)=>{
      let valueLabel = document.getElementById("label-search")
      if (e.target.value == "Constancia"){
        valueLabel.innerText = "Código de estudiante"
        document.getElementById("code").disabled = false
        document.getElementById("content-input-search").hidden = false;
        document.getElementById("btn-search-constancia").hidden = false;
      }
      if (e.target.value == "Resolución"){//modal nombre completo search
        valueLabel.innerText = "Nombre de estudiante"
        document.getElementById("code").disabled = false
        $("#SearchModalByResolution").modal("show");
        document.getElementById("content-input-search").hidden = true;
        document.getElementById("btn-search-constancia").hidden = true
        optionSearch.value = "init"
      }

    })
}


function setDNI(){

    document.getElementById("content").innerHTML = ''

    document.getElementById("types").style = "display: flex;justify-content:center;align-items:center;margin-top: -20px;"
    document.getElementById("content").style = 'width: 40%;'

    var input = `
    
    <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" style="font-weight:bold;">DNI</span>
          </div>
          <input type="tel" maxlength="8" id="dni" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
        </div>

        <button class="btn btn-outline-light" onclick="query('dni')" style="font-weight:bold;border-color: rgb(196, 43, 119);color:rgb(196, 43, 119)">Consultar resoluciones</button>


    `
    $(input).appendTo('#content');
    document.getElementById("dni").disabled = false

}

function fnSearchResolution(){/////////////////////////////////////////////////////////////////
  let fullname = lastNameFather.value.toUpperCase().trim()
  fullname += " "+lastNameMother.value.toUpperCase().trim()
  fullname += " "+inputName.value.toUpperCase().trim()
  searchResolutionStd(fullname)
 
}
//-----------------------------------------------------------------------------------------------------
function query(type){//string dni

   var ctx = 0
   var obj

    if(type == "code"){
      var code = document.getElementById("code").value
      if(code != ""){
        hideCode()
        db.collection("constancy").where("code", "==", code).get().then((query) => {
          query.forEach((doc) => {
            if(doc.data().code == code){
              ctx++
              obj = doc.data()
            }
          });
  
          if(ctx != 0 ){
              showDataCode(obj)
          }else{
            showCode()
            Swal.fire(
              'Oopss!',
              'Sin resultados!',
              'warning'
            )
          }
        })
      }else{
        Swal.fire(
          'Oopss!',
          'Ingrese su código de estudiante!',
          'warning'
        )
      }
    }else{
      var code = document.getElementById("dni").value
      if(code != ""){
        searchResolution()
      }else{
        Swal.fire(
          'Oopss!',
          'Ingrese su DNI',
          'warning'
        )
      }
      //
    }
}

//-----------------------------------------------------------------------------------------------------

function hideCode(){

  document.getElementById("code").disabled = true
  document.getElementById("types").style = "pointer-events:none;display: flex;justify-content:center;align-items:center;margin-top: -20px;"
  document.getElementById("loader").style = "display:block;margin-top:10px;"
  document.getElementById("content").innerHTML = ''

}

function hideDNI(){

  document.getElementById("dni").disabled = true
  document.getElementById("types").style = "pointer-events:none;display: flex;justify-content:center;align-items:center;margin-top: -20px;"
  document.getElementById("loader").style = "display:block;margin-top:10px;"
  document.getElementById("content").innerHTML = ''

}

function showCode(){
  document.getElementById("content").style = 'width: 40%;'
  document.getElementById("loader").style = "display:none;"
  setCode()

}

function showDNI(){

  document.getElementById("loader").style = "display:none;"
  setDNI()

}

function showDataCode(obj){

  document.getElementById("loader").style = "display:none;"
  document.getElementById("content").innerHTML = ''
  var url

  if(obj.url_constancy != "" && obj.url_constancy != null){
    url = `<a href="${obj.url_constancy}" target="_blank">
    <ion-icon style="color:#000;" name="document-attach-outline"></ion-icon><label style="font-weight:600;cursor:pointer;">&nbsp;CONSTANCIA</label>
    </a>`
  }else{
    url = `<a style="cursor:pointer;" onclick="printer('${obj.fullName}','${obj.code}','${obj.num_constancy}','${obj.year}','${obj.date_register}')" target="_blank">
    <ion-icon style="color:#c5236f;" name="document-attach-outline"></ion-icon><label style="font-weight:600;cursor:pointer;">&nbsp;CONSTANCIA</label>
    </a>`
  }

  var input = `
                <div>
                <label>${obj.fullName}</label> | <label>${obj.code}</label> | 
                `+url+`
                <br><p></p>
                <button class="btn btn-outline-success" onclick="showCode()" style="margin-bottom:10px;">Volver a consultar</button> 
                </div>
    `
    $(input).appendTo('#content');

}

function showDataCodeRS(values){

  document.getElementById("loader").style = "display:none;"
  document.getElementById("content").innerHTML = ''
  document.getElementById("content").style = 'width: 90%;'
  let ctx = 0

  var input = `

  <div class="table-responsive" style="width:100%;">
     <table class="table table-hover" id="tb-students">
      <thead>
        <tr style="background-color: #c5236f;color: #f1f1f1;">
          <th scope="col" style="width: 10px;"><center>#</center></th>
          <th scope="col" style="width: 100px;"><center>Título del proyecto</center></th>
          <th scope="col" style="width: 5px;"><center>N° de resolución</center></th>
          <th scope="col" style="width: 5px;"><center>Tipo de resolución</center></th>
          <th scope="col" style="width: 5px;"><center>Documento</center></th>
        </tr>
      </thead>
  <tbody id="tbody">
  </tbody>
     </table>
  </div>
    `

    $(input).appendTo('#content');

    $("#tbody").html(
      values
        .map((data) => {

          ctx++

          var file

          if(data.url_file_resolution != ""){
             file = `<a href="${data.url_file_resolution}" target="_blank">
             <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
             </a>`
          }else{
            file = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
             No disponible
             </a>`
          }
  
          return `<tr>
          <td style="font-size:12px;"><strong><center>${ctx}</center></strong></td>
          <td style="font-size:12px;"><center>${data.title_project}</center></td>
          <td style="font-size:14px;font-weight:bold;"><center>${data.num_resolution}</center></td>
          <td style="font-size:14px;font-weight:bold;"><center>${data.type_resolution.toUpperCase()}</center></td>
          <td style="font-size:12px;"><center>
          ${file}
          </center>
          </td>
          </tr>`;
         
        })

    .join("")
);

    var other =  `<p></p>
    <button class="btn btn-outline-success" onclick="showCode()" style="font-weight:bold;margin-bottom:30px;">Volver a consultar</button> 
    </div> `
    $(other).appendTo('#content');

}

function showDataDNI(values){

  document.getElementById("loader").style = "display:none;"
  document.getElementById("content").innerHTML = ''
  document.getElementById("content").style = 'width: 90%;'
  let ctx = 0

  var input = `

  <div class="table-responsive" style="width:100%;">
     <table class="table table-hover" id="tb-students">
      <thead>
        <tr style="background-color: #c5236f;color: #f1f1f1;">
          <th scope="col" style="width: 10px;"><center>#</center></th>
          <th scope="col" style="width: 100px;"><center>Título del proyecto</center></th>
          <th scope="col" style="width: 5px;"><center>N° de resolución</center></th>
          <th scope="col" style="width: 5px;"><center>Tipo de resolución</center></th>
          <th scope="col" style="width: 5px;"><center>Documento</center></th>
        </tr>
      </thead>
  <tbody id="tbody">
  </tbody>
     </table>
  </div>
    `

    $(input).appendTo('#content');

    $("#tbody").html(
      values
        .map((data) => {

          ctx++

          var file

          if(data.url_file_resolution != ""){
            
            if(data.type_resolution != "APROVACION DE PROYECTO PARA EJECUCIÓN"){
              file = `<a href="${data.url_file_resolution}" target="_blank">
             <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
             </a>`
            }else{
              file = `<a href="${data.url_file_resolution}" target="_blank">
              <ion-icon style="color:#000;" size="large" name="document-attach-outline"></ion-icon>
              </a>`
            }
             
          }else{
            file = `<a><ion-icon style="color:red;" name="close-circle-outline"></ion-icon>
             No disponible
             </a>`
          }
  
          return `<tr>
          <td style="font-size:12px;"><strong><center>${ctx}</center></strong></td>
          <td style="font-size:12px;"><center>${data.title_project}</center></td>
          <td style="font-size:14px;font-weight:bold;"><center>${data.num_resolution}</center></td>
          <td style="font-size:14px;font-weight:bold;"><center>${data.type_resolution.toUpperCase()}</center></td>
          <td style="font-size:12px;"><center>
          ${file}
          </center>
          </td>
          </tr>`;
         
        })

    .join("")
);

    var other =  `<p></p>
    <button class="btn btn-outline-success" onclick="showCode()" style="font-weight:bold;margin-bottom:30px;">Volver a consultar</button> 
    </div> `
    $(other).appendTo('#content');

}

function searchResolution(){

  var dni = document .getElementById("dni").value
  var obj = []
  var ctx = 0

  hideDNI()

  db.collection("resolutions").get().then((query) => {
  
    query.forEach((doc) => {
      
      if(doc.data().dni_adviser == dni){

        ctx++
        var elements = {
          title_project : doc.data().title_project,
          num_resolution : doc.data().num_resolution,
          type_resolution : doc.data().type_resolution,
          url_file_resolution : doc.data().url_file_resolution
        } 
        obj.push(elements) 
      
      }

      if(doc.data().teachers != null){
        doc.data().teachers.forEach((data) =>{
          if(data.dni == dni){
            var elements = {
              title_project : doc.data().title_project,
              num_resolution : doc.data().num_resolution,
              type_resolution : doc.data().type_resolution,
              url_file_resolution : ""
            } 
            obj.push(elements) 
          }
        })
      }

    });

    if(ctx != 0 ){
     
      showDataDNI(obj)
      console.log(obj)
     
    }else{
      showDNI()
      Swal.fire(
        'Oopss!',
        'Sin resultados!',
        'warning'
      )
    }


  })
}

//function searchResoluionStd(){
  //  db.collection("constancy").where("code", "==", code).get().then((query) => {
function searchResolutionStd(fullNameStudent){
  // var code = document .getElementById("code").value
  var obj = []
  var ctx = 0

  if(fullNameStudent != ""){
    $("#SearchModalByResolution").modal("hide");
    hideCode()
    db.collection("resolutions").get().then((query) => {
    
      query.forEach((doc) => {

        if(doc.data().students != null ){

          doc.data().students.forEach((student) =>{
            if (student.fullName == fullNameStudent){
              ctx++;
              let elements = {
                title_project : doc.data().title_project,
                num_resolution : doc.data().num_resolution,
                type_resolution : doc.data().type_resolution,
                url_file_resolution : ""
              }
              obj = [...obj,elements]
            }
            console.log(student)
          })
        }

        
      });
  
      if(ctx != 0 ){
       
        showDataCodeRS(obj)
        
        console.log(obj)
       
      }else{
        showCode()
        Swal.fire(
          'Oopss!',
          'Sin resultados!',
          'warning'
        )
      }
    })
  }else{
    Swal.fire(
      'Oopss!',
      'Ingrese un código de estudiante!',
      'warning'
    )
  }

  
}


function printer(name,code,num,year,dateRegister){

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