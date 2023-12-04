function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum;
 }
   

 function onlyDateNumber(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();

    if(date <=9){
      date = "0"+date
    }
  var time = date + '/' + month + '/' + year;
  return time;
}

function onlyDateNumberString(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();

    if(date <=9){
      date = "0"+date
    }
  var time = date + '/' + month + '/' + year;
  return time;
}

function onlyDateNumberRange(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();

    if(date <=9){
      date = "0"+date
    }
  var time = year + '/' + month + '/' + date;
  return time;
}

function onlyHour(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();

  var stringhour = hour
  var stringmin = min
  var stringseg = sec

  if(hour <=9){
    stringhour = "0"+hour
 }
  if(min <=9){
     stringmin = "0"+min
  }
  if(sec <=9){
    stringseg = "0"+sec
  }

  var time = stringhour + ':' + stringmin ;

  return time;
}

function getSemester(){

  var year = new Date().getFullYear()
  var month = new Date().getMonth() + 1
  var val = ""

  if(month >= 8){
    val = year+"-II"
  }else{
    val = year+"-I"
  }

  return val

}

