export class Node {

  //selected:string= null;
  expanded = false;

  constructor(public name:string,
              public directories:Array<Node>) {
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  getIcon() {
    if (this.expanded) {
      return '-';
    }
    return '+';
  }
}
