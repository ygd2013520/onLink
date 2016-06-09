import {Component, Input} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {Node} from './node';

@Component({
  selector: 'tree-view-core',
  template: `
    <div *ngFor="let dir of directories">
      <div *ngIf="dir.directories.length != 0">

        <button type="button" class="btn btn-default btn-block" (click)="dir.toggle()">
          <span *ngFor="let i of dir.getDepthArray()"  class="pull-left" style="white-space: pre">    </span>
          <span class="pull-left"> {{ dir.name }} </span>
          <span class="glyphicon {{ dir.expanded ? 'glyphicon-minus' : 'glyphicon-plus'}} pull-right" aria-hidden="true"></span>
        </button>

        <div *ngIf="dir.expanded">
          <tree-view-core [directories]="dir.directories"></tree-view-core>
        </div>
      </div>

      <div *ngIf="dir.directories.length == 0">
        <button type="button" class="btn btn-default btn-block" (click)="sel_file(dir.name)">
          <span *ngFor="let i of dir.getDepthArray()"  class="pull-left" style="white-space: pre">    </span>
          <span class="pull-left"> {{ dir.name }} </span>
        </button>
      </div>
    </div>
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
