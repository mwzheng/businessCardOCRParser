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

- I wasn't able to figure out how to test the BuisnessCardParser's getContactInfo() using Jest since I was using an external library and I kept getting an error in jest. Therefore, I had to manually test it with different inputs in test/inputTestData.txt.

- I used the parts of the email to make a best guess for the person's name since input was random and unstructured. If no email was provided I used the first possible candidate as the name.

- One assumption I did make, however, was that each data was on it's own line (Ex: Name and address won't be on same line, etc.)

Libraries used: 
- [String-Similarity](https://github.com/aceakash/string-similarity#for-browser-apps)