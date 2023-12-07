---
title: Bun
description: Bun is an all-in-one JavaScript runtime(Node.js Alternative) & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager. 
componentName: OkuAccordion
image: 'https://oku-ui.com/og/oku-accordion.png'
links:
  - label: Bun
    icon: i-ph-link
    to: https://bun.sh/
---

# What is Bun?

Bun is an all-in-one JavaScript runtime(Node.js Alternative) & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

(Supported on macOS, Linux, and WSL)

It has three major design goals:

- **Speed** - Bun starts fast and runs fast. It extends JavaScriptCore, the performance-minded JS engine built for Safari. As computing moves to the edge, this is critical.
- **Elegant APIs** - Bun provides a minimal set of highly-optimimized APIs for performing common tasks, like starting an HTTP server and writing files.
- **Cohesive DX** - Bun is a complete toolkit for building JavaScript apps, including a package manager, test runner, and bundler.

Bun is designed as a replacement for Node.js, and is compatible with many of its APIs. It is not a drop-in replacement, however, and some Node.js APIs are not supported.

The goal of Bun is to provide a fast, modern, and cohesive JavaScript runtime for building apps and services. It is not a general-purpose runtime like Node.js, and is not suitable for all use cases.

The bun​ command-line tool also implements a test runner, script runner, and Node.js-compatible package manager, all significantly faster than existing tools and usable in existing Node.js projects with little to no changes necessary. (<b>Bun is still under development.</b>)

::code-group
```sh [terminal]
bun run start                 # run the `start` script
bun install <pkg>​             # install a package
bun build ./index.tsx         # bundle a project for browsers
bun test                      # run tests
bunx cowsay "Hello, world!"   # execute a package
```
::


## Install Bun

You can install the Bun program with [Pergel](/pergel/getting-started).

To make sure that Bun is installed correctly, run the following command: `bun --version`


## Create Web Server in Bun

::code-group
```sh [terminal]
mkdir my-project
cd my-project
bun init
bun run index.ts
```
```sh [index.ts]
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
```
::

Go to [http://localhost:3000/](http://localhost:3000/){:target="_blank"} to see the result.


## Create File with Bun

Create a file with Bun. (You can use `await Bun.write("output.txt", data)` to write a file.)

::code-group
```sh [terminal]
bun run index.ts
```

```sh [index.ts]
const data = "Hello World!";
await Bun.write("output.txt", data);
```
::



## Watch Mode

Bun supports two kinds of automatic reloading via CLI flags:

- `--watch` mode, which hard restarts Bun's process when imported files change.
- `--hot` mode, which soft reloads the code (without restarting the process) when imported files change.

```sh
bun run --watch index.ts # run the `index.ts` script and watch for changes
```

```sh
bun run --hot index.ts # run the `index.ts` script and hot reload on changes
```

## Demo Project

Bun routes requests to the `fetch` function, which returns a `Response` object. The `Response` object can be created from a string, a file, or a JSON object.



::code-group
```sh [terminal]
bun run index.ts
```

```sh [index.ts]
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === '/') {
      return new Response('Hello World!');
    }

    if (path === '/json') {
      return new Response(JSON.stringify({ hello: 'world' }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    if (path === '/redirect') {
      return Response.redirect('https://google.com');
    }

    if (path === '/error') {
      throw new Error('Something went wrong');
    }

    if (path === '/hello') {
        return new Response(Bun.file('./hello.text'));
    }

    return new Response('Not Found', { status: 404 });
  },
  error(e) {
    return new Response(e.message, { status: 500 });
  }
});

console.log(`Listening on http://localhost:${server.port} ...`);
```

```sh [hello.text]
Hello Bun Developer!
```
::


## Sources

- [Bun Documentation](https://bun.sh/docs/){:target="_blank"}
- [Http Server](https://bun.sh/docs/api/http){:target="_blank"}
- [File I/O](https://bun.sh/docs/api/file-io){:target="_blank"}
