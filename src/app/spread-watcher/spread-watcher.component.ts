import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

import { Price } from '../model/price';
import { Exchange } from '../model/exchange';
import { Operation } from '../model/operation';
import { Currency } from '../model/currency';

import { TradeOption } from './trade-option';

@Component({
  providers: [StompService],
  selector: 'app-spread-watcher',
  templateUrl: './spread-watcher.component.html',
  styleUrls: ['./spread-watcher.component.css']
})
export class SpreadWatcherComponent implements OnInit, OnDestroy {
  public currency: string = Currency[Currency.USD];
  private currencies: Currency[] =  Object.values(Currency).slice(0, Object.values(Currency).length / 2);
  private exchanges: string[] =  Object.values(Exchange).slice(0, Object.values(Exchange).length / 2);
  private bases: string[] =  Object.values(Currency).slice(0, Object.values(Currency).length / 2);

  public tradeOptions: TradeOption[];
  public tradeOptionsIndex: Map<string, TradeOption>;

  public pricesMap: Map<string, number>;

  // Stream of messages
  private subscription: Subscription;
  public messages: Observable<Message>;

  // Subscription status
  public subscribed: boolean;

  constructor(private _stompService: StompService) {
    this.pricesMap = new Map<string, number>();
    this.tradeOptions = [];
    this.tradeOptionsIndex = new Map<string, TradeOption>();

    for (const _origin of this.exchanges) {
      for (const _destiny of this.exchanges) {
        if (_origin !== _destiny) {
          for (const _base of this.bases) {
            const tradeOption: TradeOption = {
              base: _base,
              origin: _origin,
              destiny: _destiny,
              originAmount: this.pricesMap.get(this.currency + _origin + _base + Operation[Operation.BUY]),
              destinyAmount: this.pricesMap.get(this.currency + _destiny + _base + Operation[Operation.SELL]),
              spread: 0
            };
            this.tradeOptions.push(tradeOption);
            this.tradeOptionsIndex.set(_base + _origin + _destiny, tradeOption);
          }
        }
      }
    }
  }

  ngOnInit() {
    this.subscribed = false;

    // Store local reference to Observable
    // for use with template ( | async )
    this.subscribe();
  }

  public subscribe() {
    if (this.subscribed) {
      return;
    }

    // Stream of messages
    this.messages = this._stompService.subscribe('/topic/prices');

    // Subscribe a function to be run on_next message
    this.subscription = this.messages.filter(message => JSON.parse(message.body).currency === this.currency).subscribe(this.on_next);

    this.subscribed = true;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    // This will internally unsubscribe from Stomp Broker
    // There are two subscriptions - one created explicitly, the other created in the template by use of 'async'
    this.subscription.unsubscribe();
    this.subscription = null;
    this.messages = null;

    this.subscribed = false;
  }

  /** Consume a message from the _stompService */
  public on_next = (message: Message) => {
    const price: Price = JSON.parse(message.body);
    console.log(price);
    if (price.operation.toString() === Operation[Operation.BUY]) {
      for (const _destiny of this.exchanges) {
        const tradeOption: TradeOption = this.tradeOptionsIndex.get(price.base.toString() + price.exchange.toString() + _destiny);
        if (tradeOption !== undefined) {
          tradeOption.originAmount = price.amount;
          tradeOption.spread = tradeOption.destinyAmount - tradeOption.originAmount;
        }
      }
    } else {
      for (const _origin of this.exchanges) {
        const tradeOption: TradeOption = this.tradeOptionsIndex.get(price.base.toString() + _origin + price.exchange.toString());
        if (tradeOption !== undefined) {
          tradeOption.destinyAmount = price.amount;
          tradeOption.spread = tradeOption.destinyAmount - tradeOption.originAmount;
        }
      }
    }
  }
}
