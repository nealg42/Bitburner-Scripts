/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	let prod = ns.ls('home', '/scripts/prod/');
	let dev = new Array;
	for (let prodfile of prod) {
		ns.print(prodfile);
		let diff = ns.read(prodfile).replace(/(?<=\/)prod(?=\/[^'"])/g, 'dev') == ns.read(prodfile.replace(/(?<=\/)prod(?=\/)/, 'dev'));
		ns.print('Prod change: ' + diff + '\n\n');

		if (ns.read(prodfile).replace(/(?<=\/)prod(?=\/[^'"])/g, 'dev') !== ns.read(prodfile.replace(/(?<=\/)prod(?=\/)/, 'dev'))) {
			dev.push(prodFile.replace(/(?<=\/)prod(?=\/)/, 'dev'));
		}
	}
	if (await ns.prompt('You will be pulling the following files to dev:\n\n' + dev.join('\n'), { type: 'boolean' })) {
		for (let devfile of dev) {
			let prodfile = devfile.relplace(/(?<=\/)dev(?=\/[^'"])/g, 'prod');
			let devCont = ns.read(prodfile).replace(/(?<=\/)prod(?=\/)/g, 'dev');
			ns.write(devfile, devCont, 'w');
		}
	}
}