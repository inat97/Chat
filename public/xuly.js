var socket = io("http://localhost:3000");
//var socket = io("https://tangau.herokuapp.com");
socket.on("Server-send-dk-thatbai",function(){
      alert(" Đã có người đăng ký");
});
socket.on("Server-send-dk-thanhcong",function(data){
      $("#currenUser").html(data);
      $("#loginForm").hide(2000);
      $("#chatForm").show(1000);
});

socket.on("Server-send-message",function(data){
    $("#listMessager").prepend("<div class='ms'>" + data.un + ": " + data.nd + "</div>")
});

socket.on("ai-do-dang-go",function(data){
  $("#thongbao").html("<img width = '23px' src = 'typing05.gif'>" + "" + data);
});
socket.on("ai-do-stop-go",function(){
  $("#thongbao").html("");
});

socket.on("Server-send-ds-User",function(data){
      $("#boxContent").html("");
      data.forEach(function(i){
        $("#boxContent").append("<div class='user'>" + i +"</div>");

      });
});

$(document).ready(function(){
  $("#loginForm").show();
  $("#chatForm").hide();
  $("#btnRegister").click(function(){
      socket.emit("Client-send-userName",$(".txtUserName").val())
  });

  $("#btnLogout").click(function(){
        socket.emit("logout");
        $("#chatForm").hide(2000);
        $("#loginForm").show(1000);
  });
var n ;
  $("#btnSendMessage").click(function(){
     n = $('#txtMessage').val().trim();
    if(n <= 0)
      return;
    else {
      socket.emit("User-send-message",$("#txtMessage").val());
        $("#txtMessage").val('');
    }
  });

  $("#txtMessage").keypress(function(event ) {
    n = $('#txtMessage').val().trim();
    if(event.keyCode == 13 || event.which == 13)
    {
      if(n <= 0)
        return;
      else {
        socket.emit("User-send-message",$("#txtMessage").val());
          $("#txtMessage").val('');
      }
    }
  });


  $("#txtMessage").focusin(function(){
    socket.emit("toi-dang-go");
  })
  $("#txtMessage").focusout(function(){
    socket.emit("toi-stop-go");
  })

});
