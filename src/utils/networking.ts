import fs from 'fs';


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

export async function getJSONLocal<T>(url: string): Promise<T> {
  try {
    return JSON.parse(fs.readFileSync(url, 'utf8')) as Promise<T>;
  } catch (error) {
    console.log(error);
    return Promise.reject('invalid-json');
  }
}
