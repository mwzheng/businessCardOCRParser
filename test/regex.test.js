// Test for regex used by BuisnessCardParser's method:
// isValidEmail & isValidPhoneNumber 

describe("Testing phoneNumberRegex", () => {
    const phoneNumberRegex = /[+]?\d?.?\(?\d{3}\)?.?\d{3}.?\d{4}/g;
    let phoneNumber;

    describe('Testing phone number regex against different valid phone number formats', () => {
        test('Phone format: #########', () => {
            phoneNumber = '1221111111';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: ### ### ###', () => {
            phoneNumber = '122 111 1111';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: ###-###-####', () => {
            phoneNumber = '301-123-1234';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: (###) ###-####', () => {
            phoneNumber = '(541) 754-3010';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: #-###-###-####', () => {
            phoneNumber = '1-541-754-3010';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: # ### ### ####', () => {
            phoneNumber = '1 541 754 3010';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: +# ### ###-###', () => {
            phoneNumber = '+3 203 122-1121';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: +#-###-###-####', () => {
            phoneNumber = '+1-541-754-3010';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })

        test('Phone format: +# ###-###-####', () => {
            phoneNumber = '+1 541-754-3010';
            expect(phoneNumber).toMatch(phoneNumberRegex);
        })
    })

    describe('Testing invalid phone numbers uiising phone number regex', () => {
        test('Phone Number with too many digits: ####-####-####', () => {
            phoneNumber = '1541-1754-3010';
            expect(phoneNumber).not.toMatch(phoneNumberRegex);
        })

        test('Phone Number missing digits: #-###-####', () => {
            phoneNumber = '1-154-3010';
            expect(phoneNumber).not.toMatch(phoneNumberRegex);
        })

        test('Phone Number with a char: ###-#c#-####', () => {
            phoneNumber = '134-1x4-3010';
            expect(phoneNumber).not.toMatch(phoneNumberRegex);
        })
    })
})

describe('Testing emailRegex', () => {
    const emailRegex = /^([a-z\d]+.?){0,3}[a-z\d]+@[a-z]+[.-]?[a-z]*\.[a-z]+$/gi;
    let email;

    describe('Testing email regex against different potential emails', () => {
        test('Generic email format something@something.com', () => {
            email = 'random122@person.com';
            expect(email).toMatch(emailRegex);
        })

        test('Email with dots before @ ex: firstname.lastname@example.com', () => {
            email = 'lisa.haung@foobartech.com';
            expect(email).toMatch(emailRegex);
        })

        test('Email with hyphen & dot ex: <a>.<b>@<c>-<d>.com', () => {
            email = 'abc.def@mail-archive.com';
            expect(email).toMatch(emailRegex);
        })

        test('Email with underscores ex: <a>_<b>@<c>-<d>.com', () => {
            email = 'abc123_def@mail-archive.com';
            expect(email).toMatch(emailRegex);
        })

        test('Email ending w/ .muesum ex: <a>_<b>@<c>-<d>.mueseum', () => {
            email = 'abc123@mail-something.museum';
            expect(email).toMatch(emailRegex);
        })

        test('Email with mostly numbers', () => {
            email = '1234567890@example.com';
            expect(email).toMatch(emailRegex);
        })

        test('Email with subdomains', () => {
            email = 'email@subdomain.example.com';
            expect(email).toMatch(emailRegex);
        })

        test('Email with +', () => {
            email = 'firstname+lastname@example.com';
            expect(email).toMatch(emailRegex);
        })
    })

    describe('Testing invalid email addresses using email regex', () => {
        test('Email ending w/ hypen ex: <a>@<b>.mueseum-', () => {
            email = 'abc123@archive.museum-';
            expect(email).not.toMatch(emailRegex);
        })

        test('Email starting w/ dot ex: .something@something.com', () => {
            email = '.abc123@archive.com';
            expect(email).not.toMatch(emailRegex);
        })

        test('Email w/ no @ ex: something.com', () => {
            email = 'archive.com';
            expect(email).not.toMatch(emailRegex);
        })
    })
})