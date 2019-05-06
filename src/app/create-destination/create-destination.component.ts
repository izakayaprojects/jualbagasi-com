import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from "rxjs";
import { debounceTime, map, distinctUntilChanged, switchMap, catchError } from "rxjs/operators";

import { DateConverter } from "../_models/utils"
import { Route } from "../_models/order"
import { City } from "../_models/places"
import { AutocompleterService } from "../autocompleter.service";

@Component({
  selector: 'app-create-destination',
  templateUrl: './create-destination.component.html',
  styleUrls: ['./create-destination.component.css', "../app.component.css"]
})
export class CreateDestinationComponent implements OnInit {

	@Input() route: Route = new Route()
	dateConv = new DateConverter()

	added = false
	error = { city: "", depDate: "" }

	ngbDestDep =  this.route.departureDate === null ? 
		null : this.dateConv.dateToNgbDate(this.route.departureDate)

  constructor(private modal: NgbActiveModal, private autocompleter: AutocompleterService) {
  }

  ngOnInit() {
  }

  closeModal(resp: any) {
  	this.modal.close(resp)
  }

  addRoute(route: Route) {
  	let validated = true
  	this.added = true
  	this.error = { city: '', depDate: '' }
  	if (route.city.name === '') {
  		this.error.city = "Kota tujuan tidak boleh kosong!"
  		validated = false
  	}
  	if (route.departureDate === null) {
  		this.error.depDate = "Tanggal keberangkatan tidak boleh kosong!"
  		validated = false
  	}

  	if (validated) {
  		//Send back the route object
  	}
  }

  onDateSelected(which, event) {
  	this.route[which] = this.dateConv.ngbDateToDate(event)
  	if (which === "departureDate") {
  		this.ngbDestDep = event
  	}
  }

  searchCity = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < 2) return of([])
        return this.autocompleter.autoCompleteCity(term).pipe(
          catchError(() => {
            return of([])
          }),
          map(result => {
            return result.length > 7 ? result.splice(0, 7) : result
          })
        )
      })
    )

  cityFormatter = (x: City) => x.name

}
