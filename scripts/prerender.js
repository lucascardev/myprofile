const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// Configure environment
process.env.NODE_ENV = 'production';
process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

// Mock browser globals for SSR execution
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    getItem: (key) => (key === 'lucascardev_view_mode' ? 'normal' : null),
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
}

if (typeof global.window === 'undefined') {
  global.window = {
    process: { env: { NODE_ENV: 'production', PUBLIC_URL: process.env.PUBLIC_URL || '' } },
    location: {
      href: 'https://lucascardev.engineer',
      hostname: 'lucascardev.engineer',
      origin: 'https://lucascardev.engineer'
    },
    localStorage: global.localStorage
  };
}

if (typeof global.navigator === 'undefined') {
  global.navigator = {
    language: 'pt-BR',
    userLanguage: 'pt-BR'
  };
}

// Ignore CSS imports during Node SSR
require.extensions['.css'] = () => {};

// Hook JS/JSX files with Babel compiler
require.extensions['.js'] = function (module, filename) {
  if (filename.includes('node_modules')) {
    return module._compile(fs.readFileSync(filename, 'utf8'), filename);
  }
  const content = fs.readFileSync(filename, 'utf8');
  const transformed = babel.transformSync(content, {
    filename,
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-react')
    ]
  }).code;
  module._compile(transformed, filename);
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

async function prerender() {
  console.log('[SSR] Starting pre-rendering of the professional page...');
  const App = require('../src/App').default;
  const sheet = new ServerStyleSheet();

  try {
    const appHtml = ReactDOMServer.renderToString(
      sheet.collectStyles(React.createElement(App))
    );
    const styleTags = sheet.getStyleTags();

    const buildDir = path.join(__dirname, '..', 'build');
    const indexPath = path.join(buildDir, 'index.html');

    if (!fs.existsSync(indexPath)) {
      throw new Error(`Build index.html not found at ${indexPath}. Run react-scripts build first.`);
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Inject styled-components CSS into <head>
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${styleTags}</head>`);
    }

    // Inject rendered markup into <div id="root">
    const rootPlaceholder = '<div id="root"></div>';
    if (!html.includes(rootPlaceholder)) {
      throw new Error(`Could not find ${rootPlaceholder} in ${indexPath}`);
    }
    html = html.replace(rootPlaceholder, `<div id="root">${appHtml}</div>`);

    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`[SSR] Successfully injected SSR markup into build/index.html`);
    console.log(`[SSR] Rendered HTML size: ${(appHtml.length / 1024).toFixed(2)} KB`);
    console.log(`[SSR] Rendered CSS size: ${(styleTags.length / 1024).toFixed(2)} KB`);

    // Write static copies for direct routes (/professional, /profissional, /resume)
    const routes = ['professional', 'profissional', 'resume'];
    for (const route of routes) {
      const routeDir = path.join(buildDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
      console.log(`[SSR] Wrote static route page at build/${route}/index.html`);
    }

    console.log('[SSR] Professional page SSR pre-rendering completed successfully!');
  } catch (error) {
    console.error('[SSR] Error during SSR pre-rendering:', error);
    process.exit(1);
  } finally {
    sheet.seal();
  }
}

prerender();
