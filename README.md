# Leaflet Canvas Renderer

## Commands

- `npm login`
- `npm publish` - to publish / update the package

## Testing

For more indeepth testing, `Jest` and `Cypress` are configured and they both contain a dummy example.

### Jest

`npm run test`
`npm run test:watch`
`npm run test:cov`

### Cypress

- start a live server to serve the `index.html` file from `demo` folder.
- in `cypress/integration/test.spec.js` update the `URL` if required.
- run `npx cypress open`
