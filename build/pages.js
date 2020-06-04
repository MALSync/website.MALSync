const path = require('path');
const fs = require('fs');

const pages = require('../pages/pages.json');

favicons();
function favicons() {
	let html = '';
	for (const i in pages) {
		let el = pages[i];
		html += `
		<img title="${el.name}" src="pages/${el.name}.png" height="16" width="16">
		`;
	}

	const descFile = path.join(__dirname, '../index.html');
	fs.readFile(descFile, 'utf8', function(err, data) {
	  if (err) {
	    return console.log(err);
	  }
	  const result = data.replace(/<!--pages-->((.|\n|\r)*)<!--\/pages-->/g, `<!--pages-->\n${html}\n<!--/pages-->`);

	  fs.writeFile(descFile, result, 'utf8', function(err) {
	    if (err) return console.log(err);
	  });
	});


	return;

}
