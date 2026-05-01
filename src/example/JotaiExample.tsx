import React from 'react';
import { atom, useAtom } from 'jotai';
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

const personAtom = atom(personEntity.getSafe());

export default function JotaiExample() {
  const [{ name, age, address }, setPerson] = useAtom(personAtom);

  return (
    <div>
      <h1>Object recipes: React + Jotai example</h1>
      Name:{' '}
      <input
        type="text"
        value={name}
        onChange={({ currentTarget: { value } }) =>
          setPerson(recipeSafe((e) => e.set({ name: value })))
        }
      />
      <br />
      Age:{' '}
      <input
        type="text"
        value={isNaN(age) ? '' : age.toString()}
        onChange={({ currentTarget: { value } }) =>
          setPerson(recipeSafe((e) => e.set({ age: parseInt(value) })))
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
