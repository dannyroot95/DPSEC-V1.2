

$('#registerModal').on('show.bs.modal', function (e) {
    $('body').addClass("example-open");
}).on('hide.bs.modal', function (e) {
  $('body').addClass("example-open");
  clearInputsOnHide()
})

$('#detailModal').on('show.bs.modal', function (e) {
  $('body').addClass("example-open");
}).on('hide.bs.modal', function (e) {
$('body').addClass("example-open");
})

$('#articleModal').on('show.bs.modal', function (e) {
  $('body').addClass("example-open");
}).on('hide.bs.modal', function (e) {
$('body').addClass("example-open");
})

$('#rulesModal').on('show.bs.modal', function (e) {
  $('body').addClass("example-open");
}).on('hide.bs.modal', function (e) {
$('body').addClass("example-open");
})


function clearInputsOnHide(){
    document.getElementById("file").value = ""
}




