var validate = require('../Common/common')
var httpResponse = require('../Common/response')
var User = require('../Modal/user')
var jwt = require('jsonwebtoken')
var stripe = require('stripe')('sk_test_8IXgFyFuwiXiiNpLciJTzigD');
var { SUCCESS, ERROR, VALIDATE_ERROR, NOT_VALID, NOVALUE, ERROR, STRIPE_CUSTOME_ID} = require('../Common/constant')


/**create customer */
var createCustomer = (obj,cb) => {
    User.find({_id:obj.id}).then((data)=>{
        console.log(data)
       if(data[0].stripeCustomerId) cb(true,{message:"stripe account present",data:data[0]})
       else{
        stripe.customers.create({email: data[0].email,name:data[0].username},function(err, customer) {
            if(err) cb(false,err)
            else {
                const data ={
                    stripeCustomerId:customer.id
                }
                User.updateOne({_id:obj.id},{$set:data},function(err,data){
                    if(err) cb(false,err)
                    else cb(true,customer)
                })
            }
        }); 
       } 
    }).catch((err)=>cb(false,err))

}

/**add card */
var addCard = (obj,cb) => {
    stripe.tokens.create(
        {
          card: {
            number: obj.cardNumber,
            exp_month: obj.expireMonth,
            exp_year: obj.cardExpiry,
            cvc: obj.cardCvc,
          },
        },function(err, token) {
          if(err) cb(false,err)
          else{
              console.log(token)
            stripe.customers.createSource(
                STRIPE_CUSTOME_ID,
                {source: token.id},
                function(err, card) {
                    if(err) cb(false,err)
                    else{
                        cb(true,card)
                    }
                }
              );
          }
        }
      );
}

module.exports = {
    createCustomer,
    addCard
}