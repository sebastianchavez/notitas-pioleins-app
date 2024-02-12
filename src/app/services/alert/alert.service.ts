import { Injectable } from '@angular/core';
import { AlertController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
  ){}

  confirm(header: string, confirmText: string, cancelText: string): Promise<boolean>{
    return new Promise(async (resolve, reject) => {
      try {
        const alert = await this.alertController.create({
          header,
          buttons: [
            {
              text: confirmText,
              handler: () => {
                resolve(true)
              }
            },
            {
              text: cancelText,
              handler: () => {
                resolve(false)
              }
            }
          ]
        })
        await alert.present()
      } catch (error) {
        reject(error)
      }
    })
  }

  async alert(header: string, textButton: string){
    const alert = await this.alertController.create({
      header,
      buttons: [textButton]
    })
    await alert.present()
  }

  async toast(message: string, duration: number = 1500, position: "top" | "bottom" | "middle" | undefined = "bottom") {
    const toast = await this.toastController.create({
      message,
      duration,
      position
    })
    await toast.present()
  }
 
}
