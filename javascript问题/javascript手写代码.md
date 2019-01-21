### 函数节流实现

```js
function throttle (fn, wait, options) {
  let timeout = null, previous = 0, args, context, result;
  if (!options) options = {};
  const later = function () {
    previous = Date.now();
    timeout = null;
    result = fn.apply(context, args);
    if (!timeout) args = context = null;
  }
  const throttled = function () {
    let now = Date.now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait ) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null
      }
      previous = now
      result = fn.apply(context, args);
      if (!timeout) args = context = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = args = context = null;
  }

  return throttled;
}
```
### 函数防抖实现

```js
function debounce (fn, wait, imediate) {
  let timeout = null, args, context, result;

  const later = function () {
    result = fn.apply(context, args);
    timeout = null;
  }

  const debounced = function () {
    context = this;
    args = arguments;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (imediate) {
      const callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = fn.apply(context, args);
    } else {
      timeout = setTimeout(later, wait);
    }
    return result;
  }
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  }
  return debounced;
}
```

### compose函数实现

```js
function compose () {
  var args = arguments;
  var start = arguments.length - 1;

  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);
    while(i--) result = args[i].call(this, result);
    return result;
  };
}

function _compose (...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => ((...args) => a(b(...args))))
}

let fn1 = (a) => a + 1;
let fn2 = (b) => b + 2;
let fn3 = (c) => c + 3;

let funs = [fn1, fn2, fn3];


console.log(_compose(...funs)(100))

```

### 深克隆

```js
//乞丐版本
function deepClone (obj) {
  var res = {};
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) res = [];

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      res[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
    }
  }

  return res;
}
```
这个方法虽然可以解决绝大部分是使用场景,但是却有很多坑.
1. 它无法实现对函数 、RegExp等特殊对象的克隆；
2. 会抛弃对象的constructor,所有的构造函数会指向Object；
3. 对象有循环引用,会报错；

深克隆完整实现: [面试官:请你实现一个深克隆](https://juejin.im/post/5abb55ee6fb9a028e33b7e0a)

### bind实现

```js
Function.prototype._bind = function (context) {
  var params = Array.prototype.slice.call(arguments, 1);
  var func = this;
  return function F () {
    params = params.concat(Array.prototype.slice.call(arguments));
    return func.apply(this instanceof F ? this : context, params);
  };
}

```

### apply实现

```js
Function.prototype.myApply = function (context) {
  context = context || window;
  context.fn = this;
  var result;
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}
```

### call实现

```js
Function.prototype.myCall = function (context) {
  context = context || window;
  context.fn = this;

  var args = [...arguments].slice(1);
  var result = context.fn(...args);
  delete context.fn;
  return result;
}
```

### 实现destructuringArray方法，达到如下效果
```js
destructuringArray( [1,[2,4],3], "[a,[b],c]" );// { a:1, b:2, c:3 }
```
实现如下：
```js
const destructuringArray = (array, keys) => {
  if (typeof keys === 'string') {
    keys = JSON.parse(keys.replace(/\w+/g, '"$&"'));
  }
  let res = {};
  const iterate = (array, keys) => {
    keys.forEach((key, index) => {
      if (Array.isArray(key)) {
        iterate(array[index], key);
      } else {
        res[key] = array[index];
      }
    });
  }
  iterate(array, keys);
  return res;
}
```

### 实现一个get函数，使得下面的调用可以输出正确的结果

```js
const obj = { selector: { to: { toutiao: "FE Coder"} }, target: [1, 2, { name: 'byted'}]};

get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name');
// [ 'FE Coder', 1, 'byted']
```
实现如下：
```js
const get = (obj, ...args) =>
  args.map(arg =>
    arg.split(/\.|\[|\]/)
      .filter(key => key !== '')
      .reduce((prev, curr) => prev && prev[curr], obj)
  )
```

### 将嵌套的数组扁平化，变成一维的数组

```js
const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));

function flatten(arr){
  return arr.reduce(function(prev,item){
    return prev.concat(Array.isArray(item)?flatten(item):item);
  },[]);
}

```

### 实现超出整数存储范围的两个大整数相加function add(a,b)。注意a和b以及函数的返回值都是字符串

```js
const add = (a, b) => {
  const lenA = a.length;
  const lenB = b.length;
  const len = lenA > lenB ? lenA : lenB;

  if (len > lenA) {
    for (let i = 0; i < len - lenA; i++) {
      a = '0' + a;
    }
  }
  if (len > lenB) {
    for (let i = 0; i < len - lenB; i++) {
      b = '0' + b;
    }
  }

  const arrA = a.split('').reverse();
  const arrB = b.split('').reverse();
  let addCarry = 0;
  const arr = [];
  for (let i = 0; i < len; i ++) {
    let res = Number(arrA[i]) + Number(arrB[i]) + addCarry;
    arr[i] = res > 9 ? res - 10 : res;
    addCarry = res > 9 ? 1 : 0;
  }

  if (addCarry === 1) {
    arr[len] = 1;
  }

  return arr.reverse().join('');

}
```

### Promise的标准实现

```js
function Promise (executor) {
  const self = this;
  this.status = 'pending';
  this.value = null;
  this.reason = null;
  this.onFufilledCb = [];
  this.onRejectedCb = [];

  function resolve (value) {
    if (self.status === 'pending') {
      self.value = value;
      self.status = 'fulfilled';
      self.onFufilledCb.forEach(cb => {
        cb();
      });
    }
  }

  function reject (reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejectedCb.forEach(cb => {
        cb();
      });
    }
  }

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

Promise.prototype.then = function (onFufilled, onRejected) {
  onFufilled = typeof onFufilled === 'function' ?
                onFufilled :
                function (value) { return value;};
  onRejected = typeof onRejected === 'function' ?
                onRejected :
                function (err) { throw err};

  const self = this;
  let promise2;
  if (this.status === 'fulfilled') {
    promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let x = onFufilled(self.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  if (this.status === 'rejected') {
    promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  if (this.status === 'pending') {
    promise2 = new Promise(function (resolve, reject) {
      self.onFufilledCb.push(() => {
        setTimeout(function () {
          try {
            let x = onFufilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      });

      self.onRejectedCb.push(() => {
        setTimeout(function () {
          try {
            let x = onRejected(self.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      });
    })
  }

  return promise2;
};

Promise.prototype.catch = function (callback) {
  return this.then(null, callback);
};

Promise.all = function (items) {
  let len = items.length;
  let res = [];
  let num = 0;
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < len; i ++) {
      items[i].then(function (data) {
        res[i] = data;
        if (++ num === len) {
          resolve(res);
        }
      }, reject);
    }
  });
};

Promise.race = function (items) {
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < items.length; i ++) {
      items[i].then(resolve, reject);
    }
  });
};

Promise.resolve = function (value) {
  return new Promise(function (resolve, reject) {
    resolve(value);
  });
};

Promise.reject = function (err) {
  return new Promise(function (resolve, reject) {
    reject(err);
  });
};

Promise.defer = Promise.deferred = function() {
  let def = {};
  def.promise = new Promise(function(resolve, reject) {
      def.resolve = resolve;
      def.reject = reject;
  });

  return def;
};

function resolvePromise(p2, x, resolve, reject) {
  if (p2 === x) {    // 不能返回自己
    return reject(new TypeError('循环引用'));
  }
  let called;     // 表示是否调用成功or失败
  // x返回的可能是对象和函数也可能是一个普通的值
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;

      if (typeof then === 'function') {
        then.call(x, function (y) {
            // 防止多次调用
            if (called) return;
            called = true;
            // y可能还是个promise，所以递归继续解析直到返回一个普通值
            resolvePromise(p2, y, resolve, reject);
        }, function (e) {
            if (called) return;
            called = true;
            reject(e);
        });
      } else {
        // 处理then不是函数的情况，就直接返回成功
        resolve(x);
      }
    } catch(e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);     // 返回一个普通值
  }
}

module.exports = Promise;
```
### 最大子数列问题

```js
function dpMaximumSubarray(inputArray) {
  let maxSum = -Infinity;
  let currentSum = 0;

  let maxStartIndex = 0;
  let maxEndIndex = inputArray.length - 1;
  let currentStartIndex = 0;

  inputArray.forEach((currentNumber, currentIndex) => {
    currentSum += currentNumber;

    if (maxSum < currentSum) {
      maxSum = currentSum;
      maxStartIndex = currentStartIndex;
      maxEndIndex = currentIndex;
    }

    if (currentSum < 0) {
      currentSum = 0;
      currentStartIndex = currentIndex + 1;
    }
  })

  return inputArray.slice(maxStartIndex, maxEndIndex + 1);

}

var array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(dpMaximumSubarray(array)); //[4, -1, 2, 1]
```

### 洗牌算法(乱序数组)

```js
function fisherYates(originalArray) {
  let array = originalArray.slice(0);

  for (let i = array.length - 1; i > 0;i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[randomIndex], array[i]] = [array[i], array[randomIndex]];
  }

  return array;
}

console.log(fisherYates([4, -1, 2, 1, -5, 4]));
```
