import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopupboxService } from '../../../services/popupbox.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css'],
})
export class AlertBoxComponent implements OnInit {
  clickEventSubscription: Subscription | undefined;

  logoutValue: String | undefined;
  popupBoxheader = '';
  popupBoxmsg = '';
  popupbutton = '';

  constructor(private popup: PopupboxService) {
    this.clickEventSubscription = this.popup
      .getClickEvent()
      .subscribe((result) => {
        if (result == true) {
          this.logoutValue = 'user';
          this.openAlertBox();
        }
      });

    this.popup.sellerGetClickEvent().subscribe((result) => {
      if (result == true) {
        this.logoutValue = 'seller';
        this.openAlertBox();
      }
    });

    this.popup.productpopupEvent().subscribe((result) => {
      if (result == true) {
        this.logoutValue = 'product';
        this.openAlertBox();
      }
    });
  }
  @Output() userLogoutEvent = new EventEmitter<boolean>();

  ngOnInit(): void {}
  openAlertBox() {
    if (this.logoutValue == 'user' || this.logoutValue == 'seller') {
      this.popupBoxheader = 'Confirma Desconexión';
      this.popupBoxmsg = 'Esta seguro de querer desconectarse?';
      this.popupbutton = 'Desconectarse';
    } else if (this.logoutValue == 'product') {
      this.popupBoxheader = 'Confirmar Eliminación';
      this.popupBoxmsg = 'Esta seguro que desea Eliminarlo?';
      this.popupbutton = 'Eliminar';
    }
    const id = document.getElementById('myModal');
    if (id) {
      id.style.display = 'block';
    }
  }

  closePopup() {
    const id = document.getElementById('myModal');
    if (id) {
      id.style.display = 'none';
    }
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  logout() {
    if (this.logoutValue == 'user') {
      this.popup.ueserLogout();
    } else if (this.logoutValue == 'seller') {
      this.popup.sellerLogout();
    } else if (this.logoutValue == 'product') {
      this.popup.deleteProduct();
    }

    this.closePopup();
  }
}
