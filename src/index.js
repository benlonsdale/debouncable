import {useState, useRef, useEffect} from 'react'

export class LazyPromise {
    constructor(executor) {
        this.executor = executor;
    }

    then(...args) {
        return new Promise(this.executor).then(...args);
    }

    catch(...args) {
        return new Promise(this.executor).catch(...args);
    }
}

export const useDebouncedPromise = (promise, delay) => {
    const [status, setStatus] = useState();
    const [error, setError] = useState();
    const [result, setResult] = useState();
    const [id, setId] = useState();

    const active = useRef();

    useEffect(
        () => {
            clearTimeout(id);
            active.current = promise;
            if (promise) {
                setStatus('loading');
                const timer = setTimeout(() => {
                    promise.then(res => {
                        if (promise === active.current) {
                            setResult(res);
                            setStatus('resolved');
                        }
                    }).catch(err => {
                        setStatus('error');
                        setError(err)
                    });
                }, delay);
                setId(timer);
            }
        },
        [promise]
    );

    return {
        result,
        status,
        error
    };
};