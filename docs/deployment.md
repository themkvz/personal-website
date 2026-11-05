# Deployment

## Environment variables

The canonical list is [`.env.example`](../.env.example). Copy it to `.env` and fill in the values.

The three `VITE_*` variables are inlined into the browser bundle at **build time**, so pass them as `--build-arg`s. The server also validates them at **container start**, together with the server-only variables, and refuses to start if a required one is missing.

| Variable | Phase | Required |
| --- | --- | --- |
| `VITE_OP_CLIENT_ID` | build time and run time | yes |
| `VITE_OP_API_URL` | build time and run time | yes |
| `VITE_GLITCHTIP_DSN` | build time and run time | yes |
| `OP_CLIENT_SECRET` | run time | yes |
| `FINGERPRINT_SECRET` | run time | yes, at least 32 characters |
| `GROWTHBOOK_API_HOST` | run time | no, set both or neither |
| `GROWTHBOOK_CLIENT_KEY` | run time | no, set both or neither |
| `PORT` | run time | no, defaults to `3000` |

`bun run verify:bundle` fails if a server-only variable name appears in `build/client`.

## Docker

```bash
docker build \
  --build-arg VITE_OP_CLIENT_ID=<client-id> \
  --build-arg VITE_OP_API_URL=<api-url> \
  --build-arg VITE_GLITCHTIP_DSN=<dsn> \
  -t themkvz .

docker run -p 3000:3000 --env-file .env themkvz
```

No `.env` file is read at build time; `.dockerignore` excludes it from the build context. The `--env-file` above is only a convenient way to pass the run-time variables; `-e` flags work too.

## Without Docker

Deploy the output of `bun run build` and start it with `bun start`:

```
├── package.json
├── bun.lock
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```
