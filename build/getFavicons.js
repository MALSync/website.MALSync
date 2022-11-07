const fs = require('fs');
const request = require('request');

main();

async function main() {
	const pages = await getJson();
	var res = await filterJson(pages);

	for(let i in res) {
		let el = res[i];
		await saveImage(el.name+'.png', 'https://www.google.com/s2/favicons?domain='+el.domain + "&sz=32");
	}

	res = await filterJsonByFiles(pages);

	fs.writeFileSync('pages/pages.json', JSON.stringify(res, null, 2));
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

async function filterJsonByFiles(json) {
	var res = [];
	for(let i in json) {
		let el = json[i];
		if (fs.existsSync('pages/'+el.name+'.png')) {
			res.push(el);
		}
	}
	return res;
}

async function filterJson(json) {
	var res = [];
	for(let i in json) {
		let el = json[i];
		var img = await getImage('https://www.google.com/s2/favicons?domain='+el.domain);
		if(img === 404) {
			console.log(el.name, 'has no favicon');
			continue;
		}
		console.log(el.name, 'saved');
		res.push(el);
	}
	return res;
}

function getImage(url) {
	return new Promise((resolve, reject) => {
		request({url: url}, function (error, response, body) {
			if(error) {
				console.error('error:', error);
				reject(error);
				return;
			}
			if(response && response.statusCode === 200) {
				resolve(body);
				return;
			} else if(response.statusCode === 404) {
				resolve(404);
				return;
			}
			reject(url);
		});
	})
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
				resolve(body);
			}
		});
	})
}