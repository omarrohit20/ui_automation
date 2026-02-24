import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from '../config/environments.js';

const BASE_URL = getBaseUrl();

// perform login and return token string
export function login(email, password) {
  const res = http.post(`${BASE_URL}/users/login`, { email, password });
  check(res, {
    'login succeeded': (r) => r.status === 200 && JSON.parse(r.body).data?.token,
  });
  return JSON.parse(res.body).data.token;
}

// register a fresh user and return credentials {email, password}
export function registerNewUser() {
  const id = Math.floor(Math.random() * 1000000);
  const user = {
    name: `k6user${id}`,
    email: `k6user${id}@example.com`,
    password: `P@ssw0rd${id}`,
  };
  const res = http.post(`${BASE_URL}/users/register`, user);
  check(res, { 'registered': (r) => r.status === 201 });
  return user;
}
