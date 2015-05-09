// Based on python's itertools.count(N)

export default class Counter {
  private _current: number;
  public next: { (): number };

  constructor(initial:number) {
    this._current = (initial == null) ? 1 : initial;
    this.next = () => this._current++;
  }
}
