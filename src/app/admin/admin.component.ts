import { Component, OnInit, ViewChild, ViewChildren, } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    newArtist: {};
    newClient: {};
    newOrganiser: {};
    newTicketOffice: {};
    newVenue: {};
    artistArray: {}[] = [];
    clientArray: {}[] = [];
    organiserArray: {}[] = [];
    venueArray: {}[] = [];
    ticketOfficeArray: {}[] = [];
    artistPage: number = 1;
    clientPage: number = 1;
    organiserPage: number = 1;
    ticketOfficePage: number = 1;
    venuePage: number = 1;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
      this.newArtist = { name: '', category: '', phone: '' };
      this.newClient = { first_name: '', last_name: '', phone: '' };
      this.newOrganiser = { name: '', www: '' };
      this.newTicketOffice = { address: '', hours: '', o_id: 1 };
      this.newVenue = { name: '', address: '', capacity_1: 100, capacity_2: 200, capacity_3: 300 };
      this.apiService.getArtists()
          .subscribe(data => {
              console.log(data);
              this.artistArray = data;
          }, err => console.log(err));
      this.apiService.getClients()
          .subscribe(data => {
              console.log(data);
              this.clientArray = data;
          }, err => console.log(err));
      this.apiService.getOrganisers()
          .subscribe(data => {
              console.log(data);
              this.organiserArray = data;
          }, err => console.log(err));
      this.apiService.getTicketOffices()
          .subscribe(data => {
              console.log(data);
              this.ticketOfficeArray = data;
          }, err => console.log(err));
      this.apiService.getVenues()
          .subscribe(data => {
              console.log(data);
              this.venueArray = data;
          }, err => console.log(err));
  }

  onNewArtistSubmit() {
      
  }

  onUpdateArtistSubmit(i: number) {
      console.log(this.artistArray[this.artistPage * 10 - 10 + i]);
  }

  onDeleteArtist(i: number) {

  }

  onNewClientSubmit() {

  }

  onUpdateClientSubmit(i: number) {
      console.log(this.clientArray[this.clientPage * 10 - 10 + i]);
  }

  onDeleteClient(i: number) {
  }

  onNewOrganiserSubmit() {

  }

  onUpdateOrganiserSubmit(i: number) {
      console.log(this.organiserArray[this.organiserPage * 10 - 10 + i]);
  }

  onDeleteOrganiser(i: number) {
  }

  onNewTicketOfficeSubmit() {

  }

  onUpdateTicketOfficeSubmit(i: number) {
      console.log(this.ticketOfficeArray[this.ticketOfficePage * 10 - 10 + i]);
  }

  onDeleteTicketOffice(i: number) {
  }

  onNewVenueSubmit() {

  }

  onUpdateVenueSubmit(i: number) {
      console.log(this.venueArray[this.venuePage * 10 - 10 + i]);
  }

  onDeleteVenue(i: number) {
  }

}
