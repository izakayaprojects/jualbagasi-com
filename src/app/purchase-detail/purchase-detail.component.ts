import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from "@angular/router"

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css', "../app.component.css"]
})
export class PurchaseDetailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {
  	this.activatedRoute.paramMap.subscribe(params => console.log(params))
  }

  ngOnInit() {
  }

}
