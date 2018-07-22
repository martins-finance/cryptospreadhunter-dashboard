import { Currency } from './currency';
import { Exchange } from './exchange';
import { Operation } from './operation';

export class Price {
  id: string;
  exchange: Exchange;
  operation: Operation;
  currency: Currency;
  base: Currency;
  amount: number;
  time: Date;
}
