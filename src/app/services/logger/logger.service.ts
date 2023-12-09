import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A'){
    this.printLog(page, functionName, data, 'LOG')
  }

  warn(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A'){
    this.printLog(page, functionName, data, 'WARN')
  }

  error(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A'){
    this.printLog(page, functionName, data, 'ERROR')
  }

  private printLog(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A', type: 'LOG' | 'WARN' | 'ERROR' = 'LOG'){
    if(environment.debug){
      switch(type){
        case 'LOG':
          console.log('@@@@ Page[', page ,']', ' --Func[',  functionName ,'] -->[', data ,']');
          break;
        case 'WARN':
          console.warn('@@@@ Page[', page ,']', ' --Func[',  functionName ,'] -->[', data ,']');
          break;
        case 'ERROR':
          console.error('@@@@ Page[', page ,']', ' --Func[',  functionName ,'] -->[', data ,']');
          break;
      }
    }
  }
}
