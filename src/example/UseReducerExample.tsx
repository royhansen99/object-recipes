import React, { useReducer } from 'react';
import { entity, Shape, Recipe } from '../index';

const personEntity = entity({
  name: 'John Doe',
  age: 20,
  address: {
    street: 'Some street 99',
    zip: 1000,
    country: 'Some country',
  },
});

const nameAgeRecipe =
  (
    values: Partial<Pick<Shape<typeof personEntity>, 'name' | 'age'>>
  ): Recipe<typeof personEntity> =>
  (entity) =>
    entity.set(values);

const addressRecipe =
  (
    values: Partial<{
      street: string;
      zip: number;
      country: string;
    }>
  ): Recipe<typeof personEntity> =>
  (entity) =>
    entity.set({
      address: { ...entity.get().address, ...values },
    });

type Actions = typeof nameAgeRecipe | typeof addressRecipe;

export default function UseReducerExample() {
  const [person, dispatch] = useReducer(
    (person, action: ReturnType<Actions>) => person.recipe(action),
    personEntity
  );
  const { name, age, address } = person.get();

  return (
    <div>
      <h1>Object recipes: React useReducer() example</h1>
      Name:{' '}
      <input
        type="text"
        value={name}
        onChange={({ currentTarget: { value } }) =>
          dispatch(nameAgeRecipe({ name: value }))
        }
      />
      <br />
      Age:{' '}
      <input
        type="text"
        value={isNaN(age) ? '' : age.toString()}
        onChange={({ currentTarget: { value } }) =>
          dispatch(nameAgeRecipe({ age: parseInt(value) }))
        }
      />
      <br />
      <br />
      <b>Address</b>
      <br />
      Street:{' '}
      <input
        type="text"
        value={address.street}
        onChange={({ currentTarget: { value } }) =>
          dispatch(addressRecipe({ street: value }))
        }
      />
      <br />
      Zip:{' '}
      <input
        type="text"
        value={isNaN(address.zip) ? '' : address.zip.toString()}
        onChange={({ currentTarget: { value } }) =>
          dispatch(addressRecipe({ zip: parseInt(value) }))
        }
      />
      <br />
      Country:{' '}
      <input
        type="text"
        value={address.country}
        onChange={({ currentTarget: { value } }) =>
          dispatch(addressRecipe({ country: value }))
        }
      />
      <br />
    </div>
  );
}
