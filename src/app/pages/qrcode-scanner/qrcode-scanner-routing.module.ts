import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrcodeScannerPage } from './qrcode-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: QrcodeScannerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodeScannerPageRoutingModule {}
