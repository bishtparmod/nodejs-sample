var validate = require('../Common/common')
var Response = require('../Common/response')
var Chat = require('../Modal/chat')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
var server = require('../app')
const io = require('socket.io')(server);
var { SUCCESS, ERROR, VALIDATE_ERROR, NOT_VALID, NOVALUE, ERROR } = require('../Common/constant')


var chatModule = (req,res,next) =>{
    if(req.body.message === ""){
        var reqBody = {
            senderId:req.body.senderId,
            receiverId:req.body.receiverId,
            isphoto:req.body.isphoto,
            url:req.body.url
        }
    }else{
        var reqBody = {
            senderId:req.body.senderId,
            receiverId:req.body.receiverId,
            message:req.body.message,
            isphoto:req.body.isphoto
        }
    }
    validate.validation(Object.keys(reqBody), reqBody)
    .then(({ status, response }) => {
        if (status) {
            const chat = new Chat(reqBody);
           io.on('connection',socket=>{
               socket.emit('chat-message',"hello")
           })
        } else {
            Response.httpResponse(req, res, VALIDATE_ERROR, response)
        }
    }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
    
}

  


module.exports = {
    chatModule
}