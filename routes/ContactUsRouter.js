const express = require('express');
const router = express('Router');
const nodemailer = require('nodemailer');

router.use(express.json());

router.post('/', function (req, res) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'unescobackend@gmail.com',
            pass: 'backend@6789',
        }
    });
    
    let mailOptions = {
        from: req.body.username + "<"+ req.body.email+">",
        to: ' egnatCom <unescobackend@gmail.com>', 
        subject: 'Unesco Test', // Subject line,
        replyTo: req.body.email,
        html: '<b> Hi egnatcom Team, </b>' + '<br>' + '<p>' +req.body.text + ' </p>' +'<br>' + '<div> Thanks. </div>' // html body
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.statusCode = 500;
            res.send("Server Error");
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.send('mail has been sent successfully');
    });
});

module.exports = router;