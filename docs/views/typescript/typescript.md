---
title: typescript分享
date: 2020-07-17
tags:
 - 分享
categories:
 - typescript
publish: false
---

## 什么是typescript

`TypeScript` 是 `JavaScript` 的一个超集，主要提供了类型系统和对 ES6 的支持，它由 Microsoft 开发，代码开源于 GitHub 上。

它的第一个版本发布于 2012 年 10 月，经历了多次更新后，现在已成为前端社区中不可忽视的力量，不仅在 Microsoft 内部得到广泛运用，而且 Google 开发的 Angular 从 2.0 开始就使用了 TypeScript 作为开发语言，Vue 3.0 也使用 TypeScript 进行了重构。

## typescript存在的意义

1. 类型检查。TypeScript会在编译代码时进行严格的静态类型检查。这意味着你可以在编码阶段发现可能存在的隐患，而不必把他们带到线上。
2. 语言扩展。TypeScript会包括来自ES6和未来提案中的特性。
3. 工具属性。TypeScript能够编译成标准的javascript，无需运行时的任何额外开销
4. IDE提示功能增强。包括代码补全、接口提示、跳转到定义、重构等。比如vscode，他本身是ts编写的，同时也内置了对ts的支持

## 怎么运行 typescript

ts实际上会被编译为js后在运行，所以运行ts包括两步

1. `tsc xxx.ts` 将ts文件编译为js文件
2. 运行js文件

当然也可以通过`ts-node`