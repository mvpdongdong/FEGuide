## Node 实践参考

参考文章：[《Node.js 调试指南》](https://github.com/nswbmw/node-in-debugging)、[Node 最佳实践](https://github.com/i0natan/nodebestpractices)

### Node cluster模块

[通过源码解析 Node.js 中 cluster 模块的主要功能实现](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)、[pm2源码分析](https://www.jianshu.com/p/ac843b516fda)

### express 路由和中间件机制

参考：[从express源码中探析其路由机制](https://www.cnblogs.com/neverstop/p/4066239.html)

### cluster 工作原理

cluster 启动时会在内部建立 TCP 服务器，在 cluster.fork() 子进程时，将这个服务器端socket文件描述符发送给子进程，如果工作进程存在侦听网络端口的调用，它将拿到文件描述符，从而实现多个子进程共享端口。

Node提供了一种新的负载均衡策略，round-robin算法（轮询调度算法），在 n 个工作进程中，每次选择 i = (i + 1) mod n 个工作进程来发送连接。
