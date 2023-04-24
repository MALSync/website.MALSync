const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const input_folder = 'screenshots';
const tmp_folder_reduced = 'images';

console.log('Reducing image size ... ');
fs.readdirSync(input_folder).forEach(file => {

    let tmp_input_path = path.join(input_folder, file)


	// file ends with full.png
	if (!file.endsWith('full.png')) {
		resize(355, path.join(tmp_folder_reduced, file.replace('.png','-d.png')), tmp_input_path);
		resize(430, path.join(tmp_folder_reduced, file.replace('.png','-t.png')), tmp_input_path);
		resize(645, path.join(tmp_folder_reduced, file.replace('.png','-p.png')), tmp_input_path);
	} else {
		compress(path.join(tmp_folder_reduced, file), tmp_input_path);
	}

})

function compress(output, input) {
	sharp(input)
	    .png({quality: 80})
	    .toFile(output,
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    });

	sharp(input)
	    .webp()
	    .toFile(output.replace('.png', '.webp'),
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    })
}

function resize(width, output, input) {
	//Resize
	sharp(input)
	    .png()
	    .resize(width, null)
	    .sharpen()
	    .toFile(output,
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    })

	sharp(input)
	    .png()
	    .resize(width*2, null)
	    .sharpen()
	    .toFile(output.replace('.png', '-2x.png'),
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    })

	//Resize
	sharp(input)
	    .webp()
	    .resize(width, null)
	    .sharpen()
	    .toFile(output.replace('.png', '.webp'),
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    })

	sharp(input)
	    .webp()
	    .resize(width*2, null)
	    .sharpen()
	    .toFile(output.replace('.png', '-2x.webp'),
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    })

	//Resize
	sharp(input)
		.avif()
		.resize(width, null)
		.sharpen()
		.toFile(output.replace('.png', '.avif'),
		function(err){
			if(err){
				console.log("Error at reducing size / converting picture : ")
				console.log(err)
				console.log(input);
				console.log(output);
				return;
			}
		})

	sharp(input)
	    .avif()
	    .resize(width*2, null)
	    .sharpen()
	    .toFile(output.replace('.png', '-2x.avif'),
	    function(err){
	        if(err){
	        	console.log("Error at reducing size / converting picture : ")
	        	console.log(err)
	        	console.log(input);
	        	console.log(output);
	        	return;
	        }
	    })
}