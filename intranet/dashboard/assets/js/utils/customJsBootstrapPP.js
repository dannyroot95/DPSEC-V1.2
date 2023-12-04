

$('#postulateProjectModal').on('show.bs.modal', function (e) {
    $('body').addClass("example-open")
    document.getElementById("div-acctions").style = "display:flex;"
}).on('hide.bs.modal', function (e) {
  $('body').addClass("example-open")
  clearInputs()
  clearObservedData()
  localStorage.removeItem("currentArrayObserved")
})

$('#observedProjectModal').on('show.bs.modal', function (e) {
  $('body').addClass("example-open")
  createButtonOK()
}).on('hide.bs.modal', function (e) {
$('body').addClass("example-open")
})

function clearInputs(){
  document.getElementById('inputGroupSelectAcction').selectedIndex = 0
  document.getElementById("content-acction").innerHTML = ""
  document.getElementById("btn-footer").innerHTML = ""
}

function createButtonOK(){

}

function closeModalObserved(data){

  var chkItems = document.getElementsByClassName("observedChk")
  var chkInputs = document.getElementsByClassName("mytext")
  var labels = document.getElementsByClassName("container2")

  let ctx = 0
  let arrayObserved = []

  for(i=0;i<chkItems.length;i++){
    if(chkItems[i].checked == true){
      if(chkInputs[i].value == ""){
        ctx++
      }else{
        let value = {
          tag : labels[i].innerText,
          description : chkInputs[i].value
        }
        arrayObserved.push(value)
      }
    }
  }

  if(ctx > 0){
    alert("Complete los campos")
  }else{
    localStorage.setItem("currentArrayObserved",JSON.stringify(arrayObserved))
    $('#observedProjectModal').modal('hide')
    document.getElementById("btn-footer").innerHTML = `<button onclick="saveObservedData('${encodeURIComponent(JSON.stringify(data))}')" type="button" class="btn btn-danger">Observar Proyecto</button>`
    document.getElementById('btn-observe').scrollIntoView()

  }

}

function clearObservedData(){

  var chkItems = document.getElementsByClassName("observedChk")
  var chkInputs = document.getElementsByClassName("description")
  var chkValue = document.getElementsByClassName("mytext")

  for(i=0;i<chkItems.length;i++){
     chkItems[i].checked = false
     chkValue[i].value = ""
     chkInputs[i].style = "display:none;"
  }

}

/*
var checkbox = document.querySelector("input[name=checkbox]")
var chkInputs = document.getElementsByClassName("description")
var chkItems = document.getElementsByClassName("observedChk")

checkbox.addEventListener('change', function() {
  if (this.checked) {
    console.log("XD1")
    for(i=0;i<chkItems.length;i++){
      if(chkItems[i].checked){
        console.log(chkItems[i].checked)
        chkInputs[i].style = "display:flex;"
      }
    }
  } else {
    console.log("XD2")
    for(i=0;i<chkItems.length;i++){
      if(chkItems[i].checked == false){
        console.log(chkItems[i].checked)
        chkInputs[i].style = "display:none;"
      }
    }
  }
});
*/

var chkInputs = document.getElementsByClassName("description")
var chkItems = document.getElementsByClassName("observedChk")

$('input[name=checkbox]').change(function() {
  if ($(this).is(':checked')) {
    for(i=0;i<chkItems.length;i++){
      if(chkItems[i].checked){
        chkInputs[i].style = "display:flex;"
      }
    }
  } else {
    for(i=0;i<chkItems.length;i++){
      if(chkItems[i].checked == false){
        chkInputs[i].style = "display:none;"
      }
    }
  }
});

