import ContactInfo from './contactInfo.js';
import { findBestMatch } from './stringSimilarity.js';

// Class contains the logic to extract necessary contact info from input 
class BusinessCardParser {
    phoneNumberRegex = /[+]?\d?.?\(?\d{3}\)?.?\d{3}.?\d{4}/g;
    emailRegex = /^([a-z\d]+.?){0,3}[a-z\d]+@[a-z]+[.-]?[a-z]*\.[a-z]+$/gi;

    // Returns a contactInfo object made from inputText data
    getContactInfo(inputText) {
        let email, phoneNumber, name;
        let inputLines = inputText.split('\n');
        let potentialNames = [];

        // Filter out address while trying to find email, phone number & potential names
        for (let line of inputLines) {
            line = line.replace(/  +/g, '').trim();

            if (this.isPossibleName(line)) {
                line = this.toTitleCase(line);
                potentialNames.push(line);
            } else if (!phoneNumber && this.isValidPhoneNumber(line)) {
                phoneNumber = this.sanitizePhoneString(line);
            } else if (!email && this.isValidEmail(line)) {
                email = this.removeAllSpaces(line);
            }
        }

        // Use email to find name, else use first element in potential names 
        if (email && potentialNames.length > 0) {
            name = this.findMostLikelyName(email, potentialNames);
        } else if (potentialNames.length > 0) {
            name = potentialNames[0];
        }

        // Set not found message for any unknown info
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

    // Possible name if it only includes alpha chars, spaces, dot & is 4 chars or more
    isPossibleName(textString) {
        let onlyAplhaRegex = /^([a-z\s.]+)$/gi;
        return onlyAplhaRegex.test(textString) && textString.length > 3;
    }

    // Uses email to figure out which element in potentialNames has highest similarity 
    // to the emailToks (<emailTok1>@<emailTok2>.com). Highest similarity = most probable name
    findMostLikelyName(email, potentialNames) {
        let regex = /^([a-z\d-_.]+)@([a-z\d]+)/gi;
        const emailTokens = [...email.matchAll(regex)][0];
        let nameCanidate1;

        // Calculate similarity ratings & return highest one as nameCanidate1
        nameCanidate1 = this.findMostSimilar(emailTokens[1], potentialNames);

        // If emailTok[1] has less than .2 similarity rating try 
        // emailTok[2] and return the highest one as the name
        if (nameCanidate1.rating < .2) {
            let nameCanidate2;
            nameCanidate2 = this.findMostSimilar(emailTokens[2], potentialNames);

            if (nameCanidate2.rating > .2)
                return nameCanidate2.target;
        }

        return nameCanidate1.target;
    }

    // Returns element in potentialNames array with the highest similarity 
    // to the possibleNameTok element returned has target, rating
    findMostSimilar(possibleNameTok, potentialNames) {
        let similarityResults = findBestMatch(possibleNameTok, potentialNames);
        let bestMatch = similarityResults.bestMatchIndex;
        return similarityResults.ratings[bestMatch];
    }

    // Returns true if not fax number & is valid phone number format
    isValidPhoneNumber(input) {
        let isFaxNumber = input.toLowerCase().includes('f');

        if (isFaxNumber)
            return false;

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