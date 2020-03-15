var validate = require('../Common/common')
var httpResponse = require('../Common/response')
var User = require('../Modal/user')
var jwt = require('jsonwebtoken')
var { SUCCESS, ERROR, VALIDATE_ERROR, NOT_VALID, NOVALUE, ERROR} = require('../Common/constant')

/* Signup Api */
var signup = (req, res) => {
    const reqBody = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                const user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: httpResponse.encryption(req.body.password),
                    confirm_password: httpResponse.encryption(req.body.confirm_password),
                });
                User.find({email:req.body.email}).then((data)=>{
                    if(data && data.length === 0){
                        user.save()
                        .then(data => {
                            httpResponse.httpResponse(req,res,SUCCESS,data)
                        }).catch(err => {
                            httpResponse.httpResponse(req,res,ERROR,err)
                        }); 
                    }else{
                        httpResponse.httpResponse(req,res,NOVALUE,{message :"Email already present"})
                    }
                }).catch((err)=>  httpResponse.httpResponse(req,res,ERROR,err))
                
            } else {
                httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
            }
        }).catch(err => httpResponse.httpResponse(req,res,VALIDATE_ERROR,err));
}

/* Login Api */
var login = (req, res) => {
    const reqBody = {
        email: req.body.email,
        password: req.body.password,
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                const body ={
                    email: req.body.email,
                    password:httpResponse.encryption(req.body.password) 
                }
                User.find(body).then((data) => {
                    if(data && data.length === 0){
                        httpResponse.httpResponse(req,res,NOVALUE,{message:"Email or password either wrong"})
                    }else{
                        jwt.sign({ id: data[0]._id }, 'shhhhh',{expiresIn:60},(err,token)=>{
                            if(err){
                                httpResponse.httpResponse(req,res,VALIDATE_ERROR,err)
                            }else{
                                httpResponse.httpResponse(req,res,SUCCESS,{...data[0]._doc,usertoken:token})
                            }
                        })
                    }
                    
                    // httpResponse.httpResponse(req,res,SUCCESS,data[0])
                }).catch((err) => {
                    httpResponse.httpResponse(req,res,VALIDATE_ERROR,err)
                })
            } else {
                httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
            }
        }).catch(err => httpResponse.httpResponse(req,res,VALIDATE_ERROR,err));
}

/* SessionLogin Api */
var sessionlogin = (req, res) => {
    const reqBody = {
        usertoken:req.body.usertoken
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                jwt.verify(reqBody.usertoken, 'shhhhh', function(err, decoded) {
                    if(err){
                        httpResponse.httpResponse(req,res,NOT_VALID,{message:"User Token expire"}) 
                    }else{
                        User.find({_id:decoded.id}).then((data) => {
                            jwt.sign({ id: data[0]._id }, 'shhhhh',{expiresIn:60},(err,token)=>{
                                if(err){
                                    httpResponse.httpResponse(req,res,VALIDATE_ERROR,err)
                                }else{
                                    httpResponse.httpResponse(req,res,SUCCESS,{...data[0]._doc,usertoken:token})
                                }
                            })
                        }).catch((err) => {
                            httpResponse.httpResponse(req,res,VALIDATE_ERROR,err)
                        })
                    }
                  });
            } else {
                httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
            }
        }).catch(err => {
            httpResponse.httpResponse(req,res,VALIDATE_ERROR,err)
        });
}

/* Resetpassword Api */
var resetPassword = (req, res) => {
    const reqBody = {
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
               User.find({email:req.body.email}).then((data)=>{
                    if(data && data.length){
                        const user = {
                            password:httpResponse.encryption(req.body.password),
                            confirm_password:httpResponse.encryption(req.body.confirm_password)
                        }
                        User.updateOne({_id:data[0]._id},{$set:user},function(err,data){
                            if(err){
                             httpResponse.httpResponse(req,res,VALIDATE_ERROR,err)
                            }else{
                             httpResponse.httpResponse(req,res,SUCCESS,{message :"Password reset successfully"})  
                            }
                        })
                    }else{
                        httpResponse.httpResponse(req,res,NOVALUE,{message :"User Not Present"})
                    }
               }).catch((err)=>httpResponse.httpResponse(req,res,ERROR,err))
            } else {
                httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
            }
        }).catch(err => httpResponse.httpResponse(req,res,VALIDATE_ERROR,err));
}

/* ForgotPassword Api */
var forgotPassword = (req, res) => {
    const reqBody = {
        email: req.body.email
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
              User.find({email:reqBody.email}).then((data)=>{
                if(data && data.length){
                    const chnagedPassword = httpResponse.ramdomPassword(parseInt(Math.random()*1000000))
                    User.updateOne({_id:data[0]._id},{$set:{password:chnagedPassword.encrypted,confirm_password:chnagedPassword.encrypted}},function(err,data){
                        if(err){
                            httpResponse.httpResponse(req,res,NOVALUE,data)
                        }else{
                            httpResponse.mail(reqBody.email,chnagedPassword.ramdomPassword,(status,data)=>{
                                if(status){
                                    httpResponse.httpResponse(req,res,SUCCESS,{message : "Password send your email"})
                                }else{
                                    httpResponse.httpResponse(req,res,NOVALUE,data)
                                }
                            })
                        }
                    })
                    
                }else{
                    httpResponse.httpResponse(req,res,NOVALUE,{message:"Email not present"})
                }
              }).catch((err)=>httpResponse.httpResponse(req,res,ERROR,err))
            } else {
                httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
            }
        }).catch(err => httpResponse.httpResponse(req,res,VALIDATE_ERROR,err));
}

/* Updateuser Api */
var updateUser = (req, res) => {
    const reqBody = {
        id:req.body.id,
        username: req.body.username,
        email: req.body.email,
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                const user = {
                    username: req.body.username,
                    email: req.body.email,
                }
                User.find({email:req.body.email}).then((data)=>{
                    if(data && data.length === 0){
                        User.updateOne({_id:req.body.id},{$set:user},function(err,update){
                            if(err){
                                httpResponse.httpResponse(req,res,NOVALUE,err) 
                            }else{
                                httpResponse.httpResponse(req,res,SUCCESS,{message :"User update successfully"})
                            }
                        })
                    }else{
                        httpResponse.httpResponse(req,res,NOVALUE,{message :"Email already present"})
                    }
                }).catch((err)=>  httpResponse.httpResponse(req,res,ERROR,err))
                
            } else {
                httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
            }
        }).catch(err => httpResponse.httpResponse(req,res,VALIDATE_ERROR,err));
}

module.exports = {
    signup,
    login,
    sessionlogin,
    resetPassword,
    forgotPassword,
    updateUser
}