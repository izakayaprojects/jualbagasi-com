import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DateConverter } from "../_models/utils";


@Component({
  selector: 'app-dialog-edit-daterange',
  templateUrl: './dialog-edit-daterange.component.html',
  styleUrls: ['./dialog-edit-daterange.component.css', '../app.component.css']
})
export class DialogEditDaterangeComponent implements OnInit {

	@Input() dateRange
	@Input() title: string
	@Input() info: string

  private dateConv = new DateConverter()

  outputDateRange = []

  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
    this.outputDateRange = [
      this.dateConv.dateToNgbDate(this.dateRange[0]),
      this.dateConv.dateToNgbDate(this.dateRange[1]),
    ]
  }

  onMinDateSelected(date) {
    this.outputDateRange[0] = date
    this.dateRange[0] = this.dateConv.ngbDateToDate(date)
  }

  onMaxDateSelected(date) {
    this.outputDateRange[1] = date
    this.dateRange[1] = this.dateConv.ngbDateToDate(date)
  }

  onConfirm() {
    this.modal.close({dateRange: this.dateRange})
  }

  onClose() {
    this.modal.close({})
  }

}
