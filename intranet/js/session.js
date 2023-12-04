var session = localStorage.getItem("currentUser")
console.log(session)
if(session != "" && session != null){
    window.location.href = "/intranet/dashboard"
}