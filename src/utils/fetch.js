/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
