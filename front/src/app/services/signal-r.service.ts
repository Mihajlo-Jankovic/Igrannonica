import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  public connectionId : string;
  public data: string;
  configuration = new Configuration();

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.configuration.port + "/chatHub")
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  public addTransferDataListener = () => {
    this.hubConnection.on('ReceiveConnID', (data) => {
    });
  }

  public getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid').then(
      (data) => {
          this.connectionId = data;
          this.cookie.set("connID", this.connectionId);
        }
    ); 
  }

  public addTrainingDataListener = () => {
    this.hubConnection.on('trainingdata', (data) => {
      this.data = data;
    });
  }

  // public broadcastChartData = () => {
  //   this.hubConnection.invoke('broadcastchartdata', this.data, this.connectionId)
  //   .catch(err => console.error(err));
  // }
  // public addBroadcastChartDataListener = () => {
  //   this.hubConnection.on('broadcastchartdata', (data) => {
  //     this.bradcastedData = data;
  //   })
  // }

  constructor(private cookie : CookieService) { }
}
