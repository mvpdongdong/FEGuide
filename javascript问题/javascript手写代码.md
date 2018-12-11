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
