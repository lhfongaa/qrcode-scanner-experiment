import { Component } from '@angular/core';
import { Chooser } from '@ionic-native/chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import * as CryptoJs from 'crypto-js';
import * as JsBase64 from 'js-base64';
import * as Lzutf8 from 'lzutf8';
import { environment as env } from 'src/environments/environment';

class PayloadItem {
  key: string;
  value: any ;
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
    public toastController: ToastController,
    private chooser: Chooser,
    private file: File
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

  onUpdateQr(doCompress: boolean = false): void {
    const payload = {};
    const header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    this.payloadItems.forEach(payloadItem => {
      payload[payloadItem.key] = payloadItem.value;
    });
    payload['secret'] = env.secretSignKey;
    //const base64UrlEncodedHeader = this.base64UrlEncode(JsBase64.encode(JSON.stringify(header)));
    //const base64UrlEncodedPayload = this.base64UrlEncode(JsBase64.encode(JSON.stringify(payload)));
    //const msg = base64UrlEncodedHeader + '.' + base64UrlEncodedPayload;
    //const signature = CryptoJs.HmacSHA256(msg, env.secretSignKey).toString();
    //this.qrValue = Lzutf8.compress(CryptoJs.AES.encrypt(msg + '.' + signature, env.secretEncKey).toString(), {outputEncoding: "Base64"}) ;
    if (doCompress) {
      this.qrValue = CryptoJs.AES.encrypt(Lzutf8.compress(JSON.stringify(payload), {outputEncoding: "Base64"}), env.secretEncKey).toString();
    } else {
      this.qrValue = CryptoJs.AES.encrypt(JsBase64.encode(JSON.stringify(payload)), env.secretEncKey).toString();
    }
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

  async onImportJsonFile(): Promise<void> {

    await this.chooser.getFile("application/json").then(
      async (file) => {
        if (file.data) {
          const result =JSON.parse(String.fromCharCode.apply(null, new Uint8Array(file.data)));
          this.payloadItems = [];
          Object.keys(result).forEach( key => {
            const payloadItem = new PayloadItem();
            payloadItem.key = key;
            payloadItem.value = result[key];
            console.log(JSON.stringify(payloadItem));
            this.payloadItems.push(payloadItem);
          });
        } else {
          const toast = await this.toastController.create({
            message: 'Empty Json File',
            duration: 2000
          });
          await toast.present();
        }
      },
      err => {
        console.error("error in importing json file", err);
      }
    );
  }

  getStringifyValue(value: any): string {
    return JSON.stringify(value);
  }

}
