import ContactInfo from './contactInfo.js';
import { findBestMatch } from './stringSimilarity.js';

// Class contains the logic to extract necessary contact info from input 
class BusinessCardParser {
    phoneNumberRegex = /[+]?\d?.?\(?\d{3}\)?.?\d{3}.?\d{4}/g;
    emailRegex = /^[a-z\d]+.?[a-z\d]+.?[a-z\d]+@[a-z]+[.-]?[a-z]*\.[a-z]+$/gi;

    // Returns a contactInfo object made from inputText data
    getContactInfo(inputText) {
        let email, phoneNumber, name;
        let foundPhoneNumb, foundEmail, foundName;
        let inputLines = inputText.split('\n');
        let potentialNames = [];
        foundPhoneNumb = foundEmail = foundName = false;

        // Filter out address while trying to find email, phone number & potential names
        for (let aLine of inputLines) {
            aLine = aLine.replace(/  +/g, '').trim(); // Remove extra spaces in the string

            if (!foundName && this.isPossibleName(aLine)) { // Found a possible name
                aLine = this.toTitleCase(aLine);
                potentialNames.push(aLine);
            } else if (!foundPhoneNumb && this.isValidPhoneNumber(aLine)) { // Found phone number
                phoneNumber = this.sanitizePhoneString(aLine);
                foundPhoneNumb = true;
            } else if (!foundEmail && this.isValidEmail(aLine)) { // Found email address
                email = aLine.replace(/ /g, "");
                foundEmail = true;
            }
        }

        if (!foundEmail && potentialNames.length > 0) { // No email was found so use first elem in potentialNames as the name
            name = potentialNames[0];
            foundName = true;
        } else if (potentialNames.length > 0) { // Use email to find the most likely name from potentialNames
            name = this.findMostLikelyName(email, potentialNames);
            foundName = true;
        }

        // Return not found message for any unknown info
        if (!foundName) name = 'Name was not found!';
        if (!foundEmail) email = 'Email was not found!';
        if (!foundPhoneNumb) phoneNumber = 'Phone number was not found!';

        return new ContactInfo(name, phoneNumber, email);
    }

    // Converts string to title case (the cat => The Cat)
    toTitleCase(string) {
        let stringToks = string.split(' ');
        return stringToks.map(tok => {
            return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
        }).join(' ');
    }

    // String is a possible name if it only includes: alpha chars, spaces, dot
    // Assuming name length must be at least 4 letters long
    isPossibleName(textString) {
        let onlyAplhaRegex = /^([a-z\s.]+)$/gi;
        return onlyAplhaRegex.test(textString) && textString.length > 3;
    }

    // Uses email to try and figure out which element in potentialNameArray has highest similarity 
    // to the email parts <tok1>@<tok2>.com (Chosen as name since inputs are random and 
    // no other way to be accurate with no structure) Highest similarity = most probable name
    findMostLikelyName(email, potentialNames) {
        let regex = /^([a-z\d-_.]+)@([a-z\d]+)/gi
        let emailTok, nameCanidate1;
        const emailTokens = [...email.matchAll(regex)];

        // Calculate similarity ratings & return highest one as potential name
        emailTok = emailTokens[0][1];
        nameCanidate1 = this.findMostSimilar(emailTok, potentialNames);

        // If tok1 has less than .2 similarity rating try tok2 and return the highest one as the name
        if (nameCanidate1.rating < .2) {
            let nameCanidate2;
            emailTok = emailTokens[0][2];
            nameCanidate2 = this.findMostSimilar(emailTok, potentialNames);

            if (nameCanidate2.rating > .2)
                return nameCanidate2.target;
        }

        return nameCanidate1.target;
    }

    // Returns element in array with the highest similarity;
    findMostSimilar(possibleName, potentialNames) {
        let matches = findBestMatch(possibleName, potentialNames);
        let bestMatch = matches.bestMatchIndex;
        return matches.ratings[bestMatch];
    }

    // Returns true if not fax number & is valid phone number
    isValidPhoneNumber(phoneString) {
        let isFaxNumber = phoneString.toLowerCase().includes('f');
        if (isFaxNumber) return false;
        return this.phoneNumberRegex.test(phoneString.replace(/ /g, ''));
    }

    // Removes all non-numeric chars
    sanitizePhoneString(phoneString) {
        return phoneString.replace(/[^\d]/g, '');
    }

    // Takes a string and remove all spaces before checking against email regex
    isValidEmail(input) {
        input = input.replace(/ /g, "");
        return this.emailRegex.test(input);
    }
}

export default BusinessCardParser;