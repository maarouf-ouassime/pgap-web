import {Injectable} from '@angular/core';
import {WebSocketService} from './web.socket.service';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommunService {

  userDetailsId!: number;

  constructor(private webSocketService: WebSocketService, private toastService: ToastrService) {
  }

  getWebSocket(): any {
    return this.webSocketService.connect();
  }
  getToastService(): ToastrService {
    return this.toastService;
  }

  playNotificationAudio(): void {
    const audio = new Audio();
    audio.src = '../../../assets/audio/success.mp3';
    audio.load();
    audio.play();
  }
}
