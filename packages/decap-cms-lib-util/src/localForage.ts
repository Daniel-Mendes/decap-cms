import localForage from 'localforage';

function localForageTest() {
  const testKey = 'localForageTest';
  localForage
    .setItem(testKey, { expires: Date.now() + 300_000 })
    .then(() => {
      localForage.removeItem(testKey);
    })
    .catch(error => {
      if (error.code === 22) {
        const message = 'Unable to set localStorage key. Quota exceeded! Full disk?';
        console.warn(message);
      }
      console.log(error);
    });
}

localForageTest();



export {default} from 'localforage';