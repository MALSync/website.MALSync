const path = require('path');
const fs = require('fs');
const request = require('request');

const pages = require('../pages/pages.json');

contributer();
async function contributer() {
	const contr = await getJson();
	let html = '';
	for (const group in contr) {
		console.log(group);
		html += `<div class="group">${group}</div>`;
		for (const user in contr[group]) {
			const userVal = contr[group][user];

			if (typeof userVal.subText !== 'undefined' && userVal.subText) {
				userVal.subText = `<div class="subtext">${userVal.subText}</div>`;
			} else {
				userVal.subText = '';
			}

			if (typeof userVal.gif !== 'undefined' && userVal.gif) {
				userVal.gif = `<img loading="lazy" class="gif" src="${userVal.gif}" alt="${userVal.name} Gif">`;
			} else {
				userVal.gif = '';
			}

			console.log(contr[group][user]);
			html += `
			<div class="user">
			<div class="image align-middle">
			${userVal.gif}
			<img loading="lazy" src="${userVal.image}" alt="${userVal.name}">
			</div>
			<div class="text align-middle">
			<div class="name" style="color: ${userVal.color}" title="${userVal.name}">
			${userVal.name}
			</div>
			${userVal.subText}
			</div>
			</div>
			`;
		}
	}

	const descFile = path.join(__dirname, '../index.html');
	fs.readFile(descFile, 'utf8', function(err, data) {
	  if (err) {
	    return console.log(err);
	  }
	  const result = data.replace(/<!--contributer-->((.|\n|\r)*)<!--\/contributer-->/g, `<!--contributer-->\n${html}\n<!--/contributer-->`);

	  fs.writeFile(descFile, result, 'utf8', function(err) {
	    if (err) return console.log(err);
	  });
	});


	return;

}

async function getJson() {
	const url = 'https://api.malsync.moe/static/contributor';
	return new Promise((resolve, reject) => {
		request({url: url}, function (error, response, body) {
			if(error) {
				console.error('error:', error);
				reject(error);
				return;
			}
			if(response && response.statusCode === 200) {
				resolve(JSON.parse(body));
			}
		});
	})
}