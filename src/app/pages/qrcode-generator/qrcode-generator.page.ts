import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import * as CryptoJs from 'crypto-js';
import * as JsBase64 from 'js-base64';
import { environment as env } from 'src/environments/environment';

const header = {
  "alg": "HS256",
  "typ": "JWT"
};

class PayloadItem {
  key: string;
  value: string | number ;
}

@Component({
  selector: 'app-qrcode-generator',
  templateUrl: 'qrcode-generator.page.html',
  styleUrls: ['qrcode-generator.page.scss']
})
export class QrcodeGeneratorPage {

  qrElementType: 'url' | 'canvas' | 'img' = 'canvas';
  qrValue: string = null;

  payloadItems: PayloadItem[] = [];

  constructor(
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  async onAddStringItem(): Promise<void> {

    const qrAlert = await this.alertController.create(
      {
        header: "Payload Item",
        inputs: [
          {
            name: 'key',
            label: 'Key',
            type: 'text',
            placeholder: 'Key'
          },
          {
            name: 'value',
            label: 'Value',
            type: 'text',
            placeholder: 'Value (string)'
          },
        ],
        buttons: [
          {
            text: 'Ok',
            handler: async (data) => {
              if (this.isKeyExist(data.key)) {
                const toast = await this.toastController.create({
                  message: 'Key existed!',
                  duration: 2000
                });
                await toast.present();
                return false;
              }
              if (!data.key || data.key.trim().length <= 0  ) {
                const toast = await this.toastController.create({
                  message: 'Key cannot be null!',
                  duration: 2000
                });
                await toast.present();
                return false;
              }
              if (!data.value || data.value.trim().length <= 0  ) {
                const toast = await this.toastController.create({
                  message: 'Value cannot be null!',
                  duration: 2000
                });
                await toast.present();
                return false;
              }
              const payloadItem = new PayloadItem;
              payloadItem.key = data.key;
              payloadItem.value = data.value as string;
              this.payloadItems.push(payloadItem);
            }
          }
        ]
      }
    );

    await qrAlert.present();
  }

  async onAddNumberItem(): Promise<void> {

    const qrAlert = await this.alertController.create(
      {
        header: "Payload Item",
        inputs: [
          {
            name: 'key',
            label: 'Key',
            type: 'text',
            placeholder: 'Key'
          },
          {
            name: 'value',
            label: 'Value',
            type: 'number',
            placeholder: 'Value (number)'
          },
        ],
        buttons: [
          {
            text: 'Ok',
            handler: async (data) => {
              if (this.isKeyExist(data.key)) {
                const toast = await this.toastController.create({
                  message: 'Key existed!',
                  duration: 2000
                });
                await toast.present();
                return false;
              }
              if (!data.key || data.key.trim().length <= 0  ) {
                const toast = await this.toastController.create({
                  message: 'Key cannot be null!',
                  duration: 2000
                });
                await toast.present();
                return false;
              }
              if (!data.value || data.value.trim().length <= 0  ) {
                const toast = await this.toastController.create({
                  message: 'Value cannot be null!',
                  duration: 2000
                });
                await toast.present();
                return false;
              }
              const payloadItem = new PayloadItem;
              payloadItem.key = data.key;
              payloadItem.value = +data.value as number;
              this.payloadItems.push(payloadItem);
            }
          }
        ]
      }
    );

    await qrAlert.present();
  }

  onRemoveLastItem(): void {
    this.payloadItems.pop();
  }

  onUpdateQr(): void {
    const payload = {};
    this.payloadItems.forEach(payloadItem => {
      payload[payloadItem.key] = payloadItem.value;
    });
    const base64UrlEncodedHeader = this.base64UrlEncode(JsBase64.encode(JSON.stringify(header)));
    const base64UrlEncodedPayload = this.base64UrlEncode(JsBase64.encode(JSON.stringify(payload)));
    const msg = base64UrlEncodedHeader + '.' + base64UrlEncodedPayload;
    const signature = CryptoJs.HmacSHA256(msg, env.secretSignKey).toString();
    this.qrValue = CryptoJs.AES.encrypt(msg + '.' + signature, env.secretEncKey).toString();
  }

  isKeyExist(key: string): boolean {
    return this.payloadItems.find( x => x.key === key)? true : false;
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  base64UrlEncode(base64Text: string) {
    return base64Text.replace( "+", "-").replace("/", "_").replace("=", "");
  }

}
