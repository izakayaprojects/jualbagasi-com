import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

	added = false
	error = {
		country: "",
		city: "",
		depDate: ""
	}

	ngbDestDep =  this.route.departureDate === null ? 
		null : this.dateConv.dateToNgbDate(this.route.departureDate)

  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal(resp: any) {
  	this.modal.close(resp)
  }

  addRoute(route: Route) {
  	let validated = true
  	this.added = true
  	this.error = { country: '', city: '', depDate: '' }
  	if (route.country === '') {
  		this.error.country = "Negara tujuan tidak boleh kosong!"
  		validated = false
  	}
  	if (route.city === '') {
  		this.error.city = "Kota tujuan tidak boleh kosong!"
  		validated = false
  	}
  	if (route.departureDate === null) {
  		this.error.depDate = "Tanggal keberangkatan tidak boleh kosong!"
  		validated = false
  	}

  	if (validated) {
  		//Send the route object
  	}
  }

  onDateSelected(which, event) {
  	this.route[which] = this.dateConv.ngbDateToDate(event)
  	if (which === "departureDate") {
  		this.ngbDestDep = event
  	}
  }

}
