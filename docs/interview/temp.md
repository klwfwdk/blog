---
title: 缓存
date: 2022-01-03
tags:
 - 性能优化
categories:
 - 面试
recommend: 5
---

# 缓存相关知识

## 本地数据缓存
将一些数据缓存在本地，比如日更新的或者不怎么更新的榜单数据
## 内存缓存
类似于当一个页面出现多次的图标，浏览器会使用内存中的而非是请求的。这一部分一般由浏览器处理，无特殊标准
## Cache Api
由`service worker` 提供的缓存 由客户端控制

```js
// sw.js
var cacheFiles = [
    'about.js',
    'blog.js'
];

self.addEventListener('install', function (evt) { evt.waitUntil( caches.open('my-test-cahce-v1').then(function (cache) { return cache.addAll(cacheFiles); }) ); }); 

self.addEventListener('fetch', function (e) {
    // 如果有cache则直接返回，否则通过fetch请求
    e.respondWith(
        caches.match(e.request).then(function (cache) {
            return cache || fetch(e.request);
        }).catch(function (err) {
            console.log(err);
            return fetch(e.request);
        })
    );
});
```
首先定义了需要缓存的文件数组cacheFile，然后在install事件中，缓存这些文件。 evt是一个InstallEvent对象,继承自ExtendableEvent，其中的waitUntil()方法接收一个promise对象，直到这个promise对象成功resolve之后，才会继续运行service-worker.js。 caches是一个CacheStorage对象，使用open()方法打开一个缓存，缓存通过名称进行区分。 获得cache实例之后，调用addAll()方法缓存文件。

这样就将文件添加到caches缓存中了，想让浏览器使用缓存，还需要拦截fetch事件 fetch 并不是指的fetchapi 的请求 事实上 任何类型的网络请求都会被这个事件拦截
## HTTP 缓存
如果service worker没有匹配上的缓存内容 就会经过HTTP缓存机制的判断。HTTP缓存机制分为强缓存和协商缓存。
### 强缓存
强缓存包括两个请求头 `Expires` 和 `max-age`。 `Expires` 制定一个过期日期，在这个时间点以前使用缓存。而`max-age`则指定了一个数值`x`，在请求后的`x`秒内使用缓存
### 协商缓存
第一次请求服务器会返回`Last-Modified`,而浏览器在二次请求的时候会带上`If-Modified-Since`的请求头，这个时候由服务通过http状态码来控制是否走缓存`200`不走，`304`走缓存。 但是这个方案存在一个问题，这个header精度不够。基本只精确到秒。所以有了另外一套方案`ETag`。
这个方案服务器在第一次请求的时候会返回`Etag`,一般为文件的MD5,然后浏览器在请求header中通过`If-None-Match`，由服务器对比判断是否需要更新。
## Push Cache
Push Cache 是基于 HTTP2的 HTTP push 的缓存机制，具体使用方法是通过响应头的 LINK，如下

```
Link: </css/styles.css>; rel=preload; as=style
```
相当于在返回html的过程中就同时向浏览器推送style资源，这样的当检测到浏览器已经接收到了推送的资源后就使用缓存的内容。