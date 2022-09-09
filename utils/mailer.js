const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporterDetails = smtpTransport({
    host: "",
    port: 465,
    secure: true,
    auth: {
        user: "",
        pass: "",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const transporter = nodemailer.createTransport(transporterDetails);

const options = {
    from: "",
    to: "",
    subject: "",
    text: "",
};

transporter.sendMail(options,(err,info) => {
    if(err) return console.log(err);
    console.log(info);
});