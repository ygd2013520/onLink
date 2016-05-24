import {Component, Input} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {Node} from './node';

@Component({
  selector: 'tree-view-core',
  template: `
    <ul>
    <li *ngFor="let dir of directories">
      <div *ngIf="dir.directories.length != 0">
        <span class="iconButton" (click)="dir.toggle()">{{dir.getIcon()}}</span>
        <a class="iconButton" (click)="dir.toggle()"> {{ dir.name }} </a>
        <div *ngIf="dir.expanded">
          <tree-view-core [directories]="dir.directories"></tree-view-core>
        </div>
      </div>

      <div *ngIf="dir.directories.length == 0">
        <a (click)="sel_file(dir.name)">{{dir.name}}</a>
      </div>
    </li>
    </ul>
   `,
  directives: [TreeViewCore]
})


export class TreeViewCore {
  @Input() directories:Array<Node>;

  constructor(private _router:Router) {
  }

  sel_file(file) {
    this._router.navigate([file]);
  }


  ngOnInit() {
  }

}
