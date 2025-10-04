# object-recipes: Angular + signals example

This example was created on Angular v20.3.0.

```ts
/* src/state/person.ts  */  

import { entity, Recipe, Shape } from 'object-recipes';
import { signal } from '@angular/core';

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

export const personSignal = signal(personEntity);
```

```ts
/* src/person.ts */

/* eslint-disable import/no-deprecated */
import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { personSignal, setNameAgeAction, setAddressAction } from './store/person';

@Component({
  selector: 'person-signal-component',
  imports: [CommonModule, FormsModule],
  template: `
  Hello! {{ name() }}
  <br />
  {{ address() | json }}
  <br /><br />
  Name:
  <input
    type="text"
    [ngModel]="name()"
    (ngModelChange)="setName($event)"
  /><br />
  Age:
  <input
    type="number"
    [ngModel]="age()"
    (ngModelChange)="setAge($event)"
  /><br />
  <br />
  <br />
  <b>Address</b>
  <br />
  Street: 
  <input
    type="text"
    [ngModel]="address().street"
    (ngModelChange)="setAddress({ street: $event })"
  /><br />
  Zip:
  <input
    type="text"
    [ngModel]="address().zip"
    (ngModelChange)="setAddress({ zip: $event })"
  /><br />
  Country: 
  <input
    type="text"
    [ngModel]="address().country"
    (ngModelChange)="setAddress({ country: $event })"
  /><br />
  `,
})

export class PersonSignalComponent {
  private person = personSignal;

  name = computed(() => this.person().get().name);

  age = computed(() => {
    const age = this.person().get().age;
    return isNaN(age) ? '' : age.toString();
  });

  address = computed(() => this.person().get().address);

  setName(name: string) {
    this.person.update(
      setNameAgeAction({ name })
    );
  }

  setAge(age: string) {
    this.person.update(
      setNameAgeAction({ age: parseInt(age) })
    );
  }

  setAddress(address: Parameters<typeof setAddressAction>[0]) {
    this.person.update(
        setAddressAction(address)
    );
  }
}
```
