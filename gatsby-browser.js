import client from './src/components/apollo/client';
import { decryptText, encryptText } from './src/components/core/utils';

export { wrapRootElement } from './src/components/apollo/wrap-root-element';

// Pali location
// const location = {
//   name: 'Pali',
//   lat: 31.819878,
//   lng: 76.93857
// };
// 31.707915, 76.932202
const location = {
  name: 'Mandi',
  lat: 31.707915,
  lng: 76.932202
};

const defaultEncLocation = encryptText(JSON.stringify(location));

export const onClientEntry = () => {
  let savedEncLocation = localStorage.getItem('lla');

  if (savedEncLocation) {
    const decryptedLocation = decryptText(savedEncLocation);
    if (!decryptedLocation || decryptedLocation === '') {
      // error in decrypting
      savedEncLocation = defaultEncLocation;
      localStorage.setItem('lla', defaultEncLocation);
    }
  } else {
    savedEncLocation = defaultEncLocation;
    localStorage.setItem('lla', defaultEncLocation);
  }

  client.writeData({
    data: { localSavedLocation: savedEncLocation }
  });
};
