
getPopups()


function getPopups(){
    db.collection("popups").get().then(snapshot =>{

        var ctx = 0

        snapshot.forEach(data => {
            
            ctx++
            var id = 'modal-'+ctx
            var title 
            var text 
            var img
            if(data.data().title != ""){
                title = `<h2>${data.data().title}</h2>`
            }else{
                title = ""
            }
            if(data.data().text != ""){
                text = `<textarea class="form-control" id="i-text" disabled>${data.data().text}</textarea>`
            }else{
                text = ""
            }
            if(data.data().url_image != ""){
                img = `<img src="${data.data().url_image}" width="100%">`
            }else{
                img = ""
            }

            var popup = `
                <div class="modal micromodal-slide" id="${id}" aria-hidden="true">
                <div class="modal__overlay" tabindex="${ctx}" data-micromodal-close>
                <div class="modal__container" role="dialog" aria-modal="true">
                    <header class="modal__header">
                    `+title+`
                    <button class="modal__close" aria-label="Close modal" onclick="closeModal('${id}')"></button>
                    </header>
                    <main class="modal__content" id="modal-2-content">
                    `+img+`
                    `+text+`
                    </main>
                </div>
                </div>
                </div>
                `
                $(popup).appendTo('#content-banner')
                //document.getElementById("content-banner").innerHTML= popup
                MicroModal.show(id)
  
        });

    })
}

function closeModal(id){
    MicroModal.close(id)
}