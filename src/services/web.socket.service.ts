import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import SockJs from 'sockjs-client';
import {environment} from "../environments/environment";


@Injectable()
export class WebSocketService {
  urlSocket = environment.SOCKET_ENDPOINT;
  // Open connection with the back-end socket
  public connect(): any {
    const socket = new SockJs(this.urlSocket);

    const stompClient = Stomp.over(socket);

    return stompClient;
  }
}
