import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  idLog: string = 'ProfilePage'
  profile?: IUser

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private actionSheetController: ActionSheetController,
    private logger: LoggerService,
  ) {
    this.setUserData()
   }

   async setUserData(){
    this.userService.user
    .subscribe(res => {
      if(res){
        this.profile = res
      }
    })
   }

  ngOnInit() {
  }

  async takePicture(){
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          cssClass: 'custom-class-action-sheet',
          text: 'Cámara',
          icon: 'camera',
          handler: () => {
            this.updateImage(CameraSource.Camera)
          }
        },
        {
          cssClass: 'custom-class-action-sheet',
          text: 'Album',
          icon: 'images', 
          handler: () => {
            this.updateImage(CameraSource.Photos)
          }
        }
      ]
    })
    await actionSheet.present()
  }

  async updateImage(source: CameraSource){
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source
    })

    const name = Date.now() + '.jpg'
    const imageBase64 = image.dataUrl!
    console.log({imageBase64, url: image.dataUrl});
    try {
      // TODO: Guardar imagen en storage
      await this.userService.updatePicture(name, imageBase64, this.profile!.idUser!)
      // TODO: Buscar URL de imagen en storage
      this.profile!.profileImage = await this.userService.getDownloadUrl(name, this.profile?.idUser!)
      // TODO: Guardar en base de datos
      this.profile!.updatedAt = Date.now()
      await this.userService.updateUserDate(this.profile!)
      this.logger.log(this.idLog, this.updateImage.name, {info: 'Success', profile: this.profile})
    } catch (error) {
      this.logger.error(this.idLog, this.updateImage.name, {info: 'Error', error})
    }
  }

  async updateUser(){
    try {
      const response = await this.userService.updateUserDate(this.profile!)
      this.logger.log(this.idLog, this.updateUser.name, {info: 'Success', response})
    } catch (error) {
      this.logger.error(this.idLog, this.updateUser.name, {info: 'Error', error})
    }
  }
}
