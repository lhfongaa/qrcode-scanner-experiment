import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'qrcode-scanner',
        loadChildren: () => import('../qrcode-scanner/qrcode-scanner.module').then(m => m.QrcodeScannerPageModule)
      },
      {
        path: 'qrcode-generator',
        loadChildren: () => import('../qrcode-generator/qrcode-generator.module').then(m => m.QrcodeGeneratorPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/qrcode-scanner',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/qrcode-scanner',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
