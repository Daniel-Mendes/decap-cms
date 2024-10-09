/**
 * Simple script loader that returns a promise.
 */
export default function loadScript(url) {
  return new Promise((resolve, reject) => {
    let done = false;
    const head = document.querySelectorAll('head')[0];
    const script = document.createElement('script');
    script.src = url;
    script.addEventListener('load', script.onreadystatechange = function () {
      if (
        !done &&
        (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')
      ) {
        done = true;
        resolve();
      } else {
        reject();
      }
    });
    script.onerror = error => reject(error);
    head.append(script);
  });
}
