import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {Observer} from 'rxjs/Rx';
import {Price} from './price';


@Injectable()
export class PriceService {

  public prices: Observable<Price>;

  private ws$: Subject<Price>;

  constructor() {
//    const exampleSocket = new WebSocket(WS_URL);
//    exampleSocket.onmessage = function (event) {
//      console.log(event.data);
//    };

//    this.ws$ = Observable.webSocket(WS_URL);
//    this.ws$.subscribe(
//        (msg) => console.log('message received: ' + msg),
//        (err) => console.log(err),
//        () => console.log('complete')
//      );
//    this.ws$.subscribe( value => console.log('observer 1 received ' + value));
//
//    this.prices = makeHot(this.ws$).map(parseFrame).filter(m => m != null);
  }

}

function parseFrame(price: Price): Price {
  console.log(price);
    return price;
}

function makeHot<T>(cold: Observable<T>): Observable<T> {
    const subject = new Subject();
    let refs = 0;
    return Observable.create((observer: Observer<T>) => {
        let coldSub: Subscription;
        if (refs === 0) {
            coldSub = cold.subscribe(o => subject.next(o));
        }
        refs++;
        const hotSub = subject.subscribe(observer);
        return () => {
            refs--;
            if (refs === 0) {
                coldSub.unsubscribe();
            }
            hotSub.unsubscribe();
        };
    });
}
