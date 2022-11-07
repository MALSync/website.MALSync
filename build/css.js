const { minify } = require('csso');
const fs = require('fs');

let css = "";

fs.readdirSync("css/").forEach((file) => {
    css += fs.readFileSync('css/' + file, 'utf8') + "\n";
})

const minifiedCss = minify(css).css;

fs.writeFileSync('css/minified.css', minifiedCss);