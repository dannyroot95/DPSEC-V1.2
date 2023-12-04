
function getStatus(array){
  
    if(array.length == 9){
  
    var data = String.fromCharCode(array[0],array[1],array[2],array[3],array[4],array[5],array[6],
            array[7],array[8])
    
     var jsonStatus = {
                status : data,
                index : 0  
        }
  
        return jsonStatus.index 
    
    }
    
}
    