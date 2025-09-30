import React, { useState } from 'react';
import { entity, Recipe } from '../index';

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
  const [person, setPerson] = useState(personEntity);
  const { name, age, address } = person.get();

  return (
    <div>
      <h1>Object recipes: React useState() example</h1>
      Name:{' '}
      <input
        type="text"
        value={name}
        onChange={({ currentTarget: { value } }) =>
          setPerson((p) => p.set({ name: value }))
        }
      />
      <br />
      Age:{' '}
      <input
        type="text"
        value={isNaN(age) ? '' : age.toString()}
        onChange={({ currentTarget: { value } }) =>
          setPerson((p) => p.set({ age: parseInt(value) }))
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
          setPerson(addressRecipe({ street: value }))
        }
      />
      <br />
      Zip:{' '}
      <input
        type="text"
        value={isNaN(address.zip) ? '' : address.zip.toString()}
        onChange={({ currentTarget: { value } }) =>
          setPerson(addressRecipe({ zip: parseInt(value) }))
        }
      />
      <br />
      Country:{' '}
      <input
        type="text"
        value={address.country}
        onChange={({ currentTarget: { value } }) =>
          setPerson(addressRecipe({ country: value }))
        }
      />
      <br />
    </div>
  );
}
