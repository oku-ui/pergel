import { eventHandler, setHeader } from 'h3'
import defu from 'defu'
import type { ApolloSandBoxOptions } from '../types'

export default function (options: ApolloSandBoxOptions) {
  const resolved = defu(options, {
    _target: '#embedded-sandbox',
  })

  const viewerDevMiddleware = eventHandler((event) => {
    setHeader(event, 'Content-Type', 'text/html')

    return `<!DOCTYPE html>
<html>


<head>

<meta charset=utf-8 />
<meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
<title>GraphQL Sandbox | Pergel</title>
<style>
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

<body>
<div style="width: 100%; height: 100%;" id='embedded-sandbox'></div>
<script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script>
<script>
  new window.EmbeddedSandbox(
    ${JSON.stringify({
      target: resolved._target,
      initialEndpoint: resolved._initialEndpoint,
      ...resolved,
    })}
  )
</script>
</body>
</html>

`
  })

  return viewerDevMiddleware
}
