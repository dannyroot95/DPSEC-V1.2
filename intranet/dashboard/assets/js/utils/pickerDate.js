$('#announcementModal').on('show.bs.modal', function (e) {
    $('body').addClass("example-open");
  }).on('hide.bs.modal', function (e) {
  $('body').addClass("example-open");
    clearInputsOnHideA()
  })
  

const picker = new easepick.create({
    element: document.getElementById('date-start-and-end'),
      css: ['https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css',
            '/intranet/dashboard/assets/css/picker1.css',
          ],
             plugins: ['RangePlugin'],
             zIndex: 10,
             position:top,
             lang: "es-ES",
             format: "DD/MM/YYYY",
             setup(picker) {
                   picker.on('select', (e) => {
                   let startDate =  picker.getStartDate('YYYY-MM-DD');
                   let endDate =  picker.getEndDate('YYYY-MM-DD');
                   document.getElementById("date-start-and-end").value = onlyDateNumberRange(startDate)+" - "+onlyDateNumberRange(endDate)
                   //showCustomRoutes(toTimestamp(startDate)/1000,toTimestamp(endDate)/1000)
              })}
          });

          const picker2 = new easepick.create({
            element: document.getElementById('obs-date-start-and-end'),
              css: ['https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css',
                    '/intranet/dashboard/assets/css/picker2.css',
                  ],
                     plugins: ['RangePlugin'],
                     zIndex: 10,
                     position:top,
                     lang: "es-ES",
                     format: "DD/MM/YYYY",
                     setup(picker) {
                           picker.on('select', (e) => {
                           let startDate =  picker.getStartDate('YYYY-MM-DD');
                           let endDate =  picker.getEndDate('YYYY-MM-DD');
                           document.getElementById("obs-date-start-and-end").value = onlyDateNumberRange(startDate)+" - "+onlyDateNumberRange(endDate)
                           //showCustomRoutes(toTimestamp(startDate)/1000,toTimestamp(endDate)/1000)
                      })}
                  });

                  const picker3 = new easepick.create({
                    element: document.getElementById('inf-date-start-and-end'),
                      css: ['https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css',
                            '/intranet/dashboard/assets/css/picker3.css',
                          ],
                             plugins: ['RangePlugin'],
                             zIndex: 10,
                             position:top,
                             lang: "es-ES",
                             format: "DD/MM/YYYY",
                             setup(picker) {
                                   picker.on('select', (e) => {
                                   let startDate =  picker.getStartDate('YYYY-MM-DD');
                                   let endDate =  picker.getEndDate('YYYY-MM-DD');
                                   document.getElementById("inf-date-start-and-end").value = onlyDateNumberRange(startDate)+" - "+onlyDateNumberRange(endDate)
                                   //showCustomRoutes(toTimestamp(startDate)/1000,toTimestamp(endDate)/1000)
                              })}
                          });


          function clearInputsOnHideA(){
            document.getElementById("date-start-and-end").value = ""
            document.getElementById("obs-date-start-and-end").value = ""
            document.getElementById("inf-date-start-and-end").value = ""
            var progress = document.getElementsByClassName('progress')[0];
            var percent = document.getElementsByClassName('percent')[0];
            progress.style.width = '0%';
            percent.innerHTML = '0%';
            document.getElementById("upload-area").style = "display:none;"
            document.getElementById("file").value = ""
            document.getElementById("file").style = "display:block;"
            document.getElementById("file2").value = ""
            document.getElementById("file2").style = "display:block;"
            document.getElementById("btn-close-modal").disabled = false
            document.getElementById("btn-close").style = "display:block;"
            document.getElementById("btn-create").disabled = false
          }