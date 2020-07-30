var express = require('express');
var router = express.Router();
var user = require('../Controller/user')
var payment = require('../Controller/payment')
var validate = require('../Common/common')
var httpResponse = require('../Common/response')
var app =require('../app')
var { SUCCESS, ERROR, VALIDATE_ERROR, NOT_VALID, NOVALUE, ERROR, STRIPE_CUSTOME_ID} = require('../Common/constant')

router.post('/createcard',(req,res,next)=>{
    const reqBody = {
        id:req.body.id,
        cardNumber:req.body.cardNumber ,
        cardExpiry: req.body.cardExpiry,
        expireMonth:req.body.expireMonth,
        cardCvc:req.body.cardCvc
    }
    
    validate.validation(Object.keys(reqBody), reqBody)
    .then(({ status, response }) => {
        if (status) next();
        else httpResponse.httpResponse(req,res,VALIDATE_ERROR,response)
        }).catch(err => httpResponse.httpResponse(req,res,VALIDATE_ERROR,err))
}, (req,res,next)=>{    
    payment.createCustomer({id:req.body.id},(status,response)=>{
        if(status){
            STRIPE_CUSTOME_ID = response.data.stripeCustomerId
            next();
            }
        else httpResponse.httpResponse(req,res,NOVALUE,response)
    })
},(req,res)=>{
    payment.addCard({
        STRIPE_CUSTOME_ID,
        ...req.body
    },(status,response)=>{
        if(status)  {
            httpResponse.httpResponse(req,res,SUCCESS,response)
        }else{
            httpResponse.cardError(req,res,response)
        }
    })
})

module.exports = router