import { Component, OnInit, ViewChild, ViewChildren, } from '@angular/core';
import { ApiService } from '../api.service';
import { Subject } from 'rxjs/Subject';

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
    newEventMain: {};
    newEvent: {};
    newTicket: {};
    artistArray: {}[] = [];
    clientArray: {}[] = [];
    organiserArray: {}[] = [];
    venueArray: {}[] = [];
    ticketOfficeArray: {}[] = [];
    eventMainArray: {}[] = [];
    eventArray: {}[] = [];
    ticketArray: {}[] = [];
    artistPage: number = 1;
    clientPage: number = 1;
    organiserPage: number = 1;
    ticketOfficePage: number = 1;
    venuePage: number = 1;
    eventMainPage: number = 1;
    eventPage: number = 1;
    ticketPage: number = 1;
    artistSearch: string = '';
    clientSearch: string = '';
    organiserSearch: string = '';
    venueSearch: string = '';
    ticketOfficeSearch: string = '';
    eventMainSearch: string = '';
    eventSearch: string = '';
    ticketSearch: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
      this.refresh();
  }

  onNewArtistSubmit() {
      console.log(this.newArtist);
      this.apiService.postArtists(this.newArtist)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateArtistSubmit(obj: any) {
      console.log(obj);
      this.apiService.putArtists(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteArtist(id: number) {
      console.log(id);
      this.apiService.deleteArtists(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onNewClientSubmit() {
      console.log(this.newClient);
      this.apiService.postClients(this.newClient)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateClientSubmit(obj: any) {
      console.log(obj);
      this.apiService.putClients(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteClient(id: number) {
      console.log(id);
      this.apiService.deleteClients(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onNewOrganiserSubmit() {
      console.log(this.newOrganiser);
      this.apiService.postOrganisers(this.newOrganiser)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateOrganiserSubmit(obj: any) {
      console.log(obj);
      this.apiService.putOrganisers(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteOrganiser(id: number) {
      console.log(id);
      this.apiService.deleteOrganisers(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onNewTicketOfficeSubmit() {
      console.log(this.newTicketOffice);
      this.apiService.postTicketOffices(this.newTicketOffice)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateTicketOfficeSubmit(obj: any) {
      console.log(obj);
      this.apiService.putTicketOffices(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteTicketOffice(id: number) {
      console.log(id);
      this.apiService.deleteTicketOffices(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onNewVenueSubmit() {
      console.log(this.newVenue);
      this.apiService.postVenues(this.newVenue)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateVenueSubmit(obj: any) {
      console.log(obj);
      this.apiService.putVenues(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteVenue(id: number) {
      this.apiService.deleteVenues(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
      console.log(id);
  }

  onNewEventMainSubmit() {
      console.log(this.newEventMain);
      this.apiService.postEventsMain(this.newEventMain)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateEventMainSubmit(obj: any) {
      console.log(obj);
      this.apiService.putEventsMain(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteEventMain(id: number) {
      console.log(id);
      this.apiService.deleteEventsMain(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onNewEventSubmit() {
      console.log(this.newEvent);
      this.apiService.postEvents(this.newEvent)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateEventSubmit(obj: any) {
      console.log(obj);
      this.apiService.putEvents(obj)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onDeleteEvent(id: number) {
      console.log(id);
      this.apiService.deleteEvents(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onNewTicketSubmit() {
      console.log(this.newTicket);
      this.apiService.postTickets(this.newTicket)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  onUpdateTicketSubmit(obj:any) {
      console.log(obj);
      this.apiService.putTickets(obj)
          .subscribe(data => { console.log(data); this.refresh();}, err => console.log(err));
  }

  onDeleteTicket(id: number) {
      console.log(id);
      this.apiService.deleteTickets(id)
          .subscribe(data => { console.log(data); this.refresh(); }, err => console.log(err));
  }

  refresh() {
      this.newArtist = { name: '', category: '', phone: '' };
      this.newClient = { first_name: '', last_name: '', phone: '' };
      this.newOrganiser = { name: '', www: '' };
      this.newTicketOffice = { address: '', hours: '', o_id: 1 };
      this.newVenue = { name: '', address: '', capacity_1: 100, capacity_2: 200, capacity_3: 300 };
      this.newEventMain = { o_id: 1, name: '', description: '', cost: 0, artists: [] };
      this.newEvent = { e_id: 1, v_id: 1, fee: 100, starts: '', ends: '' };
      this.newTicket = { ei_id: null, c_id: null, ticket_class: 1 };
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
      this.apiService.getEventsMain()
          .subscribe(data => {
              for (let j = 0; j < data.length; j++) {
                  data[j].artists = (data[j].artists != null) ? data[j].artists.split(",").map(Number) : null;
                  data[j].og_artists = data[j].artists;
              }
              console.log(data);
              this.eventMainArray = data;
          }, err => console.log(err));
      this.apiService.getEventsAdmin()
          .subscribe(data => {
              console.log(data);
              this.eventArray = data;
          }, err => console.log(err));
      this.apiService.getTickets()
          .subscribe(data => {
              console.log(data);
              this.ticketArray = data;
          }, err => console.log(err));
  }
}
