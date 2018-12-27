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
