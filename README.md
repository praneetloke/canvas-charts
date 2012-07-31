canvas-charts
=============

A micro JS library to render charts using only html5 canvas. Additional graph types will be supported via plugins that use the core drawing package. The ultimate goal for this library is to not do what full-fledged graph libraries like flot and gRaphael do but in fact to support a small need for a library (that can generate "pretty" graphs) that doesn't suck in terms of size and performance. If you can help with this project and would like to discuss more about it, feel free to contact me.

The node based chart example has the following dependencies:

- express
- redis
- node-canvas (npm install canvas)
- socket.io

Description of node example:

When a client sends a request to generate a graph the following happens:

- An md5 hash of the data, x-axis, y-axis, width, height is created and a redis 'get' is issued for this key.
- If the callback from redis has data, meaning this key was already cached in the store then the cached base64 image is returned.
- If redis does not have the key cached already then a new canvas is created using the canvas-charts instance to draw the graph, inserted into redis and the response is sent back.
- redis keys are set to expire in an hour.

Obviously, this is only an example usage. You can use this as a starting point..or not. It's up to you. It's only a suggestion of how you can implement charts for your applications with a consistent API.

There is a disadvantage of using it with node though. I plan to implement pan & zoom events into the core library (or mostly as a plugin) which means you would lose those capabilities with an IMG. It's certainly a tradeoff once I get there.

Like to contribute? Have suggestions? Feel free to contact me. I am not a jerk.

Found issues? Awesome. If you can fix it, even better! Otherwise, just let me know (provide an example as well) and I'll look into it as soon as I get the chance.

Minify the core library:

```
bash compile_min_js.sh
```