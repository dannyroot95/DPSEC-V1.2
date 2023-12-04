
getConstancyTemplate()

function getConstancyTemplate(){
    db.collection("templates").get().then(snapshot =>{

        let ctx = 0
        
        values = snapshot.docs.map((doc) => ({
                ...doc.data(),id: doc.id
          }));

          console.log(values)

    
          if(values.length > 0){

            values
                  .map((data) => {

                    document.getElementById("year-pe").value = data.year
                    document.getElementById("text1").value = data.text1
                    document.getElementById("text2").value = data.text2
                    document.getElementById("text3").value = data.text3

                    document.getElementById("year-pe").disabled = false
                    document.getElementById("text1").disabled = false
                    document.getElementById("text2").disabled = false
                    document.getElementById("text3").disabled = false
                    document.getElementById("btn-save-template").disabled = false

                  })

          }else{
            document.getElementById("btn-save-template").disabled = false
            document.getElementById("year-pe").disabled = false
            document.getElementById("text1").disabled = false
            document.getElementById("text2").disabled = false
            document.getElementById("text3").disabled = false
          }

    })
}

function saveTemplate(){

    let year = document.getElementById("year-pe").value
    let text1 = document.getElementById("text1").value
    let text2 = document.getElementById("text2").value
    let text3 = document.getElementById("text3").value

    if(year != "" && text1 != "" && text2 != "" && text3 != ""){

        let value = {
            year  :  year,
            text1 : text1,
            text2 : text2,
            text3 : text3
        }

        db.collection("templates").doc("constancy").set(value)
        Swal.fire(
            'Muy bien!',
            'Plantilla guardada!',
            'info'
          )

    }else{
        Swal.fire(
            'Hey!',
            'Complete los campos!',
            'info'
          )
    }

}