export class TradeOption {
  public base: string;
  public origin: string;
  public destiny: string;
  public spread: number;

  set originAmount(_amount: number) {
    this.originAmount = _amount;
  }

  set destinyAmount(_amount: number) {
    this.destinyAmount = _amount;
  }

}
