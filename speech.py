# Installations:
# sudo pip3 install SpeechRecognition
# conda install pyaudio 

import speech_recognition as sr

r = sr.Recognizer()

with sr.Microphone() as source:
    print('Say Anything: ')
    audio = r.listen(source)

    try:
        text = r.recognize_google(audio)
        print('You said: {}'.format(text))
    except:
        print('Sorry could not recognize your voice')