import {default as fetch} from "node-fetch";
import fs from 'fs';

/**
 * @param string JSON URL
 * @param returns Promise(JSON)
 * 
 * Fetches JSON from from url provided
 * Returns a Promise dictionary
 */

export const getJSON = async(url) => {
  const data = await fetch(url)
    .then(response => {return response.json();})
    .catch((error) => {
      console.log(error);
      return {};
    });

    return data
}

export const getJSONLocal = async(url) => {
  try {
    return JSON.parse(fs.readFileSync(url, 'utf8'));
  } catch (error) {
    console.log(error);
    return {};
  }
}