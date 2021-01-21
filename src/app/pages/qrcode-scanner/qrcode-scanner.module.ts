import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrcodeScannerPage } from './qrcode-scanner.page';

import { QrcodeScannerPageRoutingModule } from './qrcode-scanner-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QrcodeScannerPageRoutingModule
  ],
  declarations: [QrcodeScannerPage]
})
export class QrcodeScannerPageModule {}
