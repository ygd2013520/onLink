export class Node {

  //selected:string= null;
  expanded = false;

  constructor(public name:string,
              public display: string,
              public depth: number,
              public directories:Array<Node>) {
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  // choose to return an array instead of this.depth, because angular2 *ngFor support array only
  getDepthArray() {
    return new Array(Math.max(this.depth, 0));
  }
}
