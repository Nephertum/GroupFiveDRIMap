# GroupFiveDRIMap

This webpage is an interactive map of the Doncaster Royal Infirmary Hospital. It includes a page for users and a page for admins.

## How To Execute Code

All files should be deployed to the same directory. Go to the correct directory in your terminal and install the required node modules by typing "npm install". Start the server by typing "npm start" and then visit http://127.0.0.1:3000 or localhost:3000 in a browser.

When server is running, the app can be found at http://18.168.221.136:3000.

The website has been tested using Chrome and no errors are known to exist with other browsers.

## API Documentation

See app.js documentation at http://127.0.0.1:3000/doc/index.html when sever running. To regenerate app.js documentation, first delete the node_modules folder if it exists then run "apidoc -i . src -o client/doc".

## API Testing

Run tests by setting the test flag in app.js to true then typing "npm test" in terminal.

## Credits
https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/

https://www.section.io/engineering-education/speech-recognition-in-javascript/

https://www.section.io/engineering-education/text-to-speech-in-javascript/
