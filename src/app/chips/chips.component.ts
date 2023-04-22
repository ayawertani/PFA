import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Constant } from '../constant';



@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent {
  type: string = '';
  @Input()
  title: string = '';
  @Input()
  data: any;
  label: string = '';
  items: string[] = [];

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER] as const;

  @Output()
  itemsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  ngOnInit() {
    if (this.type == Constant.question) {

    }
    this.label = this.title == 'Question' ? 'Enter questions' : 'Enter responses';
    console.log(this.data);
    this.title == 'Question' ? this.items.push(...this.data.questions) : this.items.push(...this.data.responses);
    this.itemsChanged.emit(this.items);

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    //console.log(typeof value);
    //console.log(value);
    // Add our fruit
    if (value) {
      this.items.push(value);
      this.itemsChanged.emit(this.items);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(qu: string): void {
    const index = this.items.indexOf(qu);

    if (index >= 0) {
      this.items.splice(index, 1);
      this.itemsChanged.emit(this.items);
    }
  }

  edit(item: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(item);
      return;
    }

    // Edit existing fruit
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items[index] = value;
      this.itemsChanged.emit(this.items);
    }
  }
}
