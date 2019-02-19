### JavaScript 的组成

JavaScript 由以下三部分组成：

-   ECMAScript（核心）：JavaScript 语言基础
-   DOM（文档对象模型）：规定了访问 HTML 和 XML 的接口
-   BOM（浏览器对象模型）：提供了浏览器窗口之间进行交互的对象和方法

### JS 的基本数据类型和引用数据类型

-   基本数据类型：undefined、null、boolean、number、string、symbol
-   引用数据类型：object、array、function

### 检测浏览器版本版本有哪些方式？

-   根据 navigator.userAgent // UA.toLowerCase().indexOf('chrome')
-   根据 window 对象的成员 // 'ActiveXObject' in window

### 介绍 JS 有哪些内置对象？

-   数据封装类对象：Object、Array、Boolean、Number、String
-   其他对象：Function、Arguments、Math、Date、RegExp、Error
-   ES6 新增对象：Symbol、Map、Set、Promise、Proxy、Reflect

### 说几条写 JavaScript 的基本规范？

-   代码缩进，建议使用“四个空格”缩进
-   代码段使用花括号{}包裹
-   语句结束使用分号;
-   变量和函数在使用前进行声明
-   以大写字母开头命名构造函数，全大写命名常量
-   规范定义 JSON 对象，补全双引号
-   用{}和[]声明对象和数组

### 如何编写高性能的 JavaScript？

-   遵循严格模式："use strict";
-   将 js 脚本放在页面底部，加快渲染页面
-   将 js 脚本将脚本成组打包，减少请求
-   使用非阻塞方式下载 js 脚本
-   尽量使用局部变量来保存全局变量
-   尽量减少使用闭包
-   使用 window 对象属性方法时，省略 window
-   尽量减少对象成员嵌套
-   缓存 DOM 节点的访问
-   通过避免使用 eval() 和 Function() 构造器
-   给 setTimeout() 和 setInterval() 传递函数而不是字符串作为参数
-   尽量使用直接量创建对象和数组
-   最小化重绘(repaint)和回流(reflow)

### DOM 元素 e 的 e.getAttribute(propName)和 e.propName 有什么区别和联系

-   e.getAttribute()，是标准 DOM 操作文档元素属性的方法，具有通用性可在任意文档上使用，返回元素在源文件中设置的属性
-   e.propName 通常是在 HTML 文档中访问特定元素的特性，浏览器解析元素后生成对应对象（如 a 标签生成 HTMLAnchorElement），这些对象的特性会根据特定规则结合属性设置得到，对于没有对应特性的属性，只能使用 getAttribute 进行访问
-   e.getAttribute()返回值是源文件中设置的值，类型是字符串或者 null（有的实现返回""）
-   e.propName 返回值可能是字符串、布尔值、对象、undefined 等
-   大部分 attribute 与 property 是一一对应关系，修改其中一个会影响另一个，如 id，title 等属性
-   一些布尔属性`<input hidden/>`的检测设置需要 hasAttribute 和 removeAttribute 来完成，或者设置对应 property
-   像`<a href="../index.html">link</a>`中 href 属性，转换成 property 的时候需要通过转换得到完整 URL
-   一些 attribute 和 property 不是一一对应如：form 控件中`<input value="hello"/>`对应的是 defaultValue，修改或设置 value property 修改的是控件当前值，setAttribute 修改 value 属性不会改变 value property

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

-   offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
-   clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
-   scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

### 描述浏览器的渲染过程，DOM 树和渲染树的区别？

浏览器的渲染过程：

-   解析 HTML 构建 DOM(DOM 树)，并行请求 css/image/js
-   CSS 文件下载完成，开始构建 CSSOM(CSS 树)
-   CSSOM 构建结束后，和 DOM 一起生成 Render Tree(渲染树)
-   布局(Layout)：计算出每个节点在屏幕中的位置
-   显示(Painting)：通过显卡把页面画到屏幕上

DOM 树 和 渲染树 的区别：

-   DOM 树与 HTML 标签一一对应，包括 head 和隐藏元素
-   渲染树不包括 head 和隐藏元素，大段文本的每一个行都是独立节点，每一个节点都有对应的 css 属性

### 重绘和回流（重排）的区别和关系？

-   重绘：当渲染树中的元素外观（如：颜色）发生改变，不影响布局时，产生重绘
-   回流：当渲染树中的元素的布局（如：尺寸、位置、隐藏/状态状态）发生改变时，产生重绘回流
-   注意：JS 获取 Layout 属性值（如：offsetLeft、scrollTop、getComputedStyle 等）也会引起回流。因为浏览器需要通过回流计算最新值
-   回流必将引起重绘，而重绘不一定会引起回流

### 如何最小化重绘(repaint)和回流(reflow)？

-   需要要对元素进行复杂的操作时，可以先隐藏(display:"none")，操作完成后再显示
-   需要创建多个 DOM 节点时，使用 DocumentFragment 创建完后一次性的加入 document
-   缓存 Layout 属性值，如：var left = elem.offsetLeft; 这样，多次使用 left 只产生一次回流
-   尽量避免用 table 布局（table 元素一旦触发回流就会导致 table 里所有的其它元素回流）
-   避免使用 css 表达式(expression)，因为每次调用都会重新计算值（包括加载页面）
-   尽量使用 css 属性简写，如：用 border 代替 border-width, border-style, border-color
    批量修改元素样式：elem.className 和 elem.style.cssText 代替 elem.style.xxx
参考文章：[你真的了解回流和重绘吗](https://juejin.im/post/5c0f104551882509a7683d63)

### 性能优化方面

参考文档: [(google)关键渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=zh-cn)、[(google)渲染性能](https://developers.google.com/web/fundamentals/performance/rendering/?hl=zh-cn)

### 解释 JavaScript 中的作用域与变量声明提升？

JavaScript 作用域：

-   在 Java、C 等语言中，作用域为 for 语句、if 语句或{}内的一块区域，称为作用域；
-   而在 JavaScript 中，作用域为 function(){}内的区域，称为函数作用域。

JavaScript 变量声明提升：

-   在 JavaScript 中，函数声明与变量声明经常被 JavaScript 引擎隐式地提升到当前作用域的顶部。
-   声明语句中的赋值部分并不会被提升，只有名称被提升
-   函数声明的优先级高于变量，如果变量名跟函数名相同且未赋值，则函数声明会覆盖变量声明
-   如果函数有多个同名参数，那么最后一个参数（即使没有定义）会覆盖前面的同名参数

### 介绍 JavaScript 的原型，原型链？有什么特点？

原型：

-   JavaScript 的所有对象中都包含了一个 [proto] 内部属性，这个属性所对应的就是该对象的原型
-   JavaScript 的函数也是一种对象，除了原型 [proto] 之外，还预置了 prototype 属性
-   当函数对象作为构造函数创建实例时，该 prototype 属性值将被作为实例对象的原型 [proto]。

原型链：

-   当一个对象调用的属性/方法自身不存在时，就会去自己 [proto] 关联的前辈 prototype 对象上去找
-   如果没找到，就会去该 prototype 原型 [proto] 关联的前辈 prototype 去找。依次类推，直到找到属性/方法或 undefined 为止。从而形成了所谓的“原型链”

原型特点：

-   JavaScript 对象是通过引用来传递的，当修改原型时，与之相关的对象也会继承这一改变

### JavaScript 有几种类型的值？，你能画一下他们的内存图吗

-   原始数据类型（Undefined，Null，Boolean，Number、String）-- 栈
-   引用数据类型（对象、数组和函数）-- 堆
-   两种类型的区别是：存储位置不同：
-   原始数据类型是直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据；
-   引用数据类型存储在堆(heap)中的对象，占据空间大、大小不固定，如果存储在栈中，将会影响程序运行的性能；
-   引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。
-   当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

### javascript 创建对象的几种方式？

1. 工厂模式

```js
function createPerson(name, age, job) {
  var o = {
    name: name,
    age : age,
    job : job,

    sayName: function() {
      alert(this.name);
    }
  };

  return o;
}

var person1 = createPerson("steve", 24, "fe");
var person2 = createPerson("young", 25, "fs");
```
问题：没有解决对象识别的问题（即怎样知道一个对象的类型），重复构造相同的方法造成内存浪费，也无法进行继承复用。

2. 构造函数模式

```js
function Person(name, age, job) {
  this.name = name;
  this.age  = age;
  this.job  = job;

  this.sayName = function() {
    alert(this.name);
  };
}

var person1 = new Person("steve", 24, "fe");
var person2 = new Person("young", 25, "fs");

alert(person1.constructor === Person); // true
alert(person2.constructor === Person); // true

```
问题：每个方法有独立的内存，造成浪费。

3. 原型模式

```js
function Person() {}

// 属性
Person.prototype.name = "steve";
Person.prototype.age  = 24;
Person.prototype.job  = "Web Developer";

// 方法
Person.prototype.sayName = function() {
  alert(this.name);
};

var person1 = new Person();
person1.sayName(); // steve

var person2 = new Person();
person2.sayName(); // steve

alert(person1.sayName === person2.sayName); // true 共享同一个方法
```
问题：无法为实例生成单独的属性, 不能初始化参数。

4. 组合使用构造函数模式和原型模式

- 构造函数用于定义实例属性
- 原型模式用于定义共享的属性和方法

```js
function Person(name, age, job) {
  this.name    = name;
  this.age     = age;
  this.job     = job;
  this.friends = ["shirley", "jame"];
}

Person.prototype = {
  constructor: Person,

  sayName: function() {
    alert(this.name);
  }
};

var person1 = new Person("steve", 24, "Web Developer");
var person2 = new Person("nicholas", 29, "Soft Engineer");

person1.friends.push("van");

alert(person1.friends); // ["shirley", "jame","van"]
alert(person2.friends); // ["shirley", "jame"]
alert(person1.friends === person2.friends); // false
alert(person1.sayName === person2.sayName); // true
```

5. 动态原型模式
本质其实还是组合模式，只不过把原型对象中共享的属性和方法，也封装在构造函数里…
```js
function Person(name, age, job) {
  this.name    = name;
  this.age     = age;
  this.job     = job;
  this.friends = ["shirley", "jame"];

  if (typeof this.sayName != "function") {
    // 不能使用对象字面量 Person.prototype = {...};
    Person.prototype.sayName = function() {
      alert(this.name);
    };
  }
}

var person1 = new Person("steve", 24, "Web Developer");
var person2 = new Person("nicholas", 29, "Soft Engineer");

person1.friends.push("van");

alert(person1.friends); // ["shirley", "jame","van"]
alert(person2.friends); // ["shirley", "jame"]
alert(person1.friends === person2.friends); // false
alert(person1.sayName === person2.sayName); // true

```

6. 寄生构造函数模式

```js
function SpecialArray() {
  // 内部创建一个新数组
  var values = new Array();

  // 添加值
  values.push.apply(values, arguments);

  // 添加方法
  values.toPipedString = function() {
    return this.join("|");
  };

  return values;
}

var colors = new SpecialArray("red", "blue", "green"); // 注意：使用 new 创建实例
alert(colors.toPipedString()); // red|blue|green
```
这个模式其实利用了构造函数的特性：
- 如果被调用的函数没有显式的 return 表达式，则隐式地会返回 this 对象 - 也就是新创建的隐式对象。
- 显式的 return 表达式将会影响返回结果，但仅限于返回的是一个对象。

7. 稳妥构造函数模式

```js
function Person(name, age, job) {
  //创建要返回的对象
  var o = new Object();

  //可以在这里定义私有变量和函数

  //添加方法
  o.sayName = function() {
    alert(name); // 注意：这里没有使用 this，因此我的理解是相当于闭包，保存住了外部 Person 的 AO（活动对象）
  };

  //返回对象
  return o;
}

var person = Person("steve", 24, "web developer");
person.sayName(); //"steve"
```
这里变量 person 中保存的就是一个稳妥对象(没有公共属性，而且方法也不引用 this 的对象)，因为除了调用 sayName() 方法以外，没有别的方法可以访问内部的数据。
主要用在需要安全的环境（禁止 this 和 new），或者在防止数据被其他程序（如 Mashup）改动时使用。

### Javascript 如何实现继承？

1. 原型链模式

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function() {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

SubType.prototype = new SuperType(); // 注意：使用 new 生成父类实例，重写了原型对象

// 必须后添加方法
SubType.prototype.getSubValue = function() {
  return this.subproperty;
};

var instance = new SubType();
alert(instance.getSuperValue()); // true，成功继承父类原型对象上的方法
alert(instance.constructor);
```

原型链的问题
- 引用类型属性的问题：相当于将父类属性添加到子类原型对象上形成共享。
- 创建子类实例时，不能向超类型的构造函数中传递参数：准确的说是无法在不影响所有对象实例的情况下，给父类的构造函数传递参数。

2. 借用构造函数

```js
function SuperType(name) {
  this.name = name;
}

function SubType() {
  SuperType.call(this, 'steve');

  this.age = 24;
}

var instance = new SubType();
alert(instance.name); // steve
alert(instance.age);  // 24
```

借用构造函数的问题：方法都在构造函数中定义，无法函数复用，子类方法也无法使用父类原型对象中的方法。

3. 组合继承

```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
  return this.name;
};

function SubType(name, age) {

  // 借用构造函数继承属性
  SuperType.call(this, name);

  this.age = age;
}

// 使用原型链继承了方法
SubType.prototype = new SuperType();
```

组合继承问题：```SubType.prototype = new SuperType();```使SubType.prototype 上也拥有了一个值为 undefined 的 name 属性和 colors 数组。这不是我们的本意，这就是直接使用 new 操作符将父类实例赋值给子类原型对象的副作用。

4. 原型式继承：将子对象的 prototype 指向父对象的 prototype

```js
function object(o) {
  function F() {}

  F.prototype = o;

  return new F();
}
```
即先创建一个临时性的构造函数 F，然后将传入的对象 o 作为这个构造函数的原型 F.prototype，最后返回这个临时类型的一个新实例 new F()。从本质上将就是对于传入的对象 o 进行了一次浅复制。

```js
var person = {
  name: "steve",
  friends: ["shirley", "jame"]
};

var anotherPerson = object(person);
anotherPerson.name = "young";
anotherPerson.friends.push("sasuke");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "nicholas";
yetAnotherPerson.friends.push("jobs");

alert(person.friends); // shirley,jame,sasuke,jobs，friends 被共享了
```
ES5 中新增了 ```Object.create()``` 方法规范化了原型式继承。可以接收两个参数，第一个参数就是要继承的对象，第二个对象是可选的一个为新对象定义额外属性的对象。其实只传一个参数时，两个方法行为相同。

第二个参数与```Object.defineProperties()``` 方法的第二个参数格式相同（覆盖同名属性），见下例。

```js
var person = {
  name: "steve",
  friends: ["shirley", "jame"]
};

var anotherPerson = Object.create(person, {
  name: {
    value: "greg",
    configurable: false
  }
});

alert(anotherPerson.name); // greg
```

5. 寄生式继承
基本思路类似用工厂模式包装原型式继承：创建一个仅用于封装继承过程的函数，在内部以某种方式来增强对象，最后返回该对象。

```js
var person = {
  name: "steve",
  friends: ["shirley", "jame"]
};

function createAnother(original) {
  var clone = object(original); // 原型式继承对象 original

  // 增强对象
  clone.sayHi = function() {
    alert("Hi");
  };

  return clone; // 返回对象
}

var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // Hi
```

6. 寄生组合式继承
用原型式继承，让子类原型式继承父类的原型对象，解决组合继承问题
```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}

SuperType.prototype.sayName = function() {
  alert(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name); // 借用构造函数，继承父类属性（解决了传参）

  this.age = age;
}

SubType.prototype = Object.create(SuperType.prototype, {
  constructor: {
    value       : SubType, // 指回子类构造函数
    enumerable  : false,   // 默认值，其实可以不写
    writable    : true,
    configurable: true,
  }
});

// 必须后添加方法（不然方法就加到之前的对象上去了_(:зゝ∠)_，要理解指针）
SubType.prototype.sayAge = function() {
  alert(this.age);
};
```

7. ES6 语法糖 extends：class ColorPoint extends Point {}

```js
class ColorPoint extends Point {
    constructor(x, y, color) {
      super(x, y); // 调用父类的constructor(x, y)
      this.color = color;
    }
    toString() {
      return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}
```

#### 创建对象
- 工厂模式：简单地在函数内部创建对象，添加属性和方法，然后返回对象。
- 构造函数模式：在函数内部使用 this 添加属性和方法，可以创建自定义引用类型，可以使用 new 操作符创建实例。但是无法实现函数复用，造成内存浪费等问题。
- 原型模式：使用构造函数的 prototype 属性来指定共享的属性和方法，本质上就是为了共享而生。
- 组合模式：结合构造函数和原型模式的优点。

#### 对象继承
- 原型链：将父类的实例赋值给子类构造函数的原型对象。但这样会有两个问题：传参和子类原型上有多余的父类构造函数中的属性。
- 借用构造函数：为了解决传参问题，采用在子类中调用父类构造函数的方法。
- 原型式：可以在不必预先定义构造函数的情况下实现继承，本质是执行对给定对象的浅复制。
- 寄生组合式：巧妙利用原型式继承解决原型链中的第二个问题，是基于类型继承的最好方式。

### 谈谈 this 对象的理解

-   this 总是指向函数的直接调用者
-   如果有 new 关键字，this 指向 new 出来的实例对象
-   在事件中，this 指向触发这个事件的对象
-   IE 下 attachEvent 中的 this 总是指向全局对象 Window

### eval 是做什么的？

eval 的功能是把对应的字符串解析成 JS 代码并运行

-   应该避免使用 eval，不安全，非常耗性能（先解析成 js 语句，再执行）
-   由 JSON 字符串转换为 JSON 对象的时候可以用 eval('('+ str +')');

### 什么是 Window 对象? 什么是 Document 对象?

-   Window 对象表示当前浏览器的窗口，是 JavaScript 的顶级对象
-   我们在全局作用域创建的所有对象、函数、变量都是 Window 对象的成员
-   Window 对象的方法和属性是在全局范围内有效的
-   Document 对象是 HTML 文档的根节点
-   Document 对象使我们可以通过脚本对 HTML 页面中的所有元素进行访问
-   Document 对象是 Window 对象的一部分，可通过 window.document 属性对其进行访问

### 介绍 DOM 的发展

-   DOM：文档对象模型（Document Object Model），定义了访问 HTML 和 XML 文档的标准，与编程语言及平台无关
-   DOM0：提供了查询和操作 Web 文档的内容 API。未形成标准，实现混乱。如：document.forms['login']
-   DOM1：W3C 提出标准化的 DOM，简化了对文档中任意部分的访问和操作。如：JavaScript 中的 Document 对象
-   DOM2：原来 DOM 基础上扩充了鼠标事件等细分模块，增加了对 CSS 的支持。如：getComputedStyle(elem, pseudo)
-   DOM3：增加了 XPath 模块和加载与保存（Load and Save）模块。如：XPathEvaluator

### 介绍 DOM0，DOM2，DOM3 事件处理方式区别

DOM0 级事件处理方式：

-   btn.onclick = func;
-   btn.onclick = null;

DOM2 级事件处理方式：

-   btn.addEventListener('click', func, false);
-   btn.removeEventListener('click', func, false);
-   btn.attachEvent("onclick", func);
-   btn.detachEvent("onclick", func);

DOM3 级事件处理方式：

-   eventUtil.addListener(input, "textInput", func);
-   eventUtil 是自定义对象，textInput 是 DOM3 级事件

### 事件的三个阶段

捕获、目标、冒泡

### 介绍事件“捕获”和“冒泡”执行顺序和事件的执行次数？

按照 W3C 标准的事件：首是进入捕获阶段，直到达到目标元素，再进入冒泡阶段

事件执行次数（DOM2-addEventListener）：元素上绑定事件的个数

-   注意 1：前提是事件被确实触发
-   注意 2：事件绑定几次就算几个事件，即使类型和功能完全一样也不会“覆盖”

事件执行顺序：判断的关键是否目标元素

-   非目标元素：根据 W3C 的标准执行：捕获->目标元素->冒泡（不依据事件绑定顺序）
-   目标元素：依据事件绑定顺序：先绑定的事件先执行（不依据捕获冒泡标准）
-   最终顺序：父元素捕获->目标元素事件 1->目标元素事件 2->父元素冒泡

### 在一个 DOM 上同时绑定两个点击事件：一个用捕获，一个用冒泡。事件会执行几次，先执行冒泡还是捕获？

-   该 DOM 上的事件如果被触发，会执行两次（执行次数等于绑定次数）
-   如果该 DOM 是目标元素，则按事件绑定顺序执行，不区分冒泡/捕获
-   如果该 DOM 是处于事件流中的非目标元素，则先执行捕获，后执行冒泡

### 事件的代理/委托

事件委托是指将事件绑定到目标元素的到父元素上，利用冒泡机制触发该事件

优点：

-   可以减少事件注册，节省大量内存占用
-   可以将事件应用于动态添加的子元素上

缺点：

- 事件委托基于冒泡，对于不冒泡的事件不支持。
- 层级过多，冒泡过程中，可能会被某层阻止掉。
- 理论上委托会导致浏览器频繁调用处理函数，虽然很可能不需要处理。所以建议就近委托，比如在table上代理td，而不是在document上代理td。
- 把所有事件都用代理就可能会出现事件误判。比如，在document中代理了所有button的click事件，另外的人在引用改js时，可能不知道，造成单击button触发了两个click事件。

示例：

```js
ulEl.addEventListener('click', function(event){
  var target = event.target || event.srcElement;
  if(!!target && target.nodeName.toUpperCase() === "LI"){
    console.log(target.innerHTML);
  }
}, false);
```

### IE 与火狐的事件机制有什么区别？ 如何阻止冒泡？

IE 只事件冒泡，不支持事件捕获；火狐同时支持件冒泡和事件捕获。

阻止冒泡：

- 取消默认操作: w3c 的方法是 e.preventDefault()，IE 则是使用 e.returnValue = false;
- ```return false```, javascript 的 ```return false``` 只会阻止默认行为，而是用 jQuery 的话则既阻止默认行为又防止对象冒泡。
- 阻止冒泡 w3c 的方法是 e.stopPropagation()，IE 则是使用 e.cancelBubble = true

```js
[js] view plaincopy
function stopHandler(event)
  window.event ? window.event.cancelBubble = true : event.stopPropagation();
}
```

参考链接:[浅谈 javascript 事件取消和阻止冒泡-开源中国 2015](http://wiki.jikexueyuan.com/project/brief-talk-js/event-cancellation-and-prevent-bubbles.html)

### 不支持冒泡的事件

- UI事件
  - load
  - unload
  - scroll
  - resize
  - error
- 焦点事件
  - focus
  - blur
- 鼠标事件
  - mouseleave
  - mouseenter

### IE 的事件处理和 W3C 的事件处理有哪些区别？(必考)

绑定事件

- W3C: ```targetEl.addEventListener('click', handler, false)```;
- IE: ```targetEl.attachEvent('onclick', handler)```;

删除事件

- W3C: ```targetEl.removeEventListener('click', handler, false)```;
- IE: ```targetEl.detachEvent('onclick\', handler)```;

事件对象

- W3C: 事件回调函数中的参数e
- IE: ```window.event```

事件目标

- W3C: ```e.target```
- IE: ```window.event.srcElement```

阻止事件默认行为

- W3C: ```e.preventDefault()```
- IE: ```window.event.returnValue = false'```

阻止事件传播

- W3C: ```e.stopPropagation()```
- IE: ```window.event.cancelBubble = true```

### W3C 事件的 target 与 currentTarget 的区别？

-  target 只会出现在事件流的目标阶段
-  currentTarget 可能出现在事件流的任何阶段
-  当事件流处在目标阶段时，二者的指向相同
-  当事件流处于捕获或冒泡阶段时：currentTarget 指向当前事件活动的对象(一般为父级)

### 如何派发事件(dispatchEvent)？（如何进行事件广播？）

-  W3C: 使用 dispatchEvent 方法
-  IE: 使用 fireEvent 方法

```js
var fireEvent = function(element, event){
  if (document.createEventObject) {//ie
    var mockEvent = document.createEventObject();
    return element.fireEvent('on' + event, mockEvent)
  } else {//w3c
    var mockEvent = new Event(event, {bubbles: true, cancelable: true});
    return element.dispatchEvent(mockEvent);
  }
}
```

### 区分什么是“客户区坐标”、“页面坐标”、“屏幕坐标”？

- 客户区坐标：鼠标指针在可视区中的水平坐标(clientX)和垂直坐标(clientY)
- 页面坐标：鼠标指针在页面布局中的水平坐标(pageX)和垂直坐标(pageY)
- 屏幕坐标：设备物理屏幕的水平坐标(screenX)和垂直坐标(screenY)

### 如何获得一个 DOM 元素的绝对位置？

- elem.offsetLeft：返回元素相对于其定位父级左侧的距离
- elem.offsetTop：返回元素相对于其定位父级顶部的距离
- elem.getBoundingClientRect()：返回一个 DOMRect 对象，包含一组描述边框的只读属性，单位像素

### 分析 ['1', '2', '3'].map(parseInt) 答案是多少？（常考）

答案:[1, NaN, NaN]

parseInt(string, radix) 第 2 个参数 radix 表示进制。省略 radix 或 radix = 0，则数字将以十进制解析

map 每次为 parseInt 传 3 个参数(elem, index, array)，其中 index 为数组索引

因此，map 遍历 ["1", "2", "3"]，相应 parseInt 接收参数如下

```js
parseInt('1', 0);  // 1
parseInt('2', 1);  // NaN
parseInt('3', 2);  // NaN
```

所以，parseInt 参数 radix 不合法，导致返回值为 NaN

### new 操作符具体干了什么？

-  创建实例对象，this 变量引用该对象，同时还继承了构造函数的原型
-  执行构造函数，使属性和方法被加入到 this 引用的对象中
-  新创建的对象由 this 所引用，并且最后隐式的返回 this
提示：如果返回值不是对象类型，则还是返回this；

### 用原生 JavaScript 的实现过什么功能吗？

封装选择器、调用第三方 API、设置和获取样式(自由回答)

### 解释一下这段代码的意思吗？

```js
  [].forEach.call($$("*"), function(el){
    el.style.outline = "1px solid #" + (~~(Math.random()*(1<<24))).toString(16);
  })
```

解释：获取页面所有的元素，遍历这些元素，为它们添加 1 像素随机颜色的轮廓(outline)

### JavaScript 实现异步编程的方法？

- 回调函数
- 事件监听
- 发布/订阅
- Promises 对象
- Async 函数[ES7]

### web 开发中会话跟踪的方法有哪些

- cookie
- session
- url 重写
- 隐藏 input
- ip 地址

### javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？

use strict 是一种 ECMAscript 5 添加的（严格）运行模式,这种模式使得 Javascript 在更严格的条件下运行,使 JS 编码更加规范化的模式,消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为

### 如何判断一个对象是否属于某个类？

```js
// 使用instanceof （待完善）
  if(a instanceof Person){
    alert('yes');
  }
```

### js 延迟加载的方式有哪些？

defer 和 async、动态创建 DOM 方式（用得最多）、按需异步载入 js

### defer 和 async

defer 并行加载 js 文件，会按照页面上 script 标签的顺序执行 async 并行加载 js 文件，下载完成立即执行，不会按照页面上 script 标签的顺序执行

### Ajax 是什么? 如何创建一个 Ajax？

ajax 的全称：Asynchronous Javascript And XML

异步传输+js+xml

所谓异步，在这里简单地解释就是：向服务器发送请求的时候，我们不必等待结果，而是可以同时做其他的事情，等到有了结果它自己会根据设定进行后续操作，与此同时，页面是不会发生整页刷新的，提高了用户体验

- 创建 XMLHttpRequest 对象,也就是创建一个异步调用对象
- 建一个新的 HTTP 请求,并指定该 HTTP 请求的方法、URL 及验证信息
- 设置响应 HTTP 请求状态变化的函数
- 发送 HTTP 请求
- 获取异步调用返回的数据
- 用 JavaScript 和 DOM 实现局部刷新

### 同步和异步的区别?

- 同步：浏览器访问服务器请求，用户看得到页面刷新，重新发请求,等请求完，页面刷新，新内容出现，用户看到新内容,进行下一步操作
- 异步：浏览器访问服务器请求，用户正常操作，浏览器后端进行请求。等请求完，页面不刷新，新内容也会出现，用户看到新内容

### documen.write 和 innerHTML 的区别

- document.write 只能重绘整个页面
- innerHTML 可以重绘页面的一部分

### DOM 操作——怎样添加、移除、移动、复制、创建和查找节点?

创建新节点

- createDocumentFragment() //创建一个 DOM 片段
- createElement() //创建一个具体的元素
- createTextNode() //创建一个文本节点

添加、移除、替换、插入

- appendChild()
- removeChild()
- replaceChild()
- insertBefore() //在已有的子节点前插入一个新的子节点

查找

- getElementsByTagName() //通过标签名称
- getElementsByName() // 通过元素的 Name 属性的值(IE 容错能力较强，会得到一个数组，其中包括 id 等于 name 值的) \* getElementById() //通过元素 Id，唯一性

### 那些操作会造成内存泄漏？

- 内存泄漏指任何对象在您不再拥有或需要它之后仍然存在
- 垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量。如果一个对象的引用数量为 0（没有其他对象引用过该对象），或对该对象的惟一引用是循环的，那么该对象的内存即可回收
- setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏
- 闭包、控制台日志、循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）

### 渐进增强和优雅降级

- 渐进增强 ：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。
- 优雅降级 ：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容

### Javascript 垃圾回收方法

标记清除（mark and sweep）

- 这是 JavaScript 最常见的垃圾回收方式，当变量进入执行环境的时候，比如函数中声明一个变量，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”
- 垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量以及被环境中变量所引用的变量（闭包），在这些完成之后仍存在标记的就是要删除的变量了

引用计数(reference counting)

- 在低版本 IE 中经常会出现内存泄露，很多时候就是因为其采用引用计数方式进行垃圾回收。引用计数的策略是跟踪记录每个值被使用的次数，当声明了一个变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加 1，如果该变量的值变成了另外一个，则这个值得引用次数减 1，当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，因此可以将其占用的空间回收，这样垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的空间。但是，对象循环引用情况下，标记次数永远不是0，也就不会被回收，造成内存泄漏，所以，现代浏览器采用标记清除法。

参考链接 [内存管理-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)

### 用过哪些设计模式？

1. 工厂模式：

-   主要好处就是可以消除对象间的耦合，通过使用工程方法而不是 new 关键字。将所有实例化的代码集中在一个位置防止代码重复
-   工厂模式解决了重复实例化的问题 ，但还有一个问题,那就是识别问题，因为根本无法 搞清楚他们到底是哪个对象的实例

```js
function createObject(name,age,profession){
  //集中实例化的函数
  var obj = new Object();
  obj.name = name;
  obj.age = age;
  obj.profession = profession;
  obj.move = function () {
      return this.name + ' at ' + this.age + ' engaged in ' + this.profession;
  };
  return obj;
}
var test1 = createObject('trigkit4',22,'programmer');//第一个实例var test2 = createObject('mike',25,'engineer');//第二个实例
```

2. 构造函数模式

- 使用构造函数的方法 ，即解决了重复实例化的问题 ，又解决了对象识别的问题，该模式与工厂模式的不同之处在于
- 构造函数方法没有显示的创建对象 (new Object());
- 直接将属性和方法赋值给 this 对象;
- 没有 renturn 语句

### 说说你对闭包的理解

使用闭包主要是为了设计私有的方法和变量。闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增大内存使用量，使用不当很容易造成内存泄露。在 js 中，函数即闭包，只有函数才会产生作用域的概念

闭包有三个特性：

- 函数嵌套函数
- 函数内部可以引用外部的参数和变量
- 参数和变量不会被垃圾回收机制回收

### 请解释一下 JavaScript 的同源策略

- 概念:同源策略是客户端脚本（尤其是 Javascript）的重要的安全度量标准。它最早出自 Netscape Navigator2.0，其目的是防止某个文档或脚本从多个不同源装载。这里的同源策略指的是：协议，域名，端口相同，同源策略是一种安全协议
- 指一段脚本只能读取来自同一来源的窗口和文档的属性

### 为什么要有同源限制？

我们举例说明：比如一个黑客程序，他利用 Iframe 把真正的银行登录页面嵌到他的页面上，当你使用真实的用户名，密码登录时，他的页面就可以通过 Javascript 读取到你的表单中 input 中的内容，这样用户名，密码就轻松到手了。]

### 说说严格模式的限制

-   严格模式主要有以下限制：
-   变量必须声明后再使用
-   函数的参数不能有同名属性，否则报错
-   不能使用 with 语句
-   不能对只读属性赋值，否则报错
-   不能使用前缀 0 表示八进制数，否则报错
-   不能删除不可删除的属性，否则报错
-   不能删除变量 delete prop，会报错，只能删除属性 delete global[prop]
-   eval 不会在它的外层作用域引入变量
-   eval 和 arguments 不能被重新赋值
-   arguments 不会自动反映函数参数的变化
-   不能使用 arguments.callee
-   不能使用 arguments.caller
-   禁止 this 指向全局对象
-   不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈
-   增加了保留字（比如 protected、static 和 interface）

### 如何删除一个 cookie

将时间设为当前时间往前一点

```js
var date = new Date();
date.setDate(date.getDate() - 1);//真正的删除
```

setDate()方法用于设置一个月的某一天

expires 的设置

```js
  document.cookie = 'user='+ encodeURIComponent('name')  + ';expires = ' + new Date(0)
```

### 编写一个方法 求一个字符串的字节长度

假设：一个英文字符占用一个字节，一个中文字符占用两个字节

```js
function GetBytes(str){
  var len = str.length;
  var bytes = len;
  for(var i=0; i<len; i++){
    if (str.charCodeAt(i) > 255) bytes++;
  }
  return bytes;
}

alert(GetBytes("你好,as"));
```

### attribute 和 property 的区别是什么？

- attribute 是 dom 元素在文档中作为 html 标签拥有的属性；
- property 就是 dom 元素在 js 中作为对象拥有的属性。
- 对于 html 的标准属性来说，attribute 和 property 是同步的，是会自动更新的
- 但是对于自定义的属性来说，他们是不同步的

### 页面编码和被请求的资源编码如果不一致如何处理？

-   后端响应头设置 charset
-   前端页面`<meta>`设置 charset

### 把 `<script>` 放在 `</body>` 之前和之后有什么区别？浏览器会如何解析它们？

按照 HTML 标准，在</body>结束后出现`<script>`或任何元素的开始标签，都是解析错误
虽然不符合 HTML 标准，但浏览器会自动容错，使实际效果与写在`</body>`之前没有区别
浏览器的容错机制会忽略`<script>`之前的</body>，视作`<script>`仍在 body 体内。省略`</body>`和`</html>`闭合标签符合 HTML 标准，服务器可以利用这一标准

### 把 `<script>` 放在 `</head>` 中会有什么问题？

在浏览器渲染页面之前，它需要通过解析HTML标记然后构建DOM树。在这个过程中，如果解析器遇到了一个脚本(script)，它就会停下来，并且执行这个脚本，然后才会继续解析HTML。如果遇到了一个引用外部资源的脚本(script)，它就必须停下来等待这个脚本资源的下载，而这个行为会导致一个或者多个的网络往返，并且会延迟页面的首次渲染时间。

还有一点是需要我们注意的，那就是外部引入的脚本(script)会阻塞浏览器的并行下载，HTTP/1.1规范表明，浏览器在每个主机下并行下载的组件不超过两个(也就是说，浏览器一次只能够同时从同一个服务器加载两个脚本)；如果你网站的图片是通过多个服务器提供的，那么按道理来说，你的网站可以一次并行下载多张图片。

### 异步加载 JS 的方式有哪些？

- 设置`<script>`属性 async="async" （一旦脚本可用，则会异步执行）
- 动态创建 script DOM：document.createElement('script');
- XmlHttpRequest 脚本注入
- 异步加载库 LABjs
- 模块加载器 Sea.js

### JavaScript 中，调用函数有哪几种方式？

- 方法调用模式 Foo.foo(arg1, arg2);
- 函数调用模式 foo(arg1, arg2);
- 构造器调用模式 (new Foo())(arg1, arg2);
- call/applay 调用模式 Foo.foo.call(that, arg1, arg2);
- bind 调用模式 Foo.foo.bind(that)(arg1, arg2)();

### 列举一下 JavaScript 数组和对象有哪些原生方法

- 数组：
  - arr.concat(arr1, arr2, arrn);
  - arr.join(",");
  - arr.sort(func);
  - arr.pop();
  - arr.push(e1, e2, en);
  - arr.shift();
  - unshift(e1, e2, en);
  - arr.reverse();
  - arr.slice(start, end);
  - arr.splice(index, count, e1, e2, en);
  - arr.indexOf(el);
  - arr.includes(el); // ES6
- 对象：
  - object.hasOwnProperty(prop);
  - object.propertyIsEnumerable(prop);
  - object.valueOf();
  - object.toString();
  - object.toLocaleString();
  - Class.prototype.isPropertyOf(object);

### Array.slice() 与 Array.splice() 的区别？

- slice -- “读取”数组指定的元素，不会对原数组进行修改

  - 语法：arr.slice(start, end)
  - start 指定选取开始位置（含）
  - end 指定选取结束位置（不含）

- splice
  - “操作”数组指定的元素，会修改原数组，返回被删除的元素
  - 语法：arr.splice(index, count, [insert Elements])
  - index 是操作的起始位置
  - count = 0 插入元素，count > 0 删除元素
  - [insert Elements] 向数组新插入的元素

### JavaScript 对象生命周期的理解？

- 当创建一个对象时，JavaScript 会自动为该对象分配适当的内存
- 垃圾回收器定期扫描对象，并计算引用了该对象的其他对象的数量
- 如果被引用数量为 0，或惟一引用是循环的，那么该对象的内存即可回收

### 哪些操作会造成内存泄漏？

- JavaScript 内存泄露指对象在不需要使用它时仍然存在，导致占用的内存不能使用或回收
- 未使用 var 声明的全局变量
- 闭包函数(Closures)
- 循环引用(两个对象相互引用)
- 控制台日志(console.log)
- 移除存在绑定事件的 DOM 元素(IE)

### 在 javascript 中，1 与 Number(1)有什么区别 [易混淆]

```js
var a = Number(1) // 1
var b = new Number(1)  // Number {[[PrimitiveValue]]: 1}
typeof (a) // number
typeof (b) // object
a == b // true
```

- var a = 1 是一个常量，而 Number(1)是一个函数
- new Number(1)返回的是一个对象
- a==b 为 true 是因为所以在求值过程中，总是会强制转为原始数据类型而非对象，例如下面的代码:

```js
typeof 123 // "number"
typeof new Number(123) // "object"
123 instanceof Number // false
(new Number(123)) instanceof Number // true
123 === new Number(123) // false
```

参考地址：[面试题：在 javascript 中，1 与 Number(1)有什么区别](https://segmentfault.com/q/1010000007552319)

### console.log(!!(new Boolean(false))输出什么 [易混淆]

true

布尔的包装对象 Boolean 的对象实例，对象只有在 null 与 undefined 时，才会认定为布尔的 false 值，布尔包装对象本身是个对象，对象->布尔 都是 true，所以 new Boolean(false)其实是布尔的 true，看下面这段代码:

```js
if(new Boolean(false)){
    alert('true!!');
}
```

只有使用了 valueOf 后才是真正的转换布尔值，与上面包装对象与原始资料转换说明的相同:

```js
!!(new Boolean(false))  //true
(new Boolean(false)).valueOf() //false
```

### 为什么 JS 是单线程,而不是多线程 [常考]

- 单线程是指 JavaScript 在执行的时候，有且只有一个主线程来处理所有的任务。
- 目的是为了实现与浏览器交互。
- 我们设想一下，如果 JavaScript 是多线程的，现在我们在浏览器中同时操作一个 DOM，一个线程要求浏览器在这个 DOM 中添加节点，而另一个线程却要求浏览器删掉这个 DOM 节点，那这个时候浏览器就会很郁闷，他不知道应该以哪个线程为准。所以为了避免此类现象的发生，降低复杂度，JavaScript 选择只用一个主线程来执行代码，以此来保证程序执行的一致性。


### Html中的attibute和property区别

When writing HTML source code, you can define attributes on your HTML elements. Then, once the browser parses your code, a corresponding DOM node will be created. This node is an object, and therefore it has properties.

For instance, this HTML element:
```html
<input type="text" value="Name:">
```
has 2 attributes (type and value).

Once the browser parses this code, a HTMLInputElement object will be created, and this object will contain dozens of properties like: accept, accessKey, align, alt, attributes, autofocus, baseURI, checked, childElementCount, childNodes, children, classList, className, clientHeight, etc.

For a given DOM node object, properties are the properties of that object, and attributes are the elements of the attributes property of that object.

When a DOM node is created for a given HTML element, many of its properties relate to attributes with the same or similar names, but it's not a one-to-one relationship. For instance, for this HTML element:
```html
<input id="the-input" type="text" value="Name:">
```
the corresponding DOM node will have id,type, and value properties (among others):

The id property is a reflected property for the id attribute: Getting the property reads the attribute value, and setting the property writes the attribute value. id is a pure reflected property, it doesn't modify or limit the value.

The type property is a reflected property for the type attribute: Getting the property reads the attribute value, and setting the property writes the attribute value. type isn't a pure reflected property because it's limited to known values (e.g., the valid types of an input). If you had
```html
<input type="foo">
```
, then ```theInput.getAttribute("type")```gives you "foo" but the ```Input.type``` gives you "text".

In contrast, the value property doesn't reflect the value attribute. Instead, it's the current value of the input. When the user manually changes the value of the input box, the value property will reflect this change. So if the user inputs "John" into the input box, then:
```js
theInput.value // returns "John"
```
whereas:
```js
theInput.getAttribute('value') // returns "Name:"
```
The value property reflects the current text-content inside the input box, whereas the value attribute contains the initial text-content of the value attribute from the HTML source code.

So if you want to know what's currently inside the text-box, read the property. If you, however, want to know what the initial value of the text-box was, read the attribute. Or you can use the ```defaultValue``` property, which is a pure reflection of the value attribute:
```js
theInput.value                 // returns "John"
theInput.getAttribute('value') // returns "Name:"
theInput.defaultValue          // returns "Name:"
```
There are several properties that directly reflect their attribute (```rel```, ```id```), some are direct reflections with slightly-different names (```htmlFor``` reflects the ```for``` attribute, ```className``` reflects the ```class``` attribute), many that reflect their attribute but with restrictions/modifications (```src, href, disabled,  multiple```), and so on. [The spec](https://www.w3.org/TR/html5/infrastructure.html#reflect) covers the various kinds of reflection.
