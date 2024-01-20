import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private isNative = Capacitor.isNativePlatform()
  constructor(private storage: Storage) {
    if(this.isNative){
      this.init();
    }
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    if(this.isNative){
      this._storage?.set(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  public get(key: string) {
    if(this.isNative){
      return this._storage?.get(key);
    } else {
      return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null
    }
  }

  public remove(key: string) {
    if(this.isNative){
      return this._storage?.remove(key);
    } else {
      return localStorage.removeItem(key)
    }
  }
}
