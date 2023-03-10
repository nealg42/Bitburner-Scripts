/** @param {NS} ns */
export async function main(ns) {
	function svrRoute(svr = new String) {
		let route = [ns.scan(svr)[0]];
		while (route[0] != 'home') { route.unshift(ns.scan(route[0])[0]); }
		return route;
	}
	if (ns.singularity) {
		for (let node of svrRoute(ns.args[0])) {
			ns.singularity.connect(node);
		}
		ns.singularity.connect(ns.args[0]);
	} else ns.tprint('This script requires the Singularity, Source File 4.');
}