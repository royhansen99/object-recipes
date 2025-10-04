# object-recipes

This library provides a convenient and type-safe pattern to structure your code, by organizing updates into composable functions that can even be nested within eachother.

This can be useful when:
- you have a state object and you want to structure updates in a composable way.
- you have large deeply-nested objects with lots of actions/updates.

You can perform nested updates by specifying the entire nested-path as a string (arrays also supported!), and have it updated immutably. The string is type-checked!

This library includes full typings for projects that use typescript.
An object/entity is immutable, so making any changes will return a new object/entity.

Also a good alternative to `immer`, and much more lightweight!  
Can be used in combination with:
- `React useState()` [Example here](src/example/UseStateExample.tsx)
- `React useReducer()` [Example here](src/example/UseReducerExample.tsx)
- `Redux` [Example here](src/example/UseReducerExample.tsx)  
  (mostly only makes sense if using without RTK, because RTK already forces immer on you)
- `Jotai` [Example here](src/example/JotaiExample.tsx)
- `Zustand` [Example here](src/example/ZustandExample.tsx)
- `Angular + NgRx` [Example here](src/example/AngularNgRxExample.md)
- `Angular + rxjs` [Example here](src/example/AngularRxjsExample.md)
- `Angular + signals` [Example here](src/example/AngularSignalExample.md)
- anywhere else you can imagine! Doesn't need to be react or frontend-related!

**object-recipes is tiny**!: (Even this README is much bigger than the library itself)  
(minified at 2025/10/02)  
- index.es.js (es): 0.62 kB (gzip) 
- index.cjs.js (cjs): 0.59 kB (gzip) 
- index.iife.js (iife): 0.61 kB (gzip) 

### Installation

`npm i object-recipes`  
`yarn add object-recipes`  
`bun add object-recipes`

### Basic usage

```typescript
import { entity, Recipe, Shape } from 'object-recipes'

// Initialize the entity.
const person = entity({
  name: '',
  age: 0,
  address: { street: '', zip: 0, country: '' },
  activities: ['Skiing', 'Climbing', 'Skateboarding'],
});

// Retrieve the plain js-object.
// Note: If you modify this object directly, it will
// break immutability. If you plan to modify it directly
// you should instead use getClone() below.
person.get();

// Or retrieve a deep-copy of the plain object.
// This way the object is not in any way connected
// to the entity, since it is a deep-copy.
person.getClone();

// Update one or more fields on the entity.
// set() returns a new entity-instance with updated fields,
// without touching the original instance.
//
// Argument is type-safe and will give errors if invalid.
const update = person.set({ name: 'John Doe', age: 20 }).get();

// You can chain multiple operations in a row before calling get()
person.set({ name: 'John Doe' }).set({ age: 20 }).get();

// Update a single field in a nested path.
// setPath() returns a new entity-instance with updated fields,
// without touching the original instance.
//
// Both path and value are type-safe and will give errors if invalid.
const nestedUpdate = person.setPath('address.street', 'Teststreet 1').get();

// Update an array-item.
// Will change activities[0] from 'Skiing' to 'Downhill skiing'.
const arrayUpdate = person.setPath('activities[0]', 'Downhill skiing').get();

// Add new item to end of array.
// After the change, `activities` looks like this:
// ['Skiing', 'Climbing', 'Skateboarding', 'Fishing']
const arrayAddUpdate = person.setPath('activities[3]', 'Fishing').get();

// Defining a recipe.
const addressRecipe = (
  street: string, zip: number, country: string
): Recipe<typeof person> => (entity) => entity.set(
  { address: { street, zip, country } }
);

// Using the recipe on an entity to perform an update.
const recipeUpdate = person.recipe(
  addressRecipe('Teststreet 1', 1000, 'Norway')
);

// Use the `Shape` type to infer the type/structure of the underlying object.
// Result:
// {
//   name: string, age: number,
//   address: { street: string, zip: number, country: string },
//   activities: string[],
// }
type RealObject = Shape<typeof person>;
```

### Advanced usage

```typescript
// With these basic tools you can keep expanding by using recipes inside
// recipes, this is where the real power lies

const testAddressRecipe = (): Recipe<typeof person> => (entity) =>
  entity.recipe(addressRecipe('Teststreet 1', 1000, 'Norway'));

const testNameAndAgeRecipe = (): Recipe<typeof person> => (entity) =>
  entity.set({ name: 'John Doe', age: 20 });

const testPersonRecipe = (): Recipe<typeof person> => (entity) => 
  entity.recipe(testAddressRecipe()).recipe(testNameAndAgeRecipe());

const testResult = person.recipe(testPersonRecipe()) // Finally we run all the recipes
    .get(); // and retrieve the resulting object 

// You can also chain set() and recipe() operations 

person.set({ name: 'John Doe' }).set({ age: 20 })
  .recipe(testAddressRecipe()).get();

// Using recipes from a "parent-entity" onto a "child-entity" that inherited/extended the base-entity. 
// In order to achieve this the recipe-function must be made generic.
// We need to do some assertions inside the generic function, in order for set/setPath arguments
// to be type-safe.

const genericTestAddressRecipe = <T extends typeof person>(): Recipe<T> => (entity) =>
  (
    (entity as typeof person)
      .set({
        address: { street: 'Teststreet 1', zip: 1000, country: 'Norway' }
      })
  ) as typeof entity;

const genericStreetRecipe = <T extends typeof person>(): Recipe<T> => (entity) =>
  (
    (entity as typeof person)
      .setPath('address.street', 'Teststreet 1')
  ) as typeof entity;

const employee = entity({
  ...person.get(),
  jobTitle: '',
  salary: 0
});

const update = employee.recipe(genericTestAddressRecipe()).recipe(genericStreetRecipe());

// That's it!
// You now have the power to create bigger entities with associated recipes.
//
// You can even create sub-entities with their own sub-recipes, and then you
// call get() on the sub-entity and set() it back into the parent entity.
```
