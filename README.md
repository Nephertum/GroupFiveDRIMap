# GroupFiveDRIMap

This webpage is an interactive map of the Doncaster Royal Infirmary Hospital. It includes a page for users and a page for admins.

## Built With
* [JQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Font Awesome](https://fontawesome.com/)
* [Mappa](https://mappa.js.org/)
* [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/api/)
* [Express](https://expressjs.com/)
* [apiDoc](https://apidocjs.com/)

## Installation

1. Clone the repository
  ```sh
  git clone https://github.com/Nephertum/GroupFiveDRIMap.git
  ```

2. Install NPM packages
  ```sh
  npm install
  ```

3. Start the server
  ```sh
  npm start
  ```

4. Visit http://127.0.0.1:3000 or localhost:3000 in a browser.

When the server is running, the app can be found at http://18.168.221.136:3000.

The website has been tested using Chrome and no errors are known to exist with other browsers.

## Usage

## API Documentation

See app.js documentation at http://127.0.0.1:3000/doc/index.html when the sever is running.

To update the documentation:
1. Update the comments in `app.js` (see https://apidocjs.com/ for guidance)
2. Delete the node_modules folder if it exists
3. Regenerate documentation
  ```sh
  apidoc -i . src -o client/doc
  ```

## API Testing

1. Set test flag to true in `app.js`
   ```js
   const TESTING = true;
   ```
2. Run tests
   ```sh
   npm test
   ```

## License

## Contact
Jack Rathbone - jack.rathbone@durham.ac.uk  
Emily Brown - emily.p.brown@durham.ac.uk  
Ibrahim Ganidagli - ibrahim.ganidagli@durham.ac.uk  
Daniel Atkinson - daniel.j.atkinson2@durham.ac.uk  
Hetu Lu - hetu.lu@durham.ac.uk  
Project link: https://github.com/Nephertum/GroupFiveDRIMap

## Aknowledgements
"Dijkstra’s shortest path algorithm | Greedy Algo-7", GeeksforGeeks, 22 February 2022
https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/

"Speech Recognition Using the Web Speech API in JavaScript", Mohan Raj, Section, January 11 2021
https://www.section.io/engineering-education/speech-recognition-in-javascript/

"Text to Speech using Web Speech API in JavaScript", Mohan Raj, Section, January 17 2021
https://www.section.io/engineering-education/text-to-speech-in-javascript/
