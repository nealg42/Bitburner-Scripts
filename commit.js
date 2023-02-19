/** @param {NS} ns */
export async function main(ns) {
	//ns.tail();
	let dev = ns.ls('home', '/scripts/dev/');
	let prod = new Array;
	for (let devfile of dev) {
		ns.print(devfile);
		ns.print('Test match: ' + devfile.match(/test.*\.js/));
		let diff = ns.read(devfile).replace(/(?<=\/)dev(?=\/[^'"])/g, 'prod') == ns.read(devfile.replace(/(?<=\/)dev(?=\/)/, 'prod'));
		ns.print('Prod change: ' + diff + '\n\n');

		if (devfile.match(/test.*\.js/) == null &&
			ns.read(devfile).replace(/(?<=\/)dev(?=\/[^'"])/g, 'prod') != ns.read(devfile.replace(/(?<=\/)dev(?=\/)/, 'prod'))) {
			prod.push(devfile.replace(/(?<=\/)dev(?=\/)/, 'prod'));
		}
	}

	if (await ns.prompt('You will be committing the following files to prod:\n\n' +
		prod.join('\n').replace(/(?<=\/)prod(?=\/)/g, 'dev'), { type: 'boolean' })) {
		for (let prodfile of prod) {
			ns.write(prodfile, ns.read(prodfile.replace(/(?<=\/)prod(?=\/)/, 'dev')).replace(/(?<=\/)dev(?=\/[^'"])/g, 'prod'), 'w');
		}
	}
}