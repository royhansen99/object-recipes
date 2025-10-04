# object-recipes: Angular + NgRx example

This example was created on Angular v20.3.0, and NgRx v20.0.1.

```ts
/* src/state/person.ts  */  

import { Store, createReducer, createAction, on, props } from '@ngrx/store';
import { entity, Recipe, Shape } from 'object-recipes';

const personEntity = entity({
  name: 'John Doe',
  age: 20,
  address: {
    street: 'Some street 99',
    zip: 1000,
    country: 'Some country',
  },
});

export type PersonEntity = typeof personEntity;

export type Person = Shape<typeof personEntity>;

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

export const recipe = createAction(
  '[personEntity] recipe',
  props<{ recipe: Recipe<typeof personEntity> }>()
);

export const personReducer = createReducer(
  personEntity,
  on(recipe, (state, { recipe }) =>
    state.recipe(recipe)),
);
```

```ts
/* src/state/index.ts */
import { provideStore, provideState } from '@ngrx/store';
import { PersonEntity, personReducer } from './person';

export interface StoreState {
  person: PersonEntity; 
};

export const stateProvider = [
    provideStore<StoreState>(),
    provideState('person', personReducer),
];
```

```ts
/* src/app/app.config.ts */

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { stateProvider } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ...stateProvider,
  ]
};
```

```ts
/* src/person.ts */

/* eslint-disable import/no-deprecated */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreState } from './store';
import { recipe, setNameAgeAction, setAddressAction } from './store/person';

@Component({
  selector: 'person-component',
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

export class PersonComponent {
  store: Store<StoreState> = inject(Store<StoreState>);
  name$ = this.store.select(({ person }) => person.get().name);
  age$ = this.store.select(({ person }) => {
    const age = person.get().age;

    return isNaN(age) ? '' : age.toString();
  });
  address$ = this.store.select(({ person }) => person.get().address);
;

  setName(name: string) {
    this.store.dispatch(recipe({
      recipe: setNameAgeAction({ name })
    }));
  }

  setAge(age: string) {
    this.store.dispatch(recipe({
      recipe: setNameAgeAction({ age: parseInt(age) })
    }));
  }

  setAddress(address: Parameters<typeof setAddressAction>[0]) {
    this.store.dispatch(recipe({
      recipe: setAddressAction(address) 
    }));
  }
}
```
