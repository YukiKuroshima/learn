$( document ).ready(function() {
  console.log("Making ajax call");

  $.ajax({
    method: "GET",
    url: "/hello",
  })
  /*
   * Excecuted when success
   */
    .done(function (data) {
      console.log("Json from API server " + data.message);
      $("h2#hello-message-place-holder").html(data.message);
    })
  /*
   * Excecuted when unsuccessful
   */
    .fail(function (jqXHR) {
      // Invoke error pop-up
      console.log(jqXHR.responseJSON);
    })
});
