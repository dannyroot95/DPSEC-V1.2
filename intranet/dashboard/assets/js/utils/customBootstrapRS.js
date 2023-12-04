$('#createConstancyModal').on('show.bs.modal', function (e) {
    $('body').addClass("example-open");
  }).on('hide.bs.modal', function (e) {
  $('body').addClass("example-open");
  showElementsOnUpload()
  document.getElementById("div-rs-final").style = "display:none;"
  })
  
  $('#typeResolutionModal').on('show.bs.modal', function (e) {
    $('body').addClass("example-open");
  }).on('hide.bs.modal', function (e) {
  $('body').addClass("example-open");
  })
  
  $('#detailTypeResolution').on('hide.bs.modal', function (e) {
    $('#typeResolutionModal').modal('show')
  })


  function showModalCreate(){
    $('#typeResolutionModal').modal('hide')

    document.getElementById("titleTypeResolution").innerHTML = "Crear nuevo tipo de resolucion"
    document.getElementById("type-resolution").value = ""
    document.getElementById("btn-options").innerHTML = `
    <button type="button" class="btn btn-primary"
     style="background-color: #c5236f;border-color: #c5236f;" onclick="createTypeResolution()">Crear</button>
     `

    $('#detailTypeResolution').modal('show')
  }

  function detailsType(id,title){
    $('#typeResolutionModal').modal('hide')

    document.getElementById("titleTypeResolution").innerHTML = "Detalle de tipo de resolucion"
    document.getElementById("type-resolution").value = title
    document.getElementById("btn-options").innerHTML = `
    <button type="button" class="btn btn-primary"
     style="background-color: #D4AC0D;border-color: #D4AC0D;" onclick="editTypeResolution('${id}')">Editar</button>

     <button type="button" class="btn btn-primary"
     style="background-color: #FC0000;border-color: #FC0000;" onclick="deleteTypeResolution('${id}')">Eliminar</button>

     `

    $('#detailTypeResolution').modal('show')
  }

  