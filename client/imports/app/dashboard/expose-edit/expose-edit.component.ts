import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { Exposes } from '../../../../../both/collections/exposes.collection';
import { Expose } from '../../../../../both/models/expose.model';

import { Category } from '../../../../../both/models/artwork.model';

import template from './expose-edit.component.html';
import style from './expose-edit.component.scss';

@Component({
  selector: 'expose-edit',
  template,
  styles: [style],
  providers: [MdSnackBar]
})
export class ExposeEditComponent implements OnInit, OnDestroy {
  exposeForm: FormGroup;
  currentCategory: Category = Category.Photography;
  showCoverArtModal: boolean = false;

  exposesSub: Subscription;

  constructor(
    private formBuilder: FormBuilder, private snackBar: MdSnackBar
  ) { }

  ngOnInit() {

    this.exposeForm = this.formBuilder.group({
      description: ["", Validators.required],
      category: [Category.Photography],
    });

    this.exposesSub = MeteorObservable.subscribe('exposes').subscribe(() => {
      let exposeExist: Expose = Exposes.findOne({category: this.currentCategory});
      let descriptionText: string;

      if (exposeExist != null) {
        descriptionText = exposeExist.description;
      } else {
        descriptionText = "";
      }

      this.exposeForm = this.formBuilder.group({
        description: [descriptionText, Validators.required],
        category: [Category.Photography],
      });
    });
  }

  ngOnDestroy() {
    this.exposesSub.unsubscribe();
  }

  selectCoverArt() {
    this.showCoverArtModal = true;
  }

  closeSelection() {
    this.showCoverArtModal = false;
  }

  setCoverArt(selectedArtworks: string[]) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to set the cover art', 'Close');
      return;
    }

    let exposeExist: Expose = Exposes.findOne({category: this.currentCategory});
    if (exposeExist != null) {
      Exposes.update(exposeExist._id, {
        $set: {
          coverArt: selectedArtworks[0]
        }
      });
    } else {
      Exposes.insert({
        description: this.exposeForm.value.description,
        category: this.exposeForm.value.category,
        coverArt: selectedArtworks[0]
      });
    }
    this.closeSelection();
  }

  changeCategory() {
    this.currentCategory = this.exposeForm.value.category;
    let exposeExist: Expose = Exposes.findOne({category: this.currentCategory})
    if (exposeExist != null) {
      this.exposeForm = this.formBuilder.group({
        description: [exposeExist.description, Validators.required],
        category: [this.currentCategory],
      });
    } else {
      this.exposeForm = this.formBuilder.group({
        description: ["", Validators.required],
        category: [this.currentCategory],
      });
    }
  }

  changeExpose() {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to change expose', 'Close');
      return;
    }

    if (this.exposeForm.valid) {
      let exposeExist = Exposes.findOne({category: this.currentCategory});

      if (exposeExist != null) {
        Exposes.update(exposeExist._id, {
          $set: {
            description: this.exposeForm.value.description
          }
        });
      } else {
        Exposes.insert({
          description: this.exposeForm.value.description,
          category: this.currentCategory,
          coverArt: null
        });
      }
    }
  }
}
