import BusinessCardParser from "../src/businessCardParser";

describe("Test BusinessCardParser toTitleCase method", () => {
    let parser = new BusinessCardParser();
    let input, expectedOutput;

    test('Input with only alpha chars & spaces', () => {
        input = 'the cat in the hat';
        expectedOutput = 'The Cat In The Hat'
        expect(parser.toTitleCase(input)).toBe(expectedOutput);
    })

    test('Input w/ only numbers', () => {
        input = '1323123';
        expectedOutput = '1323123'
        expect(parser.toTitleCase(input)).toBe(expectedOutput);
    })

    test('Input w/ numbers & letters', () => {
        input = '20 n. talbot lane nicholasville, ky 40356';
        expectedOutput = '20 N. Talbot Lane Nicholasville, Ky 40356'
        expect(parser.toTitleCase(input)).toBe(expectedOutput);
    })
})

describe("Test BusinessCardParser isPossibleName method", () => {
    let parser = new BusinessCardParser();
    let isPossibleName;

    describe('Testing valid possible names', () => {
        test('Valid name test #1', () => {
            isPossibleName = parser.isPossibleName('Peter Parker');
            expect(isPossibleName).toBe(true);
        })

        test('Valid name test #2', () => {
            isPossibleName = parser.isPossibleName('John F. Kennedy');
            expect(isPossibleName).toBe(true);
        })

        test('Valid name test #3', () => {
            isPossibleName = parser.isPossibleName('Prince Hampton');
            expect(isPossibleName).toBe(true);
        })

        test('Valid name test #4', () => {
            isPossibleName = parser.isPossibleName('Sam P.');
            expect(isPossibleName).toBe(true);
        })
    })

    describe('Testing invalid possible names', () => {
        test('Invalid name test #1: Word with numbers', () => {
            isPossibleName = parser.isPossibleName('Pr1nce Hampt0n');
            expect(isPossibleName).toBe(false);
        })

        test('Invalid name test #2: Word with one letter first/last name', () => {
            isPossibleName = parser.isPossibleName('T j');
            expect(isPossibleName).toBe(false);
        })

        test('Invalid name test #3: word with &', () => {
            isPossibleName = parser.isPossibleName('Decision & Security Technologies');
            expect(isPossibleName).toBe(false);
        })
    })
})

describe("Testing BusinessCardParser sanitizer method", () => {
    let parser = new BusinessCardParser();
    let phoneNumber;

    test('Phone Sanitize test #1', () => {
        phoneNumber = parser.sanitizePhoneString('201 111 1111');
        expect(phoneNumber).toBe('2011111111');
    })

    test('Phone Sanitize test #2', () => {
        phoneNumber = parser.sanitizePhoneString('201-111-1111');
        expect(phoneNumber).toBe('2011111111');
    })

    test('Phone Sanitize test #3', () => {
        phoneNumber = parser.sanitizePhoneString('(201)-111-1111');
        expect(phoneNumber).toBe('2011111111');
    })

    test('Phone Sanitize test #4', () => {
        phoneNumber = parser.sanitizePhoneString('+1 (201)-111-1111');
        expect(phoneNumber).toBe('12011111111');
    })

    test('Phone Sanitize test #5', () => {
        phoneNumber = parser.sanitizePhoneString('(+1)-(201)-(111)-(1111)');
        expect(phoneNumber).toBe('12011111111');
    })

    test('Phone Sanitize test #6', () => {
        phoneNumber = parser.sanitizePhoneString('+1  201-111   1111');
        expect(phoneNumber).toBe('12011111111');
    })

    test('Phone Sanitize test #7', () => {
        phoneNumber = parser.sanitizePhoneString('1-201-111-1111');
        expect(phoneNumber).toBe('12011111111');
    })
})

describe("Testing BuisnessCardParser getContactInfo method with various inputs", () => {
    let parser = new BusinessCardParser();
    let input, contactInfo, expectedOutput;

    test('Test input #1: Sample input #1', () => {
        input = "ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com";
        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Mike Smith\nPhone: 4105551234\nEmail: msmith@asymmetrik.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #2: Sample input #2', () => {
        input = "Foobar Technologies\nAnalytic Developer\nLisa Haung\n1234 Sentry Road\n" +
            "Columbia, MD 12345\nPhone: 410-555-1234\nFax: 410-555-4321\nlisa.haung@foobartech.com";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Lisa Haung\nPhone: 4105551234\nEmail: lisa.haung@foobartech.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #3: Sample input #3', () => {
        input = "Arthur Wilson\nSoftware Engineer\nDecision & Security Technologies\nABC Technologies\n" +
            "123 North 11th Street\nSuite 229\nArlington, VA 22209\nTel: +1 (703) 555-1259\nFax: +1 (703) 555-1200\n" +
            "awilson@abctech.com";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Arthur Wilson\nPhone: 17035551259\nEmail: awilson@abctech.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #4: Different ordering/formats (Address first)', () => {
        input = "252 NW. Southampton Street\nWheeling, WV 26003\n123-578-1301\n" +
            "Peter Parker\nPhotographer\nspidey-boy@somepeter.com";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Peter Parker\nPhone: 1235781301\nEmail: spidey-boy@somepeter.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #5: Different ordering/formats (Email First)', () => {
        let parser = new BusinessCardParser();
        input = "sellinghouses@tony.com\nReal Estate Agent\n+1 102-126-1056\n20 N. Talbot Lane\nNicholasville, KY 40356\nTONY N.";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Tony N.\nPhone: 11021261056\nEmail: sellinghouses@tony.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #6: Missing Email', () => {
        input = "Cody Copeland\nOffice manager\nHessel Group\n28 Acacia Court\nBeltsville, MD 20705\n856-441-6644";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Cody Copeland\nPhone: 8564416644\nEmail: Email was not found!';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #7: Missing Phone Number', () => {
        input = "7097 Hawthorne Lane\nPeabody, MA 01960\nGaby's Salon\nGaby O.\nHairdresser\n" +
            "fax: 103 120 1957\ngabonis718@gme.dwgtcm.com";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Gaby O.\nPhone: Phone number was not found!\nEmail: gabonis718@gme.dwgtcm.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #8: Missing Name, Phone & Email', () => {
        input = "Farrell LLC\n982 Victoria Ave.\nCanal Winchester, OH 43110";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Farrell Llc\nPhone: Phone number was not found!\nEmail: Email was not found!';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #9: Random spaces', () => {
        input = "Reichel     and Sons\n99    Dogwood     Ave.\n" +
            "Burlington   , MA     01803\nRe   ichel S.\nfax: 1    12 3 5665      322\n" +
            "r-s amuels  @rei   chel.   com\nphone: 1 33 4444 1956";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Reichel S.\nPhone: 13344441956\nEmail: r-samuels@reichel.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #10: Random spaces', () => {
        input = "Li  bra rian\nCar   rie Max Well\n415    Beechwood   Court\n" +
            "Beckley, WV    25801\n607     304     72   29\nc.m.well @something.org";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Carrie Max Well\nPhone: 6073047229\nEmail: c.m.well@something.org';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #11: Wrong phone format', () => {
        let parser = new BusinessCardParser();
        input = "Retired Surgeon\nDr.    Carson \nHospital somewhere\n" +
            "bcarson@something.com\n(1 (129 123 1223\n48 Rose St. \nJohnson City, TN 37601";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Dr.carson\nPhone: 11291231223\nEmail: bcarson@something.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #12: Similar Name & job title', () => {
        input = "KENNEL ASSISTANT\nKENNEY GOU\n9 St Margarets Ave.\n" +
            "Pataskala, OH 43062\nkenney@     animalservice.  com\n481 485- 1135";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Kenney Gou\nPhone: 4814851135\nEmail: kenney@animalservice.com';
        expect(contactInfo).toBe(expectedOutput);
    })

    test('Test input #13: Similar Name & Company Name', () => {
        let parser = new BusinessCardParser();
        input = "Timber powers\nTim Powel\ntimP@usc.edu\n048   195-       1345\n" +
            "0103119384\n225 Lexington Ave.\nJersey City, NJ 07302";

        contactInfo = parser.getContactInfo(input).toString();
        expectedOutput = 'Name: Tim Powel\nPhone: 0481951345\nEmail: timP@usc.edu';
        expect(contactInfo).toBe(expectedOutput);
    })
})