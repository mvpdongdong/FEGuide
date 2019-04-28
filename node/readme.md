## Node 实践参考

参考文章：[《Node.js 调试指南》](https://github.com/nswbmw/node-in-debugging)、[Node 最佳实践](https://github.com/i0natan/nodebestpractices)

### Node cluster模块

[通过源码解析 Node.js 中 cluster 模块的主要功能实现](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)、[pm2源码分析](https://www.jianshu.com/p/ac843b516fda)

### express 路由和中间件机制

参考：[从express源码中探析其路由机制](https://www.cnblogs.com/neverstop/p/4066239.html)

### IPC 通信

IPC全称进程间通信，进程间通信目的是为了让不同的进程能够相互访问资源并协调工作。实现进程间通信的技术有很多，Node中具体实现由libuv提供，在windows下是命名管道（named pipe），在*nix系统采用Unix Domain Socket实现。虽然网络 socket 也可用于同一台主机的进程间通讯(通过 loopback 地址 127.0.0.1)，但是 Unix Domain Socket 用于 IPC 更有效率：不需要经过网络协议栈，不需要打包拆包、计算校验和、维护序号和应答等，只是将应用层数据从一个进程拷贝到另一个进程。这是因为，IPC 机制本质上是可靠的通讯，而网络协议是为不可靠的通讯设计的。

父进程在实际创建子进程之前，会创建IPC通道监听它，然后创建出真正子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个IPC通道的文件描述符，子进程在启动的过程中根据这个文件描述符去连接这个已经存在的IPC通道，从而完成父子进程连接。

### cluster 工作原理

cluster 启动时会在内部建立 TCP 服务器，在 cluster.fork() 子进程时，将这个服务器端socket文件描述符发送给子进程，如果工作进程存在侦听网络端口的调用，它将拿到文件描述符，从而实现多个子进程共享端口。

- 端口仅由master进程中的内部TCP服务器监听了一次。
- 不会出现端口被重复监听报错，是由于worker进程中，最后执行监听端口操作的方法，已被cluster模块主动hack。
- 在内部TCP服务器的请求处理逻辑中，负载均衡地挑选出一个worker进程，将其发送一个newconn内部消息，随消息发送客户端句柄。

Node提供了一种新的负载均衡策略，round-robin算法（轮询调度算法），轮询调度的工作方式是主进程接受连接，将其一次发送给工作进程，在 n 个工作进程中，每次选择 i = (i + 1) mod n 个工作进程来发送连接。

### Node 事件循环机制

1. timers，执行时间到了的定时器回调
2. I/O callbacks，执行上一轮未执行的 I/O callbacks
3. idle, prepare，系统内部调用
4. poll，发送请求、读取文件时等待返回结果执行callback
  - poll队列不为空的时候，事件循环肯定是先遍历队列并同步执行回调，直到队列清空或执行回调数达到系统上限。
  - poll队列为空的时候，这里有两种情况。
    - 如果代码已经被setImmediate()设定了回调，那么事件循环直接结束poll阶段进入check阶段来执行check队列里的回调
    - 如果代码没有被设定setImmediate()设定回调：
      - 如果有被设定的timers，那么此时事件循环会检查timers，如果有一个或多个timers下限时间已经到达，那么事件循环将绕回timers阶段，并执行timers的有效回调队列。
      - 如果没有被设定timers，这个时候事件循环是阻塞在poll阶段等待回调被加入poll队列。
5. check，执行 setImmediate 回调
6. close callbacks，如果一个socket或handle被突然关掉（比如socket.destroy()），close事件将在这个阶段被触发，否则将通过process.nextTick()触发。

参考文章：[由setTimeout和setImmediate执行顺序的随机性窥探Node的事件循环机制](https://segmentfault.com/a/1190000013102056)
