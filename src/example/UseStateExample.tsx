import React, { useState } from 'react';
import { entity, Recipe, recipeSafe } from '../index';

const personEntity = entity({
  name: 'John Doe',
  age: 20,
  address: {
    street: 'Some street 99',
    zip: 1000,
    country: 'Some country',
  },
});

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

export default function UseStateExample() {
  const [{ name, age, address }, setPerson] = useState(personEntity.getSafe());

  return (
    <div>
      <h1>Object recipes: React useState() example</h1>
      Name:{' '}
      <input
        type="text"
        value={name}
        onChange={({ currentTarget: { value } }) =>
          setPerson(recipeSafe((p) => p.set({ name: value })))
        }
      />
      <br />
      Age:{' '}
      <input
        type="text"
        value={isNaN(age) ? '' : age.toString()}
        onChange={({ currentTarget: { value } }) =>
          setPerson(recipeSafe((p) => p.set({ age: parseInt(value) })))
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
          setPerson(recipeSafe(addressRecipe({ street: value })))
        }
      />
      <br />
      Zip:{' '}
      <input
        type="text"
        value={isNaN(address.zip) ? '' : address.zip.toString()}
        onChange={({ currentTarget: { value } }) =>
          setPerson(recipeSafe(addressRecipe({ zip: parseInt(value) })))
        }
      />
      <br />
      Country:{' '}
      <input
        type="text"
        value={address.country}
        onChange={({ currentTarget: { value } }) =>
          setPerson(recipeSafe(addressRecipe({ country: value })))
        }
      />
      <br />
    </div>
  );
}
