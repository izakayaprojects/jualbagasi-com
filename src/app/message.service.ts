import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

	private message = {
		type: "",
		text: ""
	}

  constructor() { }

  hasMessage(): boolean {
  	return this.message.type !== '' && this.message.text !== ''
  }

  getType(): string {
    return this.message.type
  }

  getText(): string {
    return this.message.text
  }

  setMessage(type: string, text: string) {
  	this.message.type = type
  	this.message.text = text
  }

  removeMessage() {
  	this.message = {
  		type: "",
  		text: ""
  	}
  }

}
