// Class used to store contact info for a single buisness card
class ContactInfo {
    constructor(name, phoneNumber, emailAddress) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
    }

    getName() {
        return this.name;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }

    getEmailAddress() {
        return this.emailAddress;
    }

    toString() {
        return 'Name: ' + this.name +
            '\nPhone: ' + this.phoneNumber +
            '\nEmail: ' + this.emailAddress;
    }
}

export default ContactInfo;