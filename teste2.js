const puppeteer = require('puppeteer');
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let url = 'https://coronavirus.fortaleza.ce.gov.br/listaVacinacao.html';
	await page.goto(url);
  
	const dimensions = await page.evaluate(() => {
		let lista = document.getElementById('boletinsAnteriores');
		lista.p
		var items = lista.getElementsByTagName("li");
	  return {
		"resultado": lista
	  };
	});
  
	console.log('Dimensions:', dimensions);

	
  
	await browser.close();
  })();