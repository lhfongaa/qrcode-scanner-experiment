import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrcodeGeneratorPage } from './qrcode-generator.page';

import { QrcodeGeneratorPageRoutingModule } from './qrcode-generator-routing.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QrcodeGeneratorPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [QrcodeGeneratorPage]
})
export class QrcodeGeneratorPageModule {}
