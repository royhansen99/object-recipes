import { describe, expect, it } from 'vitest';
import { entity, Recipe } from './index';

describe('Entity tests', () => {
  it('constructor(): Check for immutability', () => {
    const something = () => ({ a: 1, b: 2 });
    const test = something();

    entity(something).set({ b: 22 });

    // Make sure original input-object is untouched, because of
    // immutability.
    expect(test).toStrictEqual(something());
  });

  it('get(): Check for identical return structure and immutability', () => {
    const something = () => ({ a: 1, b: 'abc', arr: [], obj: {} });
    const ent = entity(something());

    // Get returns the original object.
    expect(ent.get()).toStrictEqual(something());
  });

  it('set(): Initialize entity, assign values, test immutability', () => {
    const name = 'John Doe';
    const age = 20;

    const person = entity({ name: '', age: 0 });
    const update = person.set({ name, age });

    // `person` should remain untouched after the `set` operation,
    // because of immutability.
    expect(person.get()).not.toEqual(expect.objectContaining({ name, age }));

    // `update` should contain the new object with the updated
    // values.
    expect(update.get()).toEqual(expect.objectContaining({ name, age }));
  });

  it('setPath(): Initialize entity, assign values, test immutability', () => {
    const person = entity({
      name: '',
      age: 0,
      address: {
        street: '',
        zip: 0,
        country: '',
      },
    });

    const name = 'John Doe';
    const age = 20;
    const country = 'Norway';

    const update = person
      .setPath('name', name)
      .setPath('age', age)
      .setPath('address.country', country);

    // `person` should remain untouched after the `setPath` operations,
    // because of immutability.
    expect(person.get()).not.toEqual(expect.objectContaining({ name, age }));
    expect(person.get().address).not.toEqual(
      expect.objectContaining({ country })
    );

    // `update` should contain the new object with the updated
    // values.
    expect(update.get()).toEqual(expect.objectContaining({ name, age }));
    expect(update.get().address).toEqual(expect.objectContaining({ country }));
  });

  it('set() / setPath(): Identical values should return current instance with no changes', () => {
    const person = entity({
      name: 'Test',
      age: 30,
      address: {
        street: 'Test road',
        zip: 0,
        country: '',
      },
    });

    const setTest = person.set({ name: 'Test', age: 30 });

    // Should be the same object, since values were identical,
    // so no update needed.
    expect(setTest.get()).toBe(person.get());
    expect(setTest).toBe(person);

    const setPathTest = person.setPath('address.street', 'Test road');

    // Should be the same object, since values were identical,
    // so no update needed.
    expect(setPathTest.get()).toBe(person.get());
    expect(setPathTest).toBe(person);
  });

  it('set() / setPath(): With `deepEqual` set', () => {
    const person = entity(
      {
        name: 'Test',
        age: 30,
        address: {
          street: 'Test road',
          zip: 0,
          country: '',
        },
      },
      { deepEqual: true }
    ); // deepEqual set "globally" for this entity.

    // Expect set() to return the current instance without modifications
    // since deep-equal returns true.
    expect(person.set({ address: { ...person.get().address, zip: 0 } })).toBe(
      person
    );
    expect(person.setPath('address', { ...person.get().address, zip: 0 })).toBe(
      person
    );

    // When we disable deepEqual on set/setPath, should no longer be equal.
    expect(
      person.set(
        { address: { ...person.get().address, zip: 0 } },
        false // disable deepEqual
      )
    ).not.toBe(person);
    expect(
      person.setPath(
        'address',
        { ...person.get().address, zip: 0 },
        false // disable deepEqual
      )
    ).not.toBe(person);

    // When there actually is an update, a new instance should be returned.
    expect(
      person.set({ address: { ...person.get().address, zip: 40 } })
    ).not.toBe(person);
    expect(
      person.setPath('address', { ...person.get().address, zip: 40 })
    ).not.toBe(person);

    // With `deepEqual` parameter directly on set/setPath.
    // Should be equal, since no change according to deepEqual.
    expect(
      entity(person.get())
        .set(
          { address: { ...person.get().address } },
          true // enable deepEqual
        )
        .get()
    ).toBe(person.get());
    expect(
      entity(person.get())
        .setPath(
          'address',
          { ...person.get().address },
          true // enable deepEqual
        )
        .get()
    ).toBe(person.get());
  });

  it('set/setPath when base entity is an array', () => {
    const test = entity([
      { strValue: 'Hello!', numValue: 100, array: [1, 2, 3] },
    ]);

    // Update value inside first element
    expect(
      test.setPath('[0].strValue', 'Testing').get()[0].strValue
    ).toStrictEqual('Testing');

    // Update value inside first element
    expect(test.setPath('[0].array[3]', 600).get()[0].array).toStrictEqual([
      1, 2, 3, 600,
    ]);

    // Update entire first element
    expect(
      test.setPath('[0]', { ...test.get()[0], numValue: 777, array: [0] }).get()
    ).toStrictEqual([{ ...test.get()[0], numValue: 777, array: [0] }]);

    // Add new element
    expect(
      test
        .setPath('[1]', { strValue: 'New element', numValue: 777, array: [0] })
        .get()
    ).toStrictEqual([
      test.get()[0],
      { strValue: 'New element', numValue: 777, array: [0] },
    ]);

    // set() will simply reset/update the entire entity,
    // since partial updates wont work on arrays.
    expect(
      test.set([{ strValue: 'Testing', numValue: 29, array: [1, 2, 3] }]).get()
    ).toStrictEqual([{ strValue: 'Testing', numValue: 29, array: [1, 2, 3] }]);

    // With deep-equal, should return the same instance unchanged, since there is no change.
    expect(test.set(test.getClone(), true)).toBe(test);
  });

  it('recipe(): Use a recipe, test immutability', () => {
    const person = entity({
      name: '',
      age: 0,
      address: {
        street: '',
        zip: 0,
        country: '',
      },
    });

    const setAddress =
      (street: string, zip: number, country: string): Recipe<typeof person> =>
      (entity) =>
        entity.set({ address: { street, zip, country } });

    const newAddress = {
      street: 'Test street 1',
      zip: 1000,
      country: 'Norway',
    };

    const update = person.recipe(
      setAddress(newAddress.street, newAddress.zip, newAddress.country)
    );

    // `person` should remain untouched after the recipe was applied,
    // because of immutability.
    expect(person.get().address).not.toEqual(
      expect.objectContaining(newAddress)
    );

    // `update` should contain the new object with the updated
    // values.
    expect(update.get().address).toEqual(expect.objectContaining(newAddress));
  });

  it('recipe(): Use a nested recipe', () => {
    const person = entity({
      name: '',
      age: 0,
      address: {
        street: '',
        zip: 0,
        country: '',
      },
    });

    const setAddressRecipe =
      (street: string, zip: number, country: string): Recipe<typeof person> =>
      (entity) =>
        entity.set({ address: { street, zip, country } });

    const newAddress = {
      street: 'Test street 1',
      zip: 1000,
      country: 'Norway',
    };

    const nestedRecipe = (): Recipe<typeof person> => (entity) =>
      entity.recipe(
        setAddressRecipe(newAddress.street, newAddress.zip, newAddress.country)
      );

    // `update` should contain the new object with the updated values.
    expect(person.recipe(nestedRecipe()).get().address).toEqual(
      expect.objectContaining(newAddress)
    );
  });

  it('recipe(): Use a generic recipe from a different entity', () => {
    const person = entity({
      name: '',
      age: 0,
      address: {
        street: '',
        zip: 0,
        country: '',
      },
    });

    const setAddressRecipe =
      <T extends typeof person>(
        street: string,
        zip: number,
        country: string
      ): Recipe<T> =>
      (entity) =>
        (entity as typeof person).set({
          address: { street, zip, country },
        }) as typeof entity;

    const personExtended = entity({
      ...person.get(),
      employer: '',
      position: '',
    });

    const newAddress = {
      street: 'Test street 1',
      zip: 1000,
      country: 'Norway',
    };

    // Check that the recipe is properly applied to the extended entity
    expect(
      personExtended
        .recipe(
          setAddressRecipe(
            newAddress.street,
            newAddress.zip,
            newAddress.country
          )
        )
        .get().address
    ).toEqual(expect.objectContaining(newAddress));
  });

  it('getClone(): Will do a recursive deep-clone of the uderlying object and return it', () => {
    const original = entity({
      roles: {
        admin: {
          members: [{ name: 'Jane' }, { name: 'John' }],
        },
      },
    });

    // Get a clone of the original object.
    const clone = original.getClone();

    // The clone object should not be
    // equal to the original object.
    expect(clone).not.toBe(original);

    // Modify the members list in the clone
    // by removing the member 'John'.
    clone.roles.admin.members.splice(1, 1);

    // The modification of the clone should
    // not have any effect on the original.
    expect(original.get().roles.admin.members[1]).toEqual({ name: 'John' });
  });
});
