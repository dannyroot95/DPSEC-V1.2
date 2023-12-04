let type = JSON.parse(localStorage.getItem("currentUserData"))
if(type != null){

    let typeOf = type.type_user

    if(typeOf == "super_admin"){
        let sidebar = `
                    <a href="#inicio" class="nav__link active noSub" id="iten1">
                    <ion-icon name="home-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Inicio</span>
                    </a>
                    <div class="nav__link collapse" onclick="showData(0)" id="viewUser">
                    <ion-icon name="people-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Usuarios</span>
                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(0)"></ion-icon>
                    <ul class="collapse__menu" id="collapseUsers">
                    <a href="#user/students" class="collapse__sublink" id="iten2" style="color:black">Estudiantes</a>
                    <a href="#user/teachers" class="collapse__sublink" id="iten3" style="color:black">Docentes</a>
                    <a href="#user/staff" class="collapse__sublink" id="iten4" style="color:black">Administrativo</a>
                    </ul>
                    </div>

                    <a href="#announcements" class="nav__link noSub" id="iten5">
                    <ion-icon name="megaphone-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Convocatorias</span>
                    </a>

                    <div class="nav__link collapse" onclick="showData(1)" id="viewProyects">
                    <ion-icon name="grid-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Proyectos</span>

                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(1)"></ion-icon>

                    <ul style="list-style-type:circle" class="collapse__menu" id="collapseProjects">
                    <li><a href="#projects/postulated" class="collapse__sublink" id="iten6" style="color:black">Postulados</a></li>
                    <li><a href="#projects/aproved" class="collapse__sublink" id="iten7" style="color:black">Aprobados</a></li>
                    <li><a href="#projects/observed" class="collapse__sublink" id="iten8" style="color:black">Observados</a></li>
                    <li><a href="#projects/executed" class="collapse__sublink" id="iten8" style="color:black">Ejecutados</a></li>
                    <li><a href="#projects/finished" class="collapse__sublink" id="iten9" style="color:black">Finalizados</a></li>
                    </ul>
                    </div>

                    <div class="nav__link collapse" onclick="showData(2)"  id="viewHistory">
                    <ion-icon name="documents-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Históricos</span>

                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(2)"></ion-icon>

                    <ul class="collapse__menu" id="collapseHistory">
                    <a href="#constancy" class="collapse__sublink" style="color:black">Constancias</a>
                    <a href="#resolutions" class="collapse__sublink" style="color:black">Resoluciones</a>
                    </ul>
                    </div>


                    <div class="nav__link collapse" onclick="showData(3)" id="viewDocs">
                    <ion-icon name="folder-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Documentos</span>

                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(3)"></ion-icon>

                    <ul class="collapse__menu" id="collapseDocs">
                    <a href="#doc/UNAMAD" class="collapse__sublink" id="iten12" style="color:black">UNAMAD</a>
                    <a href="#doc/DPSEC" class="collapse__sublink" id="iten13" style="color:black">DPSEC</a>
                    </ul>
                    </div>

                    <a href="#popups" class="nav__link noSub" id="itemPopup">
                    <ion-icon name="eye-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Anuncios</span>
                    </a>

                    <a href="#templates" class="nav__link noSub" id="itemTemplate">
                    <ion-icon name="book-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Plantillas</span>
                    </a>
                    
                    `
                    document.getElementById("modules").innerHTML = sidebar
    }
    else if(typeOf == "student"){
        let sidebar = `

                    <a href="#student/inicio" class="nav__link active noSub" id="iten1">
                    <ion-icon name="home-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Inicio</span>
                    </a>

                    <a href="#student/constancias" class="nav__link noSub" id="iten2">
                    <ion-icon name="document-text-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Constancias</span>
                    </a>

                    <a href="#student/proyectos" class="nav__link noSub" id="iten3">
                    <ion-icon name="folder-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Proyectos</span>
                    </a>                   
                    `

        document.getElementById("modules").innerHTML = sidebar
    }

    if(typeOf == "teacher"){
        let sidebar = `
                        <a href="#inicio" class="nav__link active noSub" id="iten1">
                        <ion-icon name="home-outline" class="nav__icon"></ion-icon>
                        <span class="nav__name">Inicio</span>
                        </a>
                        
                        <a href="#announcements" class="nav__link noSub" id="iten2">
                        <ion-icon name="megaphone-outline" class="nav__icon"></ion-icon>
                        <span class="nav__name">Convocatorias</span>
                        </a>

                        <a href="#teacher-projects" class="nav__link noSub" id="iten3">
                        <ion-icon name="cube-outline" class="nav__icon"></ion-icon>
                        <span class="nav__name">Mis proyectos</span>
                        </a>

                        <a href="#teacher-resolutions" class="nav__link noSub" id="iten4">
                        <ion-icon name="document-text-outline" class="nav__icon"></ion-icon>
                        <span class="nav__name">Resoluciones</span>
                        </a>

                        <div class="nav__link collapse" onclick="showDataForTeacher()" id="viewDocs">
                        <ion-icon name="folder-outline" class="nav__icon"></ion-icon>
                        <span class="nav__name">Documentos</span>

                        <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showDataForTeacher()"></ion-icon>

                        <ul class="collapse__menu" id="collapseDocs">
                        <a href="#doc/UNAMAD" class="collapse__sublink" id="iten11" style="color:black">UNAMAD</a>
                        <a href="#doc/DPSEC" class="collapse__sublink" id="iten12" style="color:black">DPSEC</a>
                        </ul>
                        </div>
                    
                    `
                    document.getElementById("modules").innerHTML = sidebar
    }

    else if(typeOf == "staff"){
        let sidebar = `

                    <a href="#inicio" class="nav__link active noSub" id="iten1">
                    <ion-icon name="home-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Inicio</span>
                    </a>

                    <div class="nav__link collapse" onclick="showData(0)" id="viewUser">
                    <ion-icon name="people-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Usuarios</span>
                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(0)"></ion-icon>
                    <ul class="collapse__menu" id="collapseUsers">
                    <a href="#user/students" class="collapse__sublink" style="color:black">Estudiantes</a>
                    </ul>
                    </div>

                    <a href="#announcements" class="nav__link noSub" id="iten5">
                    <ion-icon name="megaphone-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Convocatorias</span>
                    </a>

                    <div class="nav__link collapse" onclick="showData(1)" id="viewProyects">
                    <ion-icon name="people-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Proyectos</span>

                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(1)"></ion-icon>

                    <ul style="list-style-type:circle" class="collapse__menu" id="collapseProjects">
                    <li><a href="#projects/postulated" class="collapse__sublink" id="iten6" style="color:black">Postulados</a></li>
                    <li><a href="#projects/aproved" class="collapse__sublink" id="iten7" style="color:black">Aprobados</a></li>
                    <li><a href="#projects/observed" class="collapse__sublink" id="iten8" style="color:black">Observados</a></li>
                    <li><a href="#projects/executed" class="collapse__sublink" id="iten8" style="color:black">Ejecutados</a></li>
                    <li><a href="#projects/finished" class="collapse__sublink" id="iten9" style="color:black">Finalizados</a></li>
                    </ul>
                    </div>

                    <div class="nav__link collapse" onclick="showData(2)"  id="viewHistory">
                    <ion-icon name="documents-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Históricos</span>

                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(2)"></ion-icon>

                    <ul class="collapse__menu" id="collapseHistory">
                    <a href="#constancy" class="collapse__sublink" style="color:black">Constancias</a>
                    <a href="#resolutions" class="collapse__sublink" style="color:black">Resoluciones</a>
                    </ul>
                    </div>


                    <div class="nav__link collapse" onclick="showData(3)" id="viewDocs">
                    <ion-icon name="folder-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Documentos</span>

                    <ion-icon name="chevron-down-outline" class="collapse__link" onclick="showData(3)"></ion-icon>

                    <ul class="collapse__menu" id="collapseDocs">
                    <a href="#doc/UNAMAD" class="collapse__sublink" style="color:white">UNAMAD</a>
                    <a href="#doc/DPSEC" class="collapse__sublink" style="color:white">DPSEC</a>
                    </ul>
                    </div>

                    <a href="#popups" class="nav__link noSub" id="itemPopup">
                    <ion-icon name="eye-outline" class="nav__icon"></ion-icon>
                    <span class="nav__name">Anuncios</span>
                    </a>

                    
                    `
        document.getElementById("modules").innerHTML = sidebar
    }

}