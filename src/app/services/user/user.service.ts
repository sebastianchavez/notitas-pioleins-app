import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { StorageService } from '../storage/storage.service';
import { Capacitor } from '@capacitor/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<IUser>
  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null)
  user = this.userSubject.asObservable()

  constructor(
    private angularFirestore: AngularFirestore,
    private storageService: StorageService,
    private angularFireAuth: AngularFireAuth,
    private angularFireStorage: AngularFireStorage
  ) {
    this.userCollection = this.angularFirestore.collection('users')
  }

  async login() {
    try {
      const isNative = Capacitor.isNativePlatform()
      let responseGoogle
      // TODO: Autenticar con google
      // alert(isNative)
      // responseGoogle = (await this.angularFireAuth.signInWithPopup(new  GoogleAuthProvider())).additionalUserInfo?.profile
      if(isNative){
          responseGoogle = await GoogleAuth.signIn()
        } else {
          responseGoogle = (await this.angularFireAuth.signInWithPopup(new  GoogleAuthProvider())).additionalUserInfo?.profile
        }

      const profile: any = responseGoogle
      
      // TODO: Buscar usuario por email
      this.userCollection = this.angularFirestore.collection<IUser>('users', (ref => ref.where('email', '==', profile.email).limit(1)))
      const users = await firstValueFrom(this.userCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => a.payload.doc.data() as IUser))
      ))

      if (users && users.length > 0) {
        // TODO: Si usuario existe, retornar promesa resuelta
        this.userSubject.next(users[0])
        this.storageService.set('currentUser', users[0])
        await this.storageService.get('currentUser')
        return true
      } else {
        // TODO: Si usuario no existe Registrar usuario
        const idUser = this.angularFirestore.createId()
        const user: IUser = {
          idUser,
          email: profile.email,
          name: profile.name,
          profileImage: profile.imageUrl || profile.picture,
          state: 'enabled',
          typeAuthentication: 'google',
          createdAt: Date.now(), // Date
          updatedAt: Date.now()
        }
        this.userSubject.next(user)
        this.storageService.set('currentUser', user)
        await this.storageService.get('currentUser')
        return this.userCollection.doc(idUser).set(user)
      }
    } catch (error) {
      alert(JSON.stringify(error))
      throw error
    }
  }

  getStatus(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const currentUser = await this.storageService.get('currentUser')
      if (currentUser) {
        resolve(currentUser)
      } else {
        reject(false)
      }
    })
  }

  async getUserData() {
    try {
      const userStatus = await this.getStatus()
      this.angularFirestore.collection<IUser>('users', (ref => ref.where('email', '==', userStatus?.email).limit(1)))
      const users = await firstValueFrom(this.userCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => a.payload.doc.data() as IUser))
      ))
      if (users.length > 0) {
        this.userSubject.next(users[0])
        return users[0]
      } else {
        return null
      }
    } catch (error) {
      throw error
    }
  }

  async updateUserDate(user: IUser): Promise<any>{
    try {
      const response = await this.userCollection.doc(user.idUser).set(user)
      this.userSubject.next(user)
      return response
    } catch (error) {
      throw error
    }
  }

  updatePicture(name: string, image: string, userId: string){
    return this.angularFireStorage.ref(`pictures/${userId}/profile/${name}`).putString(image, 'data_url')
  }

  getDownloadUrl(name: string, userId: string): Promise<any> {
    return firstValueFrom(this.angularFireStorage.ref(`pictures/${userId}/profile/${name}`).getDownloadURL())
  }

  logOut() {

  }
}
