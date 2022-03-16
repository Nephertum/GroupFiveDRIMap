// https://github.com/zolomohan/speech-recognition-in-javascript
// https://www.section.io/engineering-education/speech-recognition-in-javascript/
const navigation_start_input = document.getElementById('path1')
const navigation_end_input = document.getElementById('path2')
const start_speech_input_1 = document.getElementById('startSpeech1')
const start_speech_input_2 = document.getElementById('startSpeech2')
const stop_speech_input_1 = document.getElementById('stopSpeech1')
const stop_speech_input_2 = document.getElementById('stopSpeech2')
let target_input
let processing = false

if ('webkitSpeechRecognition' in window) {
  const speechRecognition = new webkitSpeechRecognition()
  let final_transcript = ''

  speechRecognition.continuous = true
  speechRecognition.interimResults = true

  speechRecognition.lang = 'English'

  speechRecognition.onresult = (event) => {
    let interim_transcript = ''

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript
      } else {
        interim_transcript += event.results[i][0].transcript
      }
    }
    console.log(final_transcript)
    console.log(target_input)
    target_input.value = ''
    target_input.value = final_transcript
  }

  start_speech_input_1.onclick = () => {
    if (!processing) {
      processing = true
      target_input = navigation_start_input
      speechRecognition.start()
      start_speech_input_1.style.display = 'none'
      stop_speech_input_1.style.display = 'block'
    }
  }
  start_speech_input_2.onclick = () => {
    if (!processing) {
      processing = true
      target_input = navigation_end_input
      speechRecognition.start()
      start_speech_input_2.style.display = 'none'
      stop_speech_input_2.style.display = 'block'
    }
  }
  stop_speech_input_1.onclick = () => {
    processing = false
    speechRecognition.stop()
    stop_speech_input_1.style.display = 'none'
    start_speech_input_1.style.display = 'block'
  }
  stop_speech_input_2.onclick = () => {
    processing = false
    speechRecognition.stop()
    stop_speech_input_2.style.display = 'none'
    start_speech_input_2.style.display = 'block'
  }
} else {
  console.log('Speech Recognition Not Available')
}
