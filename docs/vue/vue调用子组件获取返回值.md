---
title: vue调用子组件方法并获取返回值
date: 2020-03-30
tags:
 - 技巧
categories:
 - vue
# publish: false
---

## 常见业务场景

在实际开发过程中，经常碰到需要调用子组件内部的方法来实现某些操作，比如

1. 要求子组件检查内部form是否符合rules
2. 要求子组件内部进行刷新获取新的数据

而且很多时候希望的不是单向的通知子组件执行某些方法，而且希望获得子组件的方法的返回值，已执行不同的操作。比如希望获得组件的内部form检查后将检查结果返回给父组件，父组件获得结果后执行不同的操作

## 常见的解决方案

### 调用子组件方法

网上有两类方法，分别讨论一下

#### this.$refs["bar"].func(params)

这个是最常见的方法，基本其他博客都会提到

```js
// foo.vue
<template>
    <bar ref="bar"/>
</template>
<script>
export default {
  ...
  mounted () {
    this.$ref.bar.funca()
  }
}
</script>

// bar.vue
...
<script>
export default {
  ...
  methods: {
    funca(){
      console.log("bar")
    }
  }
}
</script>
```

#### 使用 `$emit` 与 `$on` 事件机制

这个方法也是在别人的博客中看到的
[https://cloud.tencent.com/developer/article/1445537](https://cloud.tencent.com/developer/article/1445537)

```js

//我们都知道，vue是单向流，但是有时候我们需要在父组件中主动通知子组件一些信息，使其做出一些响应变化，那么如何在父组件中去主动调用子组件的方法呢？Vue当然给我们提供了方法，如下：

//首先在子组件中进行事件广播
created: function(){
    this.$on('handleChange', function(){
      console.log('something handled!');
    });
  }
//在父组件中指定子组件的ref，如child，然后通过一下方式调用：
this.$refs['child'].$emit('handleChange');
//核心还是事件的分发及相应：$on、$emit。
```

其实与上一个方法大同小异，看似使用事件机制更加符合vue事件传值的机制，其实本质上还是使用子组件对象调用的`$emit()`方法在内部产生了一个事件，然后又在内部使用了`$on()`对事件进行了监听。本质上和上述方法没有任何区别。

### 获取子组件返回值的方法

其实凭借直觉 使用`let res = this.$ref.bar.funca()`就能获取到子组件的返回值，试验过后的确如此。但是网上依然有人说获取不到返回值，最近的确也碰到过返回值为undefined的问题。

仔细分析，发现其实纯粹不是vue的问题，而是异步，回调这类的问题导致了函数返回值与预期不符。

提供三个思路，

1. 子组件方法返回promise，在内部异步，回调中resolve(),
2. 使用回调的方法对付回调，直接把想执行的函数传进子组件，在子组件的回调中执行即可
3. 使用`$emti()`进行通信，子组件发时间，在父组件上监听，监听后执行相应的操作。这个方法的坏处是，将一个完整的步骤拆分成了三个步骤 对于后期维护来说不太友好

  > 1. 父组件执行子组件函数
  > 2. 子组件执行完成后发布事件
  > 3. 父组件监听事件并作出响应
