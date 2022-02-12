// https://github.com/zolomohan/speech-recognition-in-javascript
// https://www.section.io/engineering-education/speech-recognition-in-javascript/
if ("webkitSpeechRecognition" in window) {
  let speechRecognition = new webkitSpeechRecognition();
  let final_transcript = "";

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;

  speechRecognition.lang = 'English'

  speechRecognition.onstart = () => {
    document.querySelector("#status").style.display = "block";
  };
  speechRecognition.onerror = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Error");
  };
  speechRecognition.onend = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Ended");
  };

  speechRecognition.onresult = (event) => {
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    document.querySelector("#finalSpeech").innerHTML = final_transcript;
    document.querySelector("#interimSpeech").innerHTML = interim_transcript;
  };

  document.querySelector("#startSpeech").onclick = () => {
    speechRecognition.start();
    document.querySelector("#startSpeech").style.display = "none";
    document.querySelector("#stopSpeech").style.display = "block";
  };
  document.querySelector("#stopSpeech").onclick = () => {
    speechRecognition.stop();
    document.querySelector("#stopSpeech").style.display = "none";
    document.querySelector("#startSpeech").style.display = "block";
  };
} else {
  console.log("Speech Recognition Not Available");
}



