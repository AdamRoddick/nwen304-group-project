

function checkRequirements(password) {
    // Minimum Password Length
    const minLength = 8;
    // Contains variables to check if the password contains at least one character from each category
    const contUpperCase = /[A-Z]/;
    const contLowerCase = /[a-z]/;
    const contNumbers = /\d/;
    const contSymbols = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

    // boolean for switch case
    let meetsRequirements = true;

    switch (meetsRequirements) {
        case password.length < minLength: // Minimum length doesn't meet requirement
        case !contUpperCase.test(password): // Does not contain uppercase letters
        case !contLowerCase.test(password): // Does not contain lowercase letters
        case !contNumbers.test(password): // Does not contain numbers
        case !contSymbols.test(password): // Does not contain symbols
            meetsRequirements = false;
            break;
        default:
            console.log("Password meets requirements");
            break;
    }
    return meetsRequirements;
}
