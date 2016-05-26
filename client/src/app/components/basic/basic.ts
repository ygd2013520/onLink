import {Component, EventEmitter} from '@angular/core';
import {Input} from '@angular/core';

@Component ({
    selector: 'basic',
    template: require('./basic.html'),
    styles: [require('./basic.css')],
    providers: [],
    directives: [],
    pipes: [],
    outputs: ['value2Emitter']
})

export class Basic {
    @Input('parentValue') private value1 : string = 'default string';
    value2Emitter = new EventEmitter<string>();

    onValue2Change(value: string) {
        this.value2Emitter.emit(value);
        console.log("value2 emit");
    }
}
