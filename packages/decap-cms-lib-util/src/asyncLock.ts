import semaphore from 'semaphore';

export type AsyncLock = { release: () => void; acquire: () => Promise<boolean> };

export function asyncLock(): AsyncLock {
  let lock = semaphore(1);

  function acquire(timeout = 15_000) {
    const promise = new Promise<boolean>(resolve => {
      // this makes sure a caller doesn't gets stuck forever awaiting on the lock
      const timeoutId = setTimeout(() => {
        // we reset the lock in that case to allow future consumers to use it without being blocked
        lock = semaphore(1);
        resolve(false);
      }, timeout);

      lock.take(() => {
        clearTimeout(timeoutId);
        resolve(true);
      });
    });

    return promise;
  }

  function release() {
    try {
      // suppress too many calls to leave error
      lock.leave();
    } catch (error) {
      // calling 'leave' too many times might not be good behavior
      // but there is no reason to completely fail on it
      if (error.message === 'leave called too many times.') {
        console.warn('leave called too many times.');
        lock = semaphore(1);
      } else {
        throw error;
      }
    }
  }

  return { acquire, release };
}
