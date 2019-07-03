const fs = require('fs');
var md = require('markdown-it')({
  html:true,
  typographer:true,
});

require.extensions['.md'] = (module, filename) => {
  const markdown = fs.readFileSync(filename, 'utf8');
  module.exports = { markdown, html: md.render(markdown) };
};

