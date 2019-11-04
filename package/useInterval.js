import {useEffect, useRef} from 'react';

export default function useInterval(callback) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    });
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      tick();
      let id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, []);
  }
  