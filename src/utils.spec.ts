import { describe, expect, it } from 'vitest';
import { pathSet } from './utils';

const generatePerson = () => ({
  name: 'John Doe',
  age: 32,
  favoriteFood: ['Pizza', 'Hamburger', 'Tacos'],
  addresses: {
    primary: {
      street: '1234 Broadway Ave, Apt 5B',
      city: 'New York',
      state: 'NY',
      zip: 10001,
    },
    secondary: {
      street: '5678 Capitol St NW, Unit 12',
      city: 'Washington',
      state: 'DC',
      zip: 20001,
    },
  },
});

describe('pathSet() tests', () => {
  it('Update single path', () => {
    const person = generatePerson();
    const update = pathSet(person, 'age', 33);

    // Expect age to be updated.
    expect(update.age).toEqual(33);

    // Expect original object to remain unchanged.
    expect(person.age).toEqual(32);

    // Expect updated object to not be the same
    // object (immutability).
    expect(update).not.toBe(person);
  });

  it('Update array path', () => {
    const person = generatePerson();
    const update = pathSet(person, 'favoriteFood[1]', 'Meatballs');

    // Expect food-item [1] to be updated.
    expect(update.favoriteFood[1]).toEqual('Meatballs');

    // Expect original object to remain unchanged.
    expect(person.favoriteFood[1]).toEqual('Hamburger');

    // Expect updated object to not be the same
    // object (immutability).
    expect(update).not.toBe(person);
    expect(update.favoriteFood).not.toBe(person.favoriteFood);
  });

  it('Update deeply nested path', () => {
    const person = generatePerson();
    const update = pathSet(person, 'addresses.primary.city', 'Chicago');

    // Expect field to be updated.
    expect(update.addresses.primary.city).toEqual('Chicago');

    // Expect original object to remain unchanged.
    expect(person.addresses.primary.city).toEqual('New York');

    // Expect updated object to not be the same
    // object (immutability).
    expect(update.addresses).not.toBe(person.addresses);
    expect(update.addresses.primary).not.toBe(person.addresses.primary);
  });
});
