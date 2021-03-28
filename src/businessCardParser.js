import ContactInfo from './contactInfo.js';
import { findBestMatch } from './stringSimilarity.js';

// Class contains the logic to extract necessary contact info from input 
class BusinessCardParser {
    phoneNumberRegex = /[+]?\d?.?\(?\d{3}\)?.?\d{3}.?\d{4}/g;
    emailRegex = /^[a-z\d]+.?[a-z\d]+.?[a-z\d]+@[a-z]+[.-]?[a-z]*\.[a-z]+$/gi;

    // Returns a contactInfo object made from inputText data
    getContactInfo(inputText) {
        let email, phoneNumber, name;
        let inputLines = inputText.split('\n');
        let potentialNames = [];

        // Filter out address while trying to find email, phone number & potential names
        for (let aLine of inputLines) {
            aLine = aLine.replace(/  +/g, '').trim(); // Remove extra spaces (two or more in a row, front and end)

            if (this.isPossibleName(aLine)) { // Found a possible name
                aLine = this.toTitleCase(aLine);
                potentialNames.push(aLine);
            } else if (!phoneNumber && this.isValidPhoneNumber(aLine)) { // Found phone number
                phoneNumber = this.sanitizePhoneString(aLine);
            } else if (!email && this.isValidEmail(aLine)) { // Found email address
                email = this.removeAllSpaces(aLine);
            }
        }

        if (!email && potentialNames.length > 0) { // No email was found so use first elem in potentialNames as the name
            name = potentialNames[0];
        } else if (potentialNames.length > 0) { // Use email to find the most likely name from potentialNames
            name = this.findMostLikelyName(email, potentialNames);
        }

        // Return not found message for any unknown info
        if (!name) name = 'Name was not found!';
        if (!email) email = 'Email was not found!';
        if (!phoneNumber) phoneNumber = 'Phone number was not found!';

        return new ContactInfo(name, phoneNumber, email);
    }

    // Converts string to title case (Ex: the cat in the hat => The Cat In The Hat)
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
        let regex = /^([a-z\d-_.]+)@([a-z\d]+)/gi;  // Use to get email parts: <partOne>@<partTwo>.com
        let nameCanidate1;
        const emailTokens = [...email.matchAll(regex)][0];

        // Calculate similarity ratings & return highest one as nameCanidate1
        nameCanidate1 = this.findMostSimilar(emailTokens[1], potentialNames);

        // If emailTok has less than .2 similarity rating try tok2 and return the highest one as the name
        if (nameCanidate1.rating < .2) {
            let nameCanidate2;
            nameCanidate2 = this.findMostSimilar(emailTokens[2], potentialNames);

            if (nameCanidate2.rating > .2)
                return nameCanidate2.target;
        }

        return nameCanidate1.target;
    }

    // Returns element in potentialNames array with the highest similarity to the possibleName
    // Element returned has target, rating
    findMostSimilar(possibleName, potentialNames) {
        let results = findBestMatch(possibleName, potentialNames);
        let bestMatch = results.bestMatchIndex;
        return results.ratings[bestMatch];
    }

    // Returns true if not fax number & is valid phone number
    isValidPhoneNumber(input) {
        let isFaxNumber = input.toLowerCase().includes('f');
        if (isFaxNumber) return false;
        input = this.removeAllSpaces(input);
        return this.phoneNumberRegex.test(input);
    }

    // Removes all non-digits from the phoneString
    sanitizePhoneString(phoneString) {
        return phoneString.replace(/[^\d]/g, '');
    }

    // Takes a string and remove all spaces before checking against email regex
    isValidEmail(input) {
        input = this.removeAllSpaces(input);
        return this.emailRegex.test(input);
    }

    // Removes all spaces from the string
    removeAllSpaces(input) {
        return input.replace(/ /g, '');
    }
}

export default BusinessCardParser;