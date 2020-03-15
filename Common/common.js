

var isObjectEmpty = function (obj, cb) {
    let names = Object.getOwnPropertyNames(obj);
    return Promise.resolve({ status: (names.length === 0) ? true : false, names });
}

var validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var validateMobile = function (phone) {

    const number = phone.toString();
    var re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
    return re.test(number);
}

var validatePassword = function (value) {
    return (value && value.length >= 5) ? true : false;
}

var validation = function (parameters, obj) {
    return isObjectEmpty(obj)
        .then(({ status, names }) => {
            if (!status) {
                let existedFields = {
                    keys: names,
                    emptyKeys: []
                }
                parameters.forEach((element, index) => {
                    !obj[element] && existedFields.emptyKeys.push({ fieldName: element, message: "Required" });
                });

                //Specific fields validations
                existedFields.emptyKeys.length <= 0 &&
                    existedFields.keys.forEach((element) => {
                        switch (element) {
                            case "email":
                                !validateEmail(obj["email"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Email address is not valid." });
                                break;
                            case "phone":
                                !validateMobile(obj["phone"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Mobile number is not valid." });
                                break;
                            case "password":
                                !validatePassword(obj["password"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Password at least 5 characters" });
                                break;
                            case "confirm_password":
                                if (obj["password"] !== obj["confirm_password"]) {
                                    existedFields.emptyKeys.push({ fieldName: "password", message: "Password is not matched." });
                                    existedFields.emptyKeys.push({ fieldName: "confirm_password", message: "Password is not matched." });
                                }
                                break;
                        }
                    });

                return Promise.resolve({ status: existedFields.emptyKeys.length > 0 ? false : true, response: existedFields.emptyKeys });
            } else return Promise.resolve({ status: false, response: parameters });
        });
}

module.exports = {
    validation
}