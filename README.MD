## Business Card OCR Parser

To run:
- $ npm install -g live-server
- $ npm install
- $ live-server
- click on public dir

Test:
- All test: $ npm test
- A test file: $ npm test \<test/fileName.test.js>

Notes:
- This was my first time ever writing test code using Jest

- I used the parts of the email to make a best guess for the person's name since input was random and unstructured. If no email was provided I used the first possible candidate as the name.

- One assumption I did make, however, was that each data was on it's own line (Ex: Name and address won't be on same line, etc.)

<b>Files:</b>
- <b>public:</b>
    - <b>index.html:</b> Main page of the application

- <b>src:</b>
    - <b>index.js:</b> Retrieves input & passes it to BusinessCardParser & displays output

    - <b>businessCardParser.js:</b> All logic used to extract info from input

    - <b>contactInfo.js:</b> Contans contactInfo class to store info extracted by BusinessCardParser

    - <b>stringSimilarity.js:</b> All code from string-similarity library (NOT MY CODE)

- <b>test:</b>
    - <b>businessCardParser.test.js:</b> All test for businessCardParser class

    - <b>regex.test.js:</b> All test for phone & email regex used in businessCardParser

    - <b>inputTestData.txt:</b> Contains input for every test for getContactInfo() to test manually

Libraries used: 
    
- [String-Similarity](https://github.com/aceakash/string-similarity#for-browser-apps)