import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

console.log('Project ID:', projectId);
console.log('Dataset:', dataset);
console.log('API Version:', apiVersion);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export const listenForBonUpdates = (callback) => {
  return client.listen(`*[_type == "bon"]`).subscribe((update) => {
    if (update.result) {
      const { num, user } = update.result;
      const action = update.transition === "appear" ? "créé" : "modifié";
      const notificationText = `Utilisateur : ${user} a ${action} un bon n° : ${num}`;
      
      // Pass both the formatted text and the raw data to the callback
      callback(notificationText, update.result);
    }
  })
}