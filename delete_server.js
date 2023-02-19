/** @param {NS} ns */
export async function main(ns) {
	while (ns.getServerUsedRam(ns.args[0]) > 0) {
	await ns.sleep(20);	
	}
	ns.deleteServer(ns.args[0]);
}