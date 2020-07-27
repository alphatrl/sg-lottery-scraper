import {default as fetch} from "node-fetch";

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
