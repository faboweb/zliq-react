// run a queue that runs while it has members
// members can be functions or promises
export function Queue() {
    var current = Promise.resolve();

    return {
        add: (fn) => {
            current = current.then(() => {
                return new Promise((_resolve_, _reject_) => {
                    let result = fn();
                    // enable usage of promises in queue for async behaviour
                    if (result != null && typeof result.then === "function") {
                        result.then(_resolve_);
                    } else {
                        setImmediate(_resolve_)
                    }
                })
            });
            return current;
        }
    }
}

export function batchAsyncQueue(queueFnArr, batchCallback, maxTimePerChunk) {
    let queue = Queue();
    let results = [];
    maxTimePerChunk = maxTimePerChunk || 200;
    
    let startTime = now();
    queueFnArr.forEach(fn => {
        queue.add(() => {
            if ((now() - startTime) > maxTimePerChunk) {
                startTime = now();
                batchCallback && batchCallback(results);
                results = [];
            }
            if (typeof fn.then === 'function') {
                return fn.then(partial => results = results.concat(fn))
            }
            results = results.concat(fn());
        })
    });
    return queue.add(() => {
        if (results.length > 0) {
            batchCallback && batchCallback(results);
        }
    });
} 
			
function now() {
	return new Date().getTime();
}