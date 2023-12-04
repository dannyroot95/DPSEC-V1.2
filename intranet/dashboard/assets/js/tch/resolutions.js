let cache = localStorage.getItem("resolutions")
let user = JSON.parse(localStorage.getItem("currentUserData"))
let pCache = JSON.parse(cache)
var modalityJson
var carrersJson

allFetch()


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

                if(user.dni == data.dni_adviser){
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
                }
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