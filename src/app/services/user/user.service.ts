import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { StorageService } from '../storage/storage.service';

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
  ) { 
    this.userCollection = this.angularFirestore.collection('users')
  }

  async login(){
    try {
      // TODO: Autenticar con google
      // const responseGoogle = await this.angularFireAuth.signInWithPopup(new  GoogleAuthProvider())

      const responseGoogle = await GoogleAuth.signIn()
      const profile = responseGoogle
      // TODO: Buscar usuario por email
      this.userCollection = this.angularFirestore.collection<IUser>('users', (ref => ref.where('email', '==', profile.email).limit(1)))
      const users = await firstValueFrom(this.userCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => a.payload.doc.data() as IUser))
      ))

      console.log({users});
      
      
      if(users && users.length > 0){
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
          profileImage: profile.imageUrl,
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
            throw error      
    }
  }

  getStatus(): Promise<any>{
    return new Promise(async(resolve, reject) => {
      const currentUser = await this.storageService.get('currentUser')
      console.log({currentUser});
      if(currentUser){
        resolve(currentUser)
      } else {
        reject(false)
      }
    })
  }

  async getUserData(){
    try {
      const userStatus = await this.getStatus()
      this.angularFirestore.collection<IUser>('users', (ref => ref.where('email', '==', userStatus?.email).limit(1)))
      const users = await firstValueFrom(this.userCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => a.payload.doc.data() as IUser))
      ))
      if(users.length > 0){
        this.userSubject.next(users[0])
        return users[0]
      } else {
        return null
      }
    } catch (error) {
      throw error
    }
  }

  logOut(){

  }
}
