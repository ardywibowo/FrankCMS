import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Artworks } from '../../../../../both/collections/artworks.collection';
import { Category } from '../../../../../both/models/artwork.model';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MdSnackBar } from '@angular/material';

import template from './artwork-add.component.html';
import style from './artwork-add.component.scss';

@Component({
  selector: 'artwork-add',
  template,
  styles: [style],
  providers: [MdSnackBar]
})
export class ArtworkAddComponent implements OnInit {
  addForm: FormGroup;
  images: string[] = [];
  files: string[] = [];
  
  constructor(
    private formBuilder: FormBuilder, private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      category: [Category.Photography],
      private: [false]
    });
  }

  addArtwork(): void {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to add an artwork', 'Close');
      return;
    }

    if (this.addForm.value.category == null || this.addForm.value.name == null || this.addForm.value.description == null || (this.images.length < 1 && this.files.length < 1)) {
      this.snackBar.open('Please fill in all fields to add your art', 'Close');
      return;
    }
    
    let privateValue: boolean;
    if(this.addForm.value.private == null) {
      privateValue = false;
    } else {
      privateValue = this.addForm.value.private;
    }

    if (this.addForm.valid) {
      Artworks.insert({
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        category: this.addForm.value.category,
        uploadDate: new Date(),
        images: this.images,
        files: this.files,
        private: privateValue
      });

      this.addForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        category: [this.addForm.value.category],
        images: [],
        files: [],
        private: [privateValue]
      });
      this.images = [];
      this.files = [];
    }
  }

  onFile(receivedEmission: any) {
    if (receivedEmission.isImage) { 
      this.images.push(receivedEmission.id);
    } else {
      this.files.push(receivedEmission.id);
    }
  }

}
