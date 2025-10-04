# object-recipes: Angular + rxjs example

This example was created on Angular v20.3.0, and rxjs v7.8.0.

```ts
/* src/state/person.ts  */  

import { entity, Recipe, Shape } from 'object-recipes';
import { BehaviorSubject } from 'rxjs';

export const personEntity = entity({
  name: 'John Doe',
  age: 20,
  address: {
    street: 'Some street 99',
    zip: 1000,
    country: 'Some country',
  },
});

export const setNameAgeAction = (
  values: Partial<Pick<Shape<typeof personEntity>, 'name' | 'age'>>
): Recipe<typeof personEntity> =>
  (entity) => entity.set(values);

export const setAddressAction = (
  values: Partial<Shape<typeof personEntity>['address']>
): Recipe<typeof personEntity> =>
  (entity) =>
    entity.set({
      address: { ...entity.get().address, ...values },
    });

export const personState = new BehaviorSubject(personEntity);
```

```ts
/* src/person.ts */

/* eslint-disable import/no-deprecated */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { personState, setNameAgeAction, setAddressAction } from './store/person';

@Component({
  selector: 'person-behavior-subject-component',
  imports: [CommonModule, FormsModule],
  template: `
  Hello! {{ name$ | async }}
  <br />
  {{ address$ | async | json }}
  <br /><br />
  Name:
  <input
    type="text"
    [ngModel]="name$ | async"
    (ngModelChange)="setName($event)"
  /><br />
  Age:
  <input
    type="number"
    [ngModel]="age$ | async"
    (ngModelChange)="setAge($event)"
  /><br />
  <br />
  <br />
  <b>Address</b>
  <br />
  Street: 
  <input
    type="text"
    [ngModel]="(address$ | async)?.street"
    (ngModelChange)="setAddress({ street: $event })"
  /><br />
  Zip:
  <input
    type="text"
    [ngModel]="(address$ | async)?.zip"
    (ngModelChange)="setAddress({ zip: $event })"
  /><br />
  Country: 
  <input
    type="text"
    [ngModel]="(address$ | async)?.country"
    (ngModelChange)="setAddress({ country: $event })"
  /><br />
  `,
})

export class PersonBehaviorSubjectComponent {
  private person = personState;
  private person$ = this.person.asObservable(); 

  name$ = this.person$.pipe(
    map((entity) => entity.get().name)
  );

  age$ = this.person$.pipe(
    map((entity) => {
      const age = entity.get().age;

      return isNaN(age) ? '' : age.toString();
    })
  );

  address$ = this.person$.pipe(
    map((entity) => entity.get().address)
  );

  setName(name: string) {
    this.person.next(
      this.person.value.recipe(
        setNameAgeAction({ name })
      )
    );
  }

  setAge(age: string) {
    this.person.next(
      this.person.value.recipe(
        setNameAgeAction({ age: parseInt(age) })
      )
    );
  }

  setAddress(address: Parameters<typeof setAddressAction>[0]) {
    this.person.next(
      this.person.value.recipe(
        setAddressAction(address)
      )
    );
  }
}
```
