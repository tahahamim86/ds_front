import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data); 
  }
}
