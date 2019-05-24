import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

	@Input() title: string
	@Input() description: string

  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
  }

  onConfirm() {
  	this.modal.close(true)
  }

  onCancel() {
  	this.modal.close(false)
  }


}
