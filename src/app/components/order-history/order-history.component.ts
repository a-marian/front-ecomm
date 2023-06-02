import { Component, OnInit } from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();


}

  private handleOrderHistory() {
    //read user's email address from browser storage
    const customerEmail = JSON.parse(this.storage.getItem('userEmail') || '');
    //retrieve data from the service
    this.orderHistoryService.getOrderHistory(customerEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      });
  }

}
