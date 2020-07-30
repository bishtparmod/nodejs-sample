var validate = require('../Common/common')
var Response = require('../Common/response')
var User = require('../Modal/user')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
var { SUCCESS, ERROR, VALIDATE_ERROR, NOT_VALID, NOVALUE, ERROR } = require('../Common/constant')

/* Signup Api */
var signup = (req, res) => {
    const reqBody = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        inventory_id: req.body.inventory_id
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                const user = new User({
                    _id: new mongoose.Types.ObjectId,
                    username: req.body.username,
                    email: req.body.email,
                    password: Response.encryption(req.body.password),
                    confirm_password: Response.encryption(req.body.confirm_password),
                    inventory_id: new mongoose.Types.ObjectId(req.body.inventory_id)
                });
                User.find({ email: req.body.email }).then((data) => {
                    if (data && data.length === 0) {
                        user.save()
                            .then(data => {
                                Response.httpResponse(req, res, SUCCESS, data)
                            }).catch(err => {
                                Response.httpResponse(req, res, ERROR, err)
                            });
                    } else {
                        Response.httpResponse(req, res, NOVALUE, { message: "Email already present" })
                    }
                }).catch((err) => Response.httpResponse(req, res, ERROR, err))

            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
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
                const body = {
                    email: req.body.email,
                    password: Response.encryption(req.body.password)
                }
                User.find(body).then((data) => {
                    if (data && data.length === 0) {
                        Response.httpResponse(req, res, NOVALUE, { message: "Email or password either wrong" })
                    } else {
                        jwt.sign({ id: data[0]._id }, 'shhhhh', { expiresIn: 24 * 60 * 60 }, (err, token) => {
                            if (err) {
                                Response.httpResponse(req, res, VALIDATE_ERROR, err)
                            } else {
                                Response.httpResponse(req, res, SUCCESS, { ...data[0]._doc, usertoken: token })
                            }
                        })
                    }
                }).catch((err) => {
                    Response.httpResponse(req, res, VALIDATE_ERROR, err)
                })
            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
}

/* SessionLogin Api */
var sessionlogin = (req, res) => {
    const reqBody = {
        usertoken: req.body.usertoken
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                jwt.verify(reqBody.usertoken, 'shhhhh', function (err, decoded) {
                    if (err) {
                        Response.httpResponse(req, res, NOT_VALID, { message: "User Token expire" })
                    } else {
                        User.find({ _id: decoded.id }).then((data) => {
                            jwt.sign({ id: data[0]._id }, 'shhhhh', { expiresIn: 24 * 60 * 60 }, (err, token) => {
                                if (err) {
                                    Response.httpResponse(req, res, VALIDATE_ERROR, err)
                                } else {
                                    Response.httpResponse(req, res, SUCCESS, { ...data[0]._doc, usertoken: token })
                                }
                            })
                        }).catch((err) => {
                            Response.httpResponse(req, res, VALIDATE_ERROR, err)
                        })
                    }
                });
            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => {
            Response.httpResponse(req, res, VALIDATE_ERROR, err)
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
                User.find({ email: req.body.email }).then((data) => {
                    if (data && data.length) {
                        const user = {
                            password: Response.encryption(req.body.password),
                            confirm_password: Response.encryption(req.body.confirm_password)
                        }
                        User.updateOne({ _id: data[0]._id }, { $set: user }, function (err, data) {
                            if (err) {
                                Response.httpResponse(req, res, VALIDATE_ERROR, err)
                            } else {
                                Response.httpResponse(req, res, SUCCESS, { message: "Password reset successfully" })
                            }
                        })
                    } else {
                        Response.httpResponse(req, res, NOVALUE, { message: "User Not Present" })
                    }
                }).catch((err) => Response.httpResponse(req, res, ERROR, err))
            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
}

/* ForgotPassword Api */
var forgotPassword = (req, res) => {
    const reqBody = {
        email: req.body.email
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                User.find({ email: reqBody.email }).then((data) => {
                    if (data && data.length) {
                        const chnagedPassword = Response.ramdomPassword(parseInt(Math.random() * 1000000))
                        User.updateOne({ _id: data[0]._id }, { $set: { password: chnagedPassword.encrypted, confirm_password: chnagedPassword.encrypted } }, function (err, data) {
                            if (err) {
                                Response.httpResponse(req, res, NOVALUE, data)
                            } else {
                                Response.mail(reqBody.email, chnagedPassword.ramdomPassword, (status, data) => {
                                    if (status) {
                                        Response.httpResponse(req, res, SUCCESS, { message: "Password send your email" })
                                    } else {
                                        Response.httpResponse(req, res, NOVALUE, data)
                                    }
                                })
                            }
                        })

                    } else {
                        Response.httpResponse(req, res, NOVALUE, { message: "Email not present" })
                    }
                }).catch((err) => Response.httpResponse(req, res, ERROR, err))
            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
}

/* Updateuser Api */
var updateUser = (req, res) => {
    const reqBody = {
        id: req.body.id,
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
                User.find({ email: req.body.email }).then((data) => {
                    if (data && data.length === 0) {
                        User.updateOne({ _id: req.body.id }, { $set: user }, function (err, update) {
                            if (err) {
                                Response.httpResponse(req, res, NOVALUE, err)
                            } else {
                                Response.httpResponse(req, res, SUCCESS, { message: "User update successfully" })
                            }
                        })
                    } else {
                        Response.httpResponse(req, res, NOVALUE, { message: "Email already present" })
                    }
                }).catch((err) => Response.httpResponse(req, res, ERROR, err))

            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
}


/* List user */
var listUser = (req, res, next) => {
    const reqBody = {
        usertoken: req.body.usertoken,
        pageNo: req.body.pageNo
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                Response.verifyToken(reqBody.usertoken, (status, responses) => {
                    if (status) {
                        Response.filterSearch(User,reqBody.pageNo,req.body.search,"email","createdAt",(status,response)=>{
                            if(status){
                                Response.httpResponse(req, res, SUCCESS, response)
                            }else{
                                Response.httpResponse(req, res, NOVALUE, err)
                            }
                        })
                    } else {
                        Response.httpResponse(req, res, NOVALUE, responses)
                    }
                })
            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
}

/* Aggregation lookup example List user */
var aggregationlistUser = (req, res, next) => {
    const reqBody = {
        usertoken: req.body.usertoken,
        pageNo: req.body.pageNo
    }
    validate.validation(Object.keys(reqBody), reqBody)
        .then(({ status, response }) => {
            if (status) {
                Response.verifyToken(reqBody.usertoken, (status, responses) => {
                    if (status) {
                        Response.aggregationLookUp(User,"inventory","_id","inventory_id","inventory_doc",(status,response)=>{
                            if(status){
                                Response.httpResponse(req, res, SUCCESS, response)
                            }else{
                                Response.httpResponse(req, res, NOVALUE, response)
                            }
                        })
                    } else {
                        Response.httpResponse(req, res, NOVALUE, responses)
                    }
                })
            } else {
                Response.httpResponse(req, res, VALIDATE_ERROR, response)
            }
        }).catch(err => Response.httpResponse(req, res, VALIDATE_ERROR, err));
}


module.exports = {
    signup,
    login,
    sessionlogin,
    resetPassword,
    forgotPassword,
    updateUser,
    listUser,
    aggregationlistUser
}