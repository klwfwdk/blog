---
title: 继承相关
date: 2022-01-11
tags:
 - js
categories:
 - 面试总结
---

# 继承相关
## 原型链继承
### 源码
``` js
function foo() {}
function bar() {}
bar.prototype = new foo();
bar.prototype.constructor = foo;
```
最后一句不影响继承功能的实现 主要是为了用来区分对象是用哪个构造函数生成的。
### 问题
1. 父类型引用类型被所有实例共享。
2. 创建子实例时，无法向父构造函数传参

## 借用构造函数（经典继承）
### 源码
```js
function foo() {}
function bar() {
  foo.call(this);
}
```
### 优点
1. 避免引用类型的属性被所有实例共享
2. 子可以向父传参

### 缺点
1. 方法都在构造函数中定义，每次创建实例都会创建一遍方法。

## 组合继承
前两种的组合
### 源码
```js
function foo() {
  // 定义属性
}
// 来自原型链继承
foo.prototype.fun = function() {};

function bar() {
  // 来自借用构造函数继承
  foo.call(this);
}
// 来自原型链继承
bar.prototype = new foo();
bar.prototype.constructor = bar;
```

### 优点
融合原型链和构造函数的优点

## 原型式继承
ES5 的 Object.create 的模拟实现。将传入的对象作为创建对象的原型
```js
function createObj(foo) {
  function bar() {}
  bar.prototype = foo;
  return new bar();
} 
```
优缺点跟原型链一致，约等于一次浅拷贝。

## 寄生式继承
一个函数，创建一个父对象，然后对其进行包装。返回包装后的结果
```js
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```
缺点是每次创建对象都会创建一遍方法。

## 寄生组合式继承

```js
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function prototype(child, parent) {
    var prototype = object(parent.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

// 当我们使用的时候：
prototype(Child, Parent);
```
这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

