import React from 'react';
import { createStore, StoreEnhancer } from 'redux';
import {
  Provider,
  useSelector,
  useDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { entity, Recipe, Shape } from '../index';

const personEntity = entity({
  name: 'John Doe',
  age: 20,
  address: {
    street: 'Some street 99',
    zip: 1000,
    country: 'Some country',
  },
});

type Action = {
  type: string;
  recipe: Recipe<typeof personEntity>;
};

const setNameAgeAction = (
  values: Partial<Pick<Shape<typeof personEntity>, 'name' | 'age'>>
): Action => ({
  type: 'setNameAge',
  recipe: (entity) => entity.set(values),
});

const setAddressAction = (
  values: Partial<Shape<typeof personEntity>['address']>
): Action => ({
  type: 'setAddress',
  recipe: (entity) =>
    entity.set({
      address: { ...entity.get().address, ...values },
    }),
});

const reducer = (entity = personEntity, action?: Action) =>
  action?.recipe ? entity.recipe(action.recipe) : entity;

declare const window: {
  __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
};

const store = createStore<typeof personEntity, Action>(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const appSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> =
  useSelector;
const appDispatch: () => typeof store.dispatch = useDispatch;

function Example() {
  const { name, age, address } = appSelector((person) => person.get());
  const dispatch = appDispatch();

  return (
    <div>
      <h1>Object recipes: React + Redux example</h1>
      Name:{' '}
      <input
        type="text"
        value={name}
        onChange={({ currentTarget: { value } }) =>
          dispatch(setNameAgeAction({ name: value }))
        }
      />
      <br />
      Age:{' '}
      <input
        type="text"
        value={isNaN(age) ? '' : age.toString()}
        onChange={({ currentTarget: { value } }) =>
          dispatch(setNameAgeAction({ age: parseInt(value) }))
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
          dispatch(setAddressAction({ street: value }))
        }
      />
      <br />
      Zip:{' '}
      <input
        type="text"
        value={isNaN(address.zip) ? '' : address.zip.toString()}
        onChange={({ currentTarget: { value } }) =>
          dispatch(setAddressAction({ zip: parseInt(value) }))
        }
      />
      <br />
      Country:{' '}
      <input
        type="text"
        value={address.country}
        onChange={({ currentTarget: { value } }) =>
          dispatch(setAddressAction({ country: value }))
        }
      />
      <br />
    </div>
  );
}

export default function ReduxExample() {
  return (
    <Provider store={store}>
      <Example />
    </Provider>
  );
}
