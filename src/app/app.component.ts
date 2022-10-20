import { Component } from '@angular/core';
import {io} from 'socket.io-client';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lab12';

  messageText: string = "";
  targetLanguages = ['fr', 'ko', 'ja', 'zh', 'vi', 'en'];
  selectedLanguage=this.targetLanguages[0];
  socket: any;
  messages: any = [];

  constructor(){
    this.socket=io();
    // this.socket.on("newSpeech", (data:any)=>{
    //   this.messages.push(data);
    // })
  }

  ngOnInit(){
    this.messages=new Array();
    this.listen2Events();
  }

  listen2Events(){
    this.socket.on('onTranslateText', (data:any)=>{
      this.messages.push(data);
    })
  }

  sendText(){
    const object={
      text: this.messageText,
      targetLanguage: this.selectedLanguage
    }
    this.socket.emit('onNewText', object);
  }
}
