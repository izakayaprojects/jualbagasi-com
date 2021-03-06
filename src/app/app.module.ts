import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component";
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { CreateDestinationComponent } from './create-destination/create-destination.component';
import { MessageComponent } from './message/message.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { DialogEditTextComponent } from './dialog-edit-text/dialog-edit-text.component';
import { DialogEditDaterangeComponent } from './dialog-edit-daterange/dialog-edit-daterange.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    ProfileComponent,
    PurchaseDetailComponent,
    NavigationBarComponent,
    PurchaseOrderComponent,
    ManageOrdersComponent,
    OrderItemComponent,
    CreatePurchaseOrderComponent,
    CreateDestinationComponent,
    MessageComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    DialogEditTextComponent,
    DialogEditDaterangeComponent,
    DialogConfirmComponent
  ],
  imports: [
    BrowserModule,
    NgxWebstorageModule.forRoot(),
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  entryComponents: [
    CreateDestinationComponent, 
    DialogEditTextComponent, 
    DialogEditDaterangeComponent,
    DialogConfirmComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
