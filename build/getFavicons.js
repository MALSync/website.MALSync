const fs = require('fs');
const request = require('request');

main();

async function main() {
	const pages = await getJson()

	for(let i in pages) {
		let el = pages[i];
		await saveImage(el.name+'.png', 'https://www.google.com/s2/favicons?domain='+el.domain);
		await saveImage(el.name+'_32.png', 'https://www.google.com/s2/favicons?domain='+el.domain + "&sz=32");
	}

	var filtered = await filterJsonByFiles(pages);
	var filtered32 = await filterJsonByFiles(pages, 32);

	fs.writeFileSync('pages/pages.json', JSON.stringify(filtered, null, 2));
	fs.writeFileSync('pages/pages32.json', JSON.stringify(filtered32, null, 2));
	console.log('Done');
}

async function getJson() {
	const url = 'https://raw.githubusercontent.com/MALSync/MALSync/master/src/pages/list.json';
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

async function filterJsonByFiles(json, size = null) {
	var res = [];
	for(let i in json) {
		let el = json[i];

		let filename = el.name + '.png'
		if(size) {
			filename = el.name + '_' + size + '.png'
		}

		if (fs.existsSync('pages/'+filename)) {
			res.push(el);
		}
	}
	return res;
}

function saveImage(name, url) {
	return new Promise((resolve, reject) => {
		request({url: url, encoding: null}, function (error, response, body) {
			if(error) {
				console.error('error:', error);
				reject(error);
				return;
			}
			if(response && response.statusCode === 200) {
				fs.writeFileSync('pages/'+name, body);
				console.log(name, 'saved');
				resolve(body);
			}
			if(response && response.statusCode === 404) {
				console.log(name, 'has no favicon');
				resolve(404);
			}
		});
	})
}