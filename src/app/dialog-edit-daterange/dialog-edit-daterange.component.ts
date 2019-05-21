import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-edit-daterange',
  templateUrl: './dialog-edit-daterange.component.html',
  styleUrls: ['./dialog-edit-daterange.component.css', '../app.component.css']
})
export class DialogEditDaterangeComponent implements OnInit {

	@Input() dateRange
	@Input() title: string
	@Input() info: string

  constructor() { }

  ngOnInit() {
  }

  onMinDateSelected(date) {

  }

  onMaxDateSelected(date) {

  }

}
