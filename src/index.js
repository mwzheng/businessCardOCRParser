import BusinessCardParser from './businessCardParser.js';

const textArea = document.getElementById('textArea');
const submitButton = document.getElementById('submitButton');
const contactsContainer = document.getElementById('contactsContainer');

// Process input for contact info and returns a contactInfo object
function processData() {
    const inputText = textArea.value.trim();
    let contactInfo;

    if (inputText) { // Non empty input, process data & create output
        contactInfo = new BusinessCardParser().getContactInfo(inputText);
        createNewContactBox(contactInfo);
    }

    clearTextAreaInput();
    return contactInfo;
}

// Adds new contact entry to contact list using data in contactInfo
function createNewContactBox(contactInfo) {
    let name, phone, email, newBox;
    name = contactInfo.getName();
    phone = contactInfo.getPhoneNumber();
    email = contactInfo.getEmailAddress();

    newBox =
        "<div class='aContact'>" +
        "<div class='contactIcon'>" +
        "<img class='icon' src='./contactIcon.png' alt='contactIcon'>" +
        "</div>" +
        "<div class='info'>";

    newBox += makeContactRow("Name", "name", name);
    newBox += makeContactRow("Phone", "phoneNumber", phone);
    newBox += makeContactRow("Email", "email", email);
    newBox += "</div></div>";

    contactsContainer.innerHTML += newBox;
}

// Makes a single part of the contactBox (Name, Phone or email)
// If field is not found, then give class name not found to make it red
function makeContactRow(field, id, input) {
    let className = input.includes('not found') ? 'notFound' : 'found';
    return `<p><b><u>${field}</u>:</b> <span id=${id} class=${className}>${input}</span></p>`;
}

// Clears text field
function clearTextAreaInput() {
    textArea.value = '';
}

// Listen for click events on submit button
submitButton.addEventListener('click', processData, false);