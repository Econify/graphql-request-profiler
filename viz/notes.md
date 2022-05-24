## CLI Usage

Command to make request, with profiler enabled, take output and visualize in web UI (html page) output to somewhere

```bash
$ graphql-request-profiler visualize --endpoint=localhost:4000/api/graphql --schema=schema.graphql --operation=GetPage --variables=vars.json
Making request...
Done!
```

## Copy / Paste Usage

Have a web page with D3 window on one side, and text box on other side. Paste your query results into the text box and have D3 render it on the other side.
