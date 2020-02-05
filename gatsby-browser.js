import client from './src/components/apollo/client';
export { wrapRootElement } from './src/components/apollo/wrap-root-element';

// mandi indra market malhotra books location
const location = {
  name: 'Indra market',
  lat: 31.708141,
  lng: 76.931657
};

export const onClientEntry = () => {
  let lla = localStorage.getItem('lla');
  lla = lla ? lla : btoa(JSON.stringify(location));

  client.writeData({
    data: { localSavedLocation: lla }
  });
};
