const fs = require('fs');
const request = require('request');

var pages = [
	{
		name: 'gogoanimes',
		domain: 'https://gogoanimes.co'
	},
	{
		name: 'serimanga',
		domain: 'https://serimanga.com'
	},
	{
		name: 'kissanime',
		domain: 'https://kissanime.ru/'
	}
]

main();

async function main() {
	var res = await filterJson(pages);

	for(let i in res) {
		let el = res[i];
		await saveImage(el.name+'.png', 'https://www.google.com/s2/favicons?domain='+el.domain);
	}

	fs.writeFileSync('pages/pages.json', JSON.stringify(res));
	console.log('Done');
}

async function filterJson(json) {
	const emptyImg = await getImage('https://www.google.com/s2/favicons?domain=https://sssssss.sss');
	var res = [];
	for(let i in json) {
		let el = json[i];
		var img = await getImage('https://www.google.com/s2/favicons?domain='+el.domain);
		if(img === emptyImg) {
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
			}
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