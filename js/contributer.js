setTimeout(main, 2000);

function main() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		try {
			contributer(JSON.parse(xhr.responseText));
		} catch (e) {
			console.error('Contributer could not be retieved', e);
		}
	};
	xhr.open('GET', 'https://api.malsync.moe/static/contributor');
	xhr.send();
}

function contributer(contr) {
	console.log('Contributer', contr);
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
				userVal.gif = `<img class="gif" src="${userVal.gif}">`;
			} else {
				userVal.gif = '';
			}

			console.log(contr[group][user]);
			html += `
			<div class="user">
			<div class="image align-middle">
			${userVal.gif}
			<img src="${userVal.image}">
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

	var ch = document.querySelector('#contributer .contributer-inner');
	ch.innerHTML = html;

	document.querySelector('#contributer').classList.add("hover");
}