import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-edit-text',
  templateUrl: './dialog-edit-text.component.html',
  styleUrls: ['./dialog-edit-text.component.css']
})
export class DialogEditTextComponent implements OnInit {

	@Input() title: string
	@Input() content: string
	@Input() info: string
  @Input() type: string = "text"
  @Input() min: number

  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
  }

  onTextArea(value) {
    this.content = value
  }

  onConfirm() {
  	this.closeModal({
  		content: this.content
  	})
  }

  onClose() {
  	this.closeModal({})
  }

  private closeModal(resp: any) {
  	this.modal.close(resp)
  }

}
