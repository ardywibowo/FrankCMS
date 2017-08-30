import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Category } from './../../../../../both/models/artwork.model';

import { Expose } from '../../../../../both/models/expose.model';
import { Exposes } from '../../../../../both/collections/exposes.collection';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import template from './artwork-expose.component.html';
import style from './artwork-expose.component.scss';

@Component({
  selector: 'artwork-expose',
  template,
  styles: [style]
})
export class ArtworkExposeComponent { 
  @Input() category: Category = Category.Any;
  @Input() backgroundImage: string;
  constructor () { }
}

import templatePhoto from './photo-expose.component.html';
import templateSculpture from './sculpture-expose.component.html';
import templateTravel from './travel-expose.component.html';
import templateWriting from './writing-expose.component.html';

@Component({
  selector: 'photo-expose',
  template: templatePhoto
})
export class PhotoExposeComponent implements OnInit, OnDestroy { 
  public Category = Category;
  description: string = '';
  exposesSub: Subscription;
  ngOnInit() {
    this.exposesSub = MeteorObservable.subscribe('exposes').subscribe(() => {

      let expose = Exposes.findOne({category: Category.Photography});
      this.description = expose.description;
    });
  }
  ngOnDestroy() {
    this.exposesSub.unsubscribe();
  }
}

@Component({
  selector: 'sculpture-expose',
  template: templateSculpture
})
export class SculptureExposeComponent implements OnInit, OnDestroy { 
  public Category = Category;
  description: string = '';
  exposesSub: Subscription;
  ngOnInit() {
    this.exposesSub = MeteorObservable.subscribe('exposes').subscribe(() => {

      let expose = Exposes.findOne({category: Category.Sculpture});
      this.description = expose.description;
    });
  }
  ngOnDestroy() {
    this.exposesSub.unsubscribe();
  }
}

@Component({
  selector: 'travel-expose',
  template: templateTravel
})
export class TravelExposeComponent implements OnInit, OnDestroy { 
  public Category = Category;
  description: string = '';
  exposesSub: Subscription;
  ngOnInit() {
    this.exposesSub = MeteorObservable.subscribe('exposes').subscribe(() => {

      let expose = Exposes.findOne({category: Category.Travels});
      this.description = expose.description;
    });
  }
  ngOnDestroy() {
    this.exposesSub.unsubscribe();
  }
}

@Component({
  selector: 'writing-expose',
  template: templateWriting
})
export class WritingExposeComponent implements OnInit, OnDestroy { 
  public Category = Category;
  description: string = '';
  exposesSub: Subscription;
  ngOnInit() {
    this.exposesSub = MeteorObservable.subscribe('exposes').subscribe(() => {

      let expose = Exposes.findOne({category: Category.Writing});
      this.description = expose.description;
    });
  }
  ngOnDestroy() {
    this.exposesSub.unsubscribe();
  }
}
