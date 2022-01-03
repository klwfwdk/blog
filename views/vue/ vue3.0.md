---
title: vue3.0分享
date: 2020-12-13
tags:
 - 分享
categories:
 - vue
 - vue3.0
publish: false
---

## 前言

vue3已经发布一段时间了。因为现有项目都是vue2的版本，所以日常工作无法使用vue3的新功能，今天就希望能带着大家一起看看vue3.0的新特性和迁移方法。

## 为什么要设置特殊的内联css属性

使用excellentexport导出的Excel时遇到文本被excel识别为小数,如`1.10`被识别为了`1.1`,身份证被识别为科学计数法等问题,经过检索,可以通过得对应的css属性来解决这个问题.通过对对应的class设置属性发现导出后无效果,查看导出的文件发现这个插件其实就是将单表所在的html拷贝出来,然后在外部进行一些包装,所以对应的css属性需要内联.

## vue对内联css的处理方式

当发现直接给对应的dom使用`style`或者`:style`并没有任何效果后,对vue处理模板内的内联的方式进行了探究.

vue会把

```html
  <img alt="Vue logo" src="./assets/logo.png" style="test:2333" :style="tempStyle">
```

编译为

```JavaScript
  createElement("img", {
    staticStyle: { test: "2333" },
    style: e.tempStyle,
    attrs: { alt: "Vue logo", src: r("cf05") },
  }),
```

然后`staticStyle`与`style`两个字段会交由`CSS 样式声明对象(CSSStyleDeclaration)`响应式的添加到对应的dom上.经过多次实验发现通过`setProperty()`只能设置标准的css属性,或者以`--`开头的属性.其他的都会失败.例如

```JavaScript
  //有效
  document.querySelector("body").style.setProperty("--test", "yellow", "important");
  //无效
  document.querySelector("body").style.setProperty("-test", "yellow", "important");
  //无效
  document.querySelector("body").style.setProperty("-test", "yellow", "important");
```

但是从下表可以发现,需要的添加的属性不满足上述条件

|CSS代码|说明或示例|
|--|--|
|mso-number-format:"0"|NO Decimals|
|mso-number-format:"0.000"|3 Decimals|
|mso-number-format:"#,##0.000"|Comma with 3 dec|
|mso-number-format:"mm\/dd\/yy"|Date7|
|mso-number-format:"mmmm\ d,\ yyyy"|Date9|
|mso-number-format:"m\/d\/yy\ h:mm\ AM\/PM"|D -T AMPM|
|mso-number-format:"Short Date"|01/03/1998|
|mso-number-format:"Medium Date"|01-mar-98|
|mso-number-format:"d-mmm-yyyy"|01-mar-1998|
|mso-number-format:"Short Time"|5:16|
|mso-number-format:"Medium Time"|5:16 am|
|mso-number-format:"Long Time"|5:16:21:00|
|mso-number-format:"Percent"|Percent - two decimals|
|mso-number-format:"0%"|Percent - no decimals|
|mso-number-format:"0.E+00"|Scientific Notation|
|mso-number-format:"\@"|Text|
|mso-number-format:"#\ ???\/???"|Fractions - up to 3 digits (312/943)|
|mso-number-format:"\0022£\0022#,##0.00"|£12.76|
|mso-number-format:"#,##0.00_ \;[Red]-#,##0.00\ “|2 decimals, negative numbers in red and signed (1.56 -1.56)|

## 解决方案

所以需要使用另外的方法设置当前dom的class,这里找到了`dom.setAttribute`,值得注意的是,这个方法会覆盖当前的class,所以需要处理原有值和特殊class的关系.但是操作dom会比较麻烦.没有直接给dom写class方便.这里就需要用到vue的另外一个功能:指令`(directive)`.可以通过编写特殊的指令完成上述操作,减少频繁重复的调用`dom.setAttribute`
