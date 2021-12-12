import { default as React } from "https://dev.jspm.io/react@16.13.1";
import { default as ReactDOMServer } from "https://dev.jspm.io/react-dom@16.13.1/server";

const ReactDOM = ReactDOMServer as any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [k: string]: any;
    }
  }
}

const App = () => <div>Hello!</div>;

async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const headers = new Headers();
    headers.append("content-type", "text/html");

    await requestEvent.respondWith(
      new Response(ReactDOM.renderToString(<App />), {
        status: 200,
        headers,
      })
    );
    // ... handle requestEvent
  }
}

const server = Deno.listen({ port: 8000 });

for await (const conn of server) {
  handle(conn);
}
