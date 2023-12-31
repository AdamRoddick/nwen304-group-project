const passwordOperations = {

    evaluateRequirements(password) {
        // Minimum Password Length
        const minLength = 6;
        // Contains variables to check if the password contains at least one character from each category
        const contUpperCase = /[A-Z]/;
        const contLowerCase = /[a-z]/;
        const contNumbers = /\d/;
        const contSymbols = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

        // boolean for switch case
        let meetsRequirements = true;

        //exceptions for password requirements (temporary) to speed up testing
        if (password === "test" || password === "1") {
            return true;
        }

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
                meetsRequirements = true;
                break;
        }
        return meetsRequirements;
    },

    checkRequirements(password) {
        if (!this.evaluateRequirements(password)) {
            return "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one symbol";
        }
        return "";
    },

    evaluatePassword(password) {
        // fields to measure strength
        var strength = 0;
        var variations = 0;
        const upperCase = /[A-Z]/;
        const lowerCase = /[a-z]/;
        const numbers = /\d/;
        const symbols = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

        // case there is no password
        if (password == null) {
            return strength;
        }


        let requirementVariation = {
            casesUpper: upperCase.test(password),
            casesLower: lowerCase.test(password),
            digitsUsed: numbers.test(password),
            symbolsUsed: symbols.test(password)
        }

        for (let i in requirementVariation) {
            variations += (requirementVariation[i] == true) ? 1 : 0;
        }

        strength += (variations - 1) * 10; // 10 points for each variation (max 40)

        // Increase strength level for every unique letter until 5 repetitions
        let evalPassword = new Object();
        for (let i = 0; i < password.length; i++) {
            // Increments the count of the letter in the object
            // If the letter has not been encountered, starts with 0
            evalPassword[password[i]] = (evalPassword[password[i]] || 0) + 1; // checks whether the letter has been encountered before
            // strength increases by 5 divided by the number of times the letter has been encountered
            strength += 5.0 / evalPassword[password[i]];
        }
        return parseInt(strength);
    },

    checkComplexity(password) {
        let strength = this.evaluatePassword(password);
        if (strength > 70) {
            return "strong";
        }

        if (strength > 50) {
            return "okay";
        }

        if (strength > 30) {
            return "weak";
        }

        if (strength <= 10) {
            return "very weak";
        }
        return "terrible";
    },
}
