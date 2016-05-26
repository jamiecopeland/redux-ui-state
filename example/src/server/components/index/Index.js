import React from 'react';

const Index = ({ cssPaths, jsPaths, title }) => (
  <html>
    <head>
      <meta httpEquiv="Content-type" content="text/html; charset=utf-8" />
      <title>{title}</title>
      {
        cssPaths
        ? cssPaths.map((cssPath) => (<link key={cssPath} rel="stylesheet" href={cssPath} />))
        : null
      }
    </head>
    <body>
      <div id="app-dom-hook"></div>
      {
        jsPaths.map((jsPath) => (<script key={jsPath} src={jsPath} />))
      }
    </body>
  </html>
);

Index.propTypes = {
  title: React.PropTypes.string,
  jsPaths: React.PropTypes.array,
  cssPaths: React.PropTypes.array,
};

export default Index;
