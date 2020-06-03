function pageFav(pages) {
	let html = '';
	for (const i in pages) {
		let el = pages[i];
		html += `
		<img title="${el.name}" src="pages/${el.name}.png">
		`;
	}

	var ch = document.querySelector('#page-favs');
	ch.innerHTML = html;
}
var xhrP = new XMLHttpRequest();
xhrP.onreadystatechange = function() {
	try {
		pageFav(JSON.parse(xhrP.responseText));
	} catch (e) {
		console.error('Pages could not be retieved', e);
	}
};
xhrP.open('GET', 'pages/pages.json');
xhrP.send();