const crypto = require('crypto');
const nodemailer = require("nodemailer");
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var moment = require('moment')
var md5 = require('md5')
var tokenKey = "qwertyiop"

/**
 * header Authorization token
 */

var getAuthoriztionToken = () => {
    return md5(`${tokenKey}${md5(moment(new Date()).format('DD-MM-YYYY'))}`);
}

/**
 * random password function
 */
var ramdomPassword = function(random){
    return {ramdomPassword:random, encrypted : encryption(random.toString()) 
    }} 

/**
 * Encrytion function
 */
var encryption = function(text) {
    const hash = crypto.createHmac('sha256', text)
    .update('I love cupcakes')
    .digest('hex');
    return hash
   }

/**
 * sample response while operation has done
 * @param {*request} req 
 * @param {*response} res 
 * @param {*string} status 
 * @param {*array|object} response 
 */

var httpResponse = function (req, res, status, response) {
    switch (status) {
        case 'success':
            res.status(200)
                .json({
                    status: 200,
                    code: 1,
                    data: response,
                    message: "Success",
                    emptyKeys: null,
                    error: false
                })
            break;
        case 'err':
            res.status(501)
                .json({
                    status: 501,
                    code: 1,
                    data: response,
                    message: "Error",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'notValid':
            res.status(401)
                .json({
                    code: 1,
                    status: 401,
                    data: response,
                    message: "NotValid",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'emailPresent':
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "emailPresent",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'phonePresent':
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "phonePresent",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'noValue':
            res.status(404)
                .json({
                    code: 1,
                    status: 404,
                    data: response,
                    message: "NoValue",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'notAuthorized':
            res.status(401)
                .json({
                    code: 1,
                    status: 401,
                    data: response,
                    message: "Not Authorized",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'objEmpty':
            res.status(400)
                .json({
                    code: 1,
                    status: 400,
                    data: [],
                    message: "ObjEmpty",
                    emptyKeys: null,
                    error: true
                })
            break;
        case 'badRequest':
            res.status(400)
                .json({
                    code: 1,
                    status: 400,
                    data: response,
                    message: "Bad REQUEST",
                    emptyKeys: null,
                    error: true
                })
            break;
        case "validationErr":
            res.status(422)
                .json({
                    code: 1,
                    status: 422,
                    data: [],
                    message: "ValidationError",
                    emptyKeys: response,
                    error: true
                })
            break;
        case "verificationErr":
            res.status(304)
                .json({
                    code: 1,
                    status: 304,
                    data: [],
                    message: "VarificationError",
                    emptyKeys: response,
                    error: true
                })
            break;
        case "emailPresent":
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "EmailPresent",
                    emptyKeys: [],
                    error: true
                })
            break;
        case "forbidden":
            res.status(409)
                .json({
                    code: 1,
                    status: 409,
                    data: response,
                    message: "FORBIDDEN",
                    emptyKeys: [],
                    error: true
                })
            break;
        case "logedIn":
            res.status(200)
                .json({
                    code: 1,
                    status: 200,
                    data: response,
                    message: "LogedIn",
                    emptyKeys: [],
                    error: false
                })
            break;
        case "logedOut":
            res.status(200)
                .json({
                    code: 1,
                    status: 200,
                    data: response,
                    message: "LogedOut",
                    emptyKeys: [],
                    error: false
                })
            break;
        default:
            res.status(500)
                .json({
                    code: 1,
                    status: 500,
                    data: [],
                    message: "InternalServerError",
                    emptyKeys: null,
                    error: true
                })
    }
}

/**
 * Email send function
 */

var mail = function(email,password,cb) {
    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: "abtested41@gmail.com",// generated ethereal user
          pass: "welcome2erginous" // generated ethereal password
        }
      });
      const mailOptions = {
        from: "abtested41@gmail.com", // sender address
        to: email, // list of receivers
        subject: 'Forgot Password', // Subject line
        html: '<p>Your Password </p> '+password// plain text body
      };
      // send mail with defined transport object
   
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          cb(false,err)
        else
        cb(true,info)
     });
  
};


module.exports = {
    httpResponse,
    encryption,
    getAuthoriztionToken,
    mail,
    ramdomPassword
}