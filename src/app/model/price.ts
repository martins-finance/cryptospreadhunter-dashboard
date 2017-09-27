import { Currency } from './currency';
import { Base } from './base';
import { Exchange } from './exchange';
import { Operation } from './operation';

export class Price {
  id: string;
  exchange: Exchange;
  operation: Operation;
  currency: Currency;
  base: Base;
  amount: number;
  time: Date;
}
