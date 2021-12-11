import fs from 'fs';
import { fetch } from './fetch';

/**
 * @param url JSON URL
 * @return Promise(JSON)
 *
 * Fetches JSON from from url provided
 * Returns a Promise dictionary
 */
export async function getJSON<T>(url: string): Promise<T> {
  const data: T = await fetch(url)
    .then((response) => {
      return response.json() as Promise<T>;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject('invalid-json');
    });

  return data;
}

export async function getJSONLocal(
  url: string
): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(fs.readFileSync(url, 'utf8'));
  } catch (error) {
    console.log(error);
    return Promise.reject('invalid-json');
  }
}
