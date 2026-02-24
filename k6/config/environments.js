// environment settings for k6 tests
export const ENV = {
  // base url can be overridden by setting BASE_URL env var when running k6
  baseUrl: __ENV.BASE_URL || 'https://practice.expandtesting.com/notes/api',
};

export function getBaseUrl() {
  return ENV.baseUrl;
}
