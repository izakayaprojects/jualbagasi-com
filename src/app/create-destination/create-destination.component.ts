import { Component, OnInit, Input } from '@angular/core';

import { Route } from "../_models/order";

@Component({
  selector: 'app-create-destination',
  templateUrl: './create-destination.component.html',
  styleUrls: ['./create-destination.component.css']
})
export class CreateDestinationComponent implements OnInit {

	@Input() route: Route

  constructor() { }

  ngOnInit() {
  }

}
