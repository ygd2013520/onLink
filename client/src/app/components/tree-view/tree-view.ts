import {Component, Input} from '@angular/core';
import {Node} from './node';
import {TreeViewCore} from './tree-view-core';

@Component({
  selector: 'tree-view',
  template: `
    <tree-view-core [directories]="node.directories"></tree-view-core>
  `,
  directives: [TreeViewCore]
})

export class TreeView {
  @Input('node') nodeJSON:Object;       //node object JSON representation
  private node:Node;                     //node object

  constructor() {
  }

  parseNode(json):Node {
    var node = new Node(json.name, []);
    if ('children' in json) {
      for (let i = 0; i < json.children.length; i++) {
        node.directories.push(this.parseNode(json.children[i]));
      }
    }
    return node;
  };

  ngOnInit() {
    this.node = this.parseNode(this.nodeJSON);
  }
}
