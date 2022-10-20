const express =require('express');
const app=express();
const path=require('path');

const server=require('http').Server(app);
const io=require('socket.io')(server);
const fs = require("fs");
const randomstring=require("randomstring");

server.listen(8080, ()=> {
    console.log('Listening')
});

let projectId="fit2095-360507";

// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");
// const { TranslationWidth } = require('@angular/common');
const {Translate} = require("@google-cloud/translate").v2;
const translate = new Translate({projectId});

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// Construct the request
// const request = {
//   input: { text: "" },
//   // Select the language and SSML Voice Gender (optional)
//   voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
//   // Select the type of audio encoding
//   audioConfig: { audioEncoding: "MP3" },
// }; 

app.use("/",express.static(path.join(__dirname,"dist","lab12")));
// app.use("/mp3s",express.static(path.join(__dirname,"mp3s")));

//server to server communication not frontend

io.on('connection', (socket)=> {
    socket.on('onNewText', (data)=>{
        console.log(data);
        translateMyText(data.text, data.targetLanguage).then((theTranslation)=>{
            translateMyText(data.text, "en").then((engTranslation)=>{

                let resultObj={
                targetLanguage:data.targetLanguage,
                originalText:data.text,
                translatedText:theTranslation,
                translatedText2:engTranslation
                };
        
                io.emit("onTranslateText", resultObj);
            })
            
        })
        
    })
});

async function translateMyText(theText, targetLanguage){
    // The text to translate
    const text=theText;

    // The target language
    const target=targetLanguage;

    // Translate text 
    const [translation] = await translate.translate(text, target);

    console.log('Translation: ${translation}');
    return translation;
}
    