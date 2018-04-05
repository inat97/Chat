var express = require("express");
// var mongoose = require("mongoose");
var mysql = require('mysql');
var app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
// View engine setup
app.engine('handlebars', exphbs());
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// // Static folder
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.post('/send', (req, res) => {
  const output = `
    <h3>Thông tin chi tiết</h3>
    <ul>
      <li>Tên: ${req.body.name}</li>
      <li>Nghề nghiệp: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Số điện thoại: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'tuanomc97@gmail.com', // generated ethereal user
        pass: 'kscntt1234'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nguyen Anh Tuan" <tuanomc97@gmail.com>', // sender address
      to: 'tuanomc97@gmail.com', // list of receivers
      subject: 'Ý kiến phản hồi', // Subject line
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error){
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('thanks', {msg:'Email đã được gửi. Cảm ơn bạn đã đóng góp'});
    });
  });


// // DataBase
//   mongoose.connect('mongodb://localhost/myDataBase',{ useMongoClient: true })
//   var userSchema = new mongoose.Schema({
//     TaiKhoan: String,
//     //MatKhau: String
//   })
//   var user = mongoose.model('Account', userSchema)


// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: ""
// });
// 
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });


var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUser =[];


io.on("connection",function(socket){
  console.log("co nguoi ket noi" + socket.id);
  socket.on("Client-send-userName",function(data){
    if(mangUser.indexOf(data) >= 0){
      //That bai
      socket.emit("Server-send-dk-thatbai")
    }
    else {
      //Thanh cong
      mangUser.push(data);
      socket.Username = data;
      socket.emit("Server-send-dk-thanhcong",data);
      io.sockets.emit("Server-send-ds-User",mangUser)
    }
  });
  socket.on("logout",function(){
      mangUser.splice(
        mangUser.indexOf(socket.Username),1
      );
        socket.broadcast.emit("Server-send-ds-User",mangUser);
  });
  socket.on("disconnect",function(){
      mangUser.splice(
        mangUser.indexOf(socket.Username),1
      );
        socket.broadcast.emit("Server-send-ds-User",mangUser);
  });

  socket.on("User-send-message", function(data){
    io.sockets.emit("Server-send-message",{un:socket.Username, nd:data});
  });

  socket.on("toi-dang-go",function(){
    var s = socket.Username;
    socket.broadcast.emit("ai-do-dang-go",s)
  });
  socket.on("toi-stop-go",function(){
    socket.broadcast.emit("ai-do-stop-go")
  });
});

app.get("/", function(req,res){
  res.render("trangchu");
});
app.get("/send", function(req,res){
  res.sendFile(__dirname + "/tuan.html");
});
