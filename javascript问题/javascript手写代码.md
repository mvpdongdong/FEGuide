### bind实现

```js
Function.prototype._bind = function (context) {
  const args = [...arguments].slice(1);
  const func = this;
  function F() {
    return func.apply(this instanceof func ? this : context, args.concat([...arguments]));
  }
  F.prototype = Object.create(func.prototype);
  return F;
}
```

### apply实现

```js
Function.prototype._apply = function (context) {
  context = context || window;
  context.fn = this;
  let result;
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
Function.prototype._call = function (context) {
  context = context || window;
  context.fn = this;
  const args = [...arguments].slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
}
```

### new的模拟实现

```js
function objectFactory (fun) {
  const obj = Object.create(fun.prototype);
  const res = fun.apply(obj, [...arguments].slice(1))
  return Object.prototype.toString.call(res) === '[object Object]' ? res : obj;
}
```

### instanceof 模拟实现

```js
function instanceOf(obj, func) {
  var proto = obj.__proto__;
  var prototype = func.prototype;

  while(true) {
    if (proto === prototype) return true;
    if (proto === null) return false;
    proto = proto.__proto__;
  }
}

```

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

//节流简易版

function throttle (fn, wait) {
  let previous = 0, result, context, args, timeout;

  const later = function () {
    previous = Date.now();
    timeout = null;
    result = fn.apply(context, args);
  }
  return function () {
    context = this;
    args = arguments;
    let now = Date.now();
    let remaining = wait - (now - previous);
    let result;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null
      }
      result = fn.apply(context, args);
      previous = now
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
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

//防抖简易版
function debounce (fn, wait, imediate) {
  let timeout = null;
  let callNow = imediate;

  return function () {
    let args = arguments;
    let context = this;

    if (callNow) {
      fn.apply(context, args);
      callNow = false;
    }

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(context, args);
      timeout = null
      callNow = imediate;
    });
  }
}

```

### compose函数实现

```js
function compose () {
  var args = arguments;
  var start = arguments.length - 1;

  if (args.length === 0) {
    return arg => arg;
  }
  if (args.length === 1) {
    return args[0];
  }

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

### curry 柯理化的实现

```js
function curry (fn, args) {
  args = args || [];
  return function () {
    let _args = args.slice(0);
    _args = _args.concat([...arguments]);
    if (_args.length >= fn.length) {
      return fn.apply(this, _args);
    }
    return curry.call(this, fn, _args);
  };
}

var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]
```

### 偏函数partial

```js
function partial (fn) {
  let args = [...arguments].slice(1);

  return function () {
    args = [...args, ...arguments];
    return fn.apply(this, args);
  }
}
```

### 深克隆

```js
//乞丐版本
function deepClone (obj) {
  if (typeof obj !== 'object') return obj;
  const res = {};
  if (Array.isArray(obj)) res = [];

  if (Object.prototype.toString.call(obj) === '[object String]' || Object.prototype.toString.call(obj) === '[object Number]') {
    const Ctor = obj.construtor;
    return new Ctor(obj);
  }

  if (Object.prototype.toString.call(obj) === '[object Boolean]' || Object.prototype.toString.call(obj) === '[object Date]') {
    const Ctor = obj.construtor;
    return new Ctor(+obj);
  }

  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      res[i] = deepClone(obj[i]);
    }
  }

  return res;
}
```
这个方法虽然可以解决绝大部分是使用场景,但是却有很多坑.
1. 它无法实现对函数 、RegExp等特殊对象的克隆；
2. 会抛弃对象的constructor,所有的构造函数会指向Object；
3. 对象有循环引用,会报错；

基本深克隆完整实现:
```js
const isType = (obj, type) => {
  if (typeof obj !== 'object') return false;
  const typeString = Object.prototype.toString.call(obj);
  let flag;
  switch (type) {
    case 'Array':
      flag = typeString === '[object Array]';
      break;
    case 'Date':
      flag = typeString === '[object Date]';
      break;
    case 'RegExp':
      flag = typeString === '[object RegExp]';
      break;
    default:
      flag = false;
  }
  return flag;
};

const getRegExp = re => {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};

/**
* deep clone
* @param  {[type]} parent object 需要进行克隆的对象
* @return {[type]}        深克隆后的对象
*/
const clone = parent => {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== 'object') return parent;

    let child, proto;

    if (isType(parent, 'Array')) {
      // 对数组做特殊处理
      child = [];
    } else if (isType(parent, 'RegExp')) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, 'Date')) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    Object.keys(parent).forEach(key => {
      child[key] = _clone(parent[key]);
    });

    return child;
  };
  return _clone(parent);
};
```
当然,我们这个深克隆还不算完美,例如Buffer对象、Promise、Set、Map可能都需要我们做特殊处理，另外对于确保没有循环引用的对象，我们可以省去对循环引用的特殊处理，因为这很消耗时间，不过一个基本的深克隆函数我们已经实现了.

深克隆完整实现: [面试官:请你实现一个深克隆](https://juejin.im/post/5abb55ee6fb9a028e33b7e0a)

### 数组去重有哪些方法

```js
const arr = [1,2,3,4,4,3,2,1];
// 方法一：new Set ES6
function unique(arr) {
  return [...new Set(arr)]; // 这里又问到我...的用法
}

// 方法二：双层for循环 (然后说这样性能不好，让我只用一层for循环的方法)
function unique(arr){
  var res=[];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i+1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        ++ i;
        j = i;
      }
    }
    res.push(arr[i]);
  }
  return res;
}

// 方法三：单层for循环 + indexOf
function unique(array){
  var res = [];
  for(var i = 0; i < array.length; i++) {
    //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
    if (array.indexOf(array[i]) === i) {
        res.push(array[i])
    }
  }
  return res;
}
// 方法三点三：或者这样
function unique(array){
  let res = [];
  for(var i = 0; i < array.length; i++) {
    if (res.indexOf(array[i]) === -1) {
        res.push(array[i]);
    }
  }
  return res;
}

// 方法四：面试官说如果可以容忍改变原有数组的情况下，怎么改进性能更好
function unique(array){
  // 注意这里一定要倒叙for循环，否则会出现问题
  for(var i = array.length - 1; i > 0; i--) {
    if (array.indexOf(array[i]) !== i) {
        array.splice(i, 1);
    }
  }
  // 因为少声明一个变量，节省了内存空间（虽然可以忽略不计，但是面试嘛～）
  return array;
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

function deepFlatten (arr) {
  return arr.reduce((prev, item) => {
    return prev.concat(Array.isArray(item) ? deepFlatten(item) : item);
  }, []);
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

### 合并数组中相邻且重复的元素

```js
const merge = array => Array.isArray(array)
                        ? array.reduce((a, b) => a[a.length - 1] === b ? a
                        : [...a, b], []) : [];

console.log(merge([1,1,2,3,2]))//[1, 2, 3, 2]
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
    if(value instanceof Promise) {
      return value.then(resolve, reject);
    }
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

Promise.all = function (promises) {
  const res = [];
  const len = promises.length;
  return new Promise (function (resolve, reject) {
    promises.forEach(p => {
      p.then(function (value) {
        res.push(value);
        if (res.length === len) {
          resolve(res);
        }
      }, reject)
    })
  });
};

Promise.race = function (promises) {
  return new Promise (function (resolve, reject) {
    promises.forEach(p => {
      p.then(resolve, reject);
    });
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

### 实现 Promise.finally

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作，使用方法如下：

```js
Promise
	.then(result => { ··· })
	.catch(error => { ··· })
	.finally(() => { ··· })
```
finally 特点：
- 不接收任何参数。
- finally 本质上是 then 方法的特例。

```js
Promise.prototype.finally = function (callback) {
  const P = this.construtor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => p.resolve(callback()).then(() => {throw reason})
  )
}
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

### 两个数不使用四则运算得出和

```js
const sum = (num1, num2) => {
  if (num1) return num2;
  if (num2) return num1;
  const newNum1 = num1 ^ num2;
  const newNum2 = (num1 & num2) << 1;
  return sum(newNum1, newNum2);
}
```

### 斐波那契数列

```js
//递归
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
```

```js
//循环
function fib(n) {
  if (n < 2) return n;
  let num1 = 0;
  let num2 = 1;
  for (let i = 2; i <= n; i++) {
    let temp = num2;
    num2 = num1 + num2;
    num1 = temp;
  }
  return num2;
}
```

### 最长递增子序列

```js

function lis(n) {
  if (n.length === 0) return 0
  // 创建一个和参数相同大小的数组，并填充值为 1
  let array = new Array(n.length).fill(1)
  // 从索引 1 开始遍历，因为数组已经所有都填充为 1 了
  for (let i = 1; i < n.length; i++) {
    // 从索引 0 遍历到 i
    // 判断索引 i 上的值是否大于之前的值
    for (let j = 0; j < i; j++) {
      if (n[i] > n[j]) {
        array[i] = Math.max(array[i], 1 + array[j])
      }
    }
  }

  return Math.max.apply(null, array);
}

console.log(lis([0, 3, 4, 17, 2, 8, 6, 10])) // 5

```

### 数字千位分隔符

```js
function commafy(num) {
  return num && num
    .toString()
    .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ",";
    });
}
 console.log(commafy(1312567.903000)) //1,312,567.903
```

### 观察者模式

```js
class Events {
  constructor() {
    this._events = Object.create(null);
  }

  on (event, fn) {
    this._events[event] = this._events[event] || [];
    this._events[event].push(fn);
  }

  emit (event) {
    let cbs = this._events[event];
    if (cbs) {
      cbs.forEach(cb => {
        cb.apply(this, [...arguments].slice(1));
      });
    }
  }

  off (event, fn) {
    if (!arguments.length) {
      this._events = Object.create(null);
      return;
    }
    let cbs = this._events[event];
    if (!cbs) return;
    if (!fn) {
      this._events[event] = null;
      return;
    }

    let cb;
    let i = cbs.length;
    while(i--) {
      cb = cbs[i];
      if (cb === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
  }

  once (event, fn) {
    const _this = this;
    function on () {
      _this.off(event, on);
      fn.apply(this, arguments);
    }

    _this.on(event, on);
  }

}
```
