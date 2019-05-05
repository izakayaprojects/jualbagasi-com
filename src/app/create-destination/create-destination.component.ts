import { Component, OnInit, Input } from '@angular/core';

import { DateConverter } from "../_models/utils"
import { Route } from "../_models/order";

@Component({
  selector: 'app-create-destination',
  templateUrl: './create-destination.component.html',
  styleUrls: ['./create-destination.component.css', "../app.component.css"]
})
export class CreateDestinationComponent implements OnInit {

	@Input() route: Route = new Route()
	dateConv = new DateConverter()

	ngbDestDep =  this.route.departureDate === null ? 
		null : this.dateConv.dateToNgbDate(this.route.departureDate)

  constructor() { }

  ngOnInit() {
  }

  onDateSelected(which, event) {
  	this.route[which] = this.dateConv.ngbDateToDate(event)
  	if (which === "departureDate") {
  		this.ngbDestDep = event
  	}
  }

}
