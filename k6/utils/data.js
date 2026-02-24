// simple data generators for k6 load tests

/**
 * generate a random user object suitable for register endpoint
 */
export function randomUser() {
  const id = Math.floor(Math.random() * 1000000);
  return {
    name: `k6user${id}`,
    email: `k6user${id}@example.com`,
    password: `P@ssw0rd${id}`,
  };
}

/**
 * generate a random note payload
 */
export function randomNote() {
  const categories = ['Home', 'Work', 'Personal'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  return {
    title: `Note ${Math.random().toString(36).substring(2, 8)}`,
    description: `Description ${Math.random().toString(36).substring(2, 15)}`,
    category,
  };
}
