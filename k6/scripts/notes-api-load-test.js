import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { getBaseUrl } from '../config/environments.js';
import { registerNewUser, login } from '../utils/auth.js';
import { randomNote } from '../utils/data.js';

// custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const noteCreation = new Trend('note_create_duration');
const totalRequests = new Counter('total_requests');

export const options = {
  scenarios: {
    constant_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<600', 'p(99)<1200'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05'],
    login_duration: ['p(95)<800'],
    note_create_duration: ['p(95)<1000'],
  },
  // optionally forward results to InfluxDB/Datadog/etc with --out flag
};

const BASE_URL = getBaseUrl();

export function setup() {
  // create a user before the VUs start; return credentials to each VU
  // set REGISTER_NEW_USER=1 in the environment to have the script
  // register a fresh account; otherwise supply TEST_USER and TEST_PASS.
  const useRegistration = __ENV.REGISTER_NEW_USER === '1';
  const credentials = useRegistration
    ? registerNewUser()
    : { email: __ENV.TEST_USER, password: __ENV.TEST_PASS };
  return credentials;
}

export default function (data) {
  // health check
  group('Health check', () => {
    const res = http.get(`${BASE_URL}/health-check`);
    check(res, { 'health is ok': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
    totalRequests.add(1);
  });

  // authentication and protected flows
  group('User scenarios', () => {
    const start = Date.now();
    const token = login(data.email, data.password);
    loginDuration.add(Date.now() - start);
    totalRequests.add(1);

    group('Profile operations', () => {
      const profile = http.get(`${BASE_URL}/users/profile`, {
        headers: { 'x-auth-token': token },
      });
      check(profile, { 'profile 200': (r) => r.status === 200 });
      errorRate.add(profile.status !== 200);
      totalRequests.add(1);

      const updated = http.patch(
        `${BASE_URL}/users/profile`,
        { name: `Load ${Math.random()}` },
        { headers: { 'x-auth-token': token } }
      );
      check(updated, { 'profile updated': (r) => r.status === 200 });
      totalRequests.add(1);
    });

    group('Notes CRUD', () => {
      const note = randomNote();
      const createRes = http.post(`${BASE_URL}/notes`, note, {
        headers: { 'x-auth-token': token },
      });
      noteCreation.add(createRes.timings.duration);
      check(createRes, { 'created': (r) => r.status === 200 });
      errorRate.add(createRes.status !== 200);
      totalRequests.add(1);

      const noteId = JSON.parse(createRes.body).data?.id;
      if (noteId) {
        const getRes = http.get(`${BASE_URL}/notes/${noteId}`, {
          headers: { 'x-auth-token': token },
        });
        check(getRes, { 'get note': (r) => r.status === 200 });
        totalRequests.add(1);

        const updateRes = http.put(
          `${BASE_URL}/notes/${noteId}`,
          { ...note, completed: true },
          { headers: { 'x-auth-token': token } }
        );
        check(updateRes, { 'updated': (r) => r.status === 200 });
        totalRequests.add(1);

        const patchRes = http.patch(
          `${BASE_URL}/notes/${noteId}`,
          { completed: false },
          { headers: { 'x-auth-token': token } }
        );
        totalRequests.add(1);

        const deleteRes = http.del(`${BASE_URL}/notes/${noteId}`, null, {
          headers: { 'x-auth-token': token },
        });
        totalRequests.add(1);
      }
    });

    // logout at the end of each iteration
    http.del(`${BASE_URL}/users/logout`, null, {
      headers: { 'x-auth-token': token },
    });
    totalRequests.add(1);
  });

  sleep(Math.random() * 2 + 1);
}

export function teardown(data) {
  // optional user deletion to clean up
  if (data && data.email && data.password) {
    const token = login(data.email, data.password);
    http.del(`${BASE_URL}/users/delete-account`, null, {
      headers: { 'x-auth-token': token },
    });
  }
}
