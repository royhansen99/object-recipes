import React from 'react';
import { create } from 'zustand';
import { entity, Recipe, Shape, recipe } from '../index';

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

type UsePersonStore = {
  entity: Shape<typeof personEntity>;
  dispatch: (recipe: Recipe<typeof personEntity>) => void;
};

const usePersonStore = create<UsePersonStore>((set) => ({
  entity: personEntity.get(),
  dispatch: (_recipe) =>
    set((s) => ({
      ...s,
      entity: recipe(_recipe)(s.entity),
    })),
}));

export default function ZustandExample() {
  const { name, age, address } = usePersonStore((s) => s.entity);
  const dispatch = usePersonStore((s) => s.dispatch);

  return (
    <div>
      <h1>Object recipes: React + Zustand example</h1>
      Name:{' '}
      <input
        type="text"
        value={name}
        onChange={({ currentTarget: { value } }) =>
          dispatch((p) => p.set({ name: value }))
        }
      />
      <br />
      Age:{' '}
      <input
        type="text"
        value={isNaN(age) ? '' : age.toString()}
        onChange={({ currentTarget: { value } }) =>
          dispatch((p) => p.set({ age: parseInt(value) }))
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
