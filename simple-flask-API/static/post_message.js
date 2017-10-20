$("button#mybutton").click(function() {
  console.log("Making POST HTTPrequest");

  // Get input from user
  var userInput = $("input#myinput").val();
  

  $.ajax({
    method: "POST",
    url: "/message",
    data: JSON.stringify({message: userInput}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
  /*
   * Excecuted when success
   */
    .done(function (data) {
      console.log("Json from API server " + data.message);
      $("h3#message-place-holder").html(data.message);
    })
  /*
   * Excecuted when unsuccessful
   */
    .fail(function (jqXHR) {
      // Invoke error pop-up
      console.log(jqXHR.responseJSON);
    })
});
