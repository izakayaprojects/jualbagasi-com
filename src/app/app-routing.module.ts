import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PurchaseDetailComponent } from "./purchase-detail/purchase-detail.component"
import { ProfileComponent } from './profile/profile.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component"
import { AuthGuard } from './auth-guard';

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "purchaseorder/:id", component: PurchaseDetailComponent },
  { path: "my-orders", component: ManageOrdersComponent, canActivate: [AuthGuard] },
  { path: "new-order", component: CreatePurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: "confirm", component: ConfirmEmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
