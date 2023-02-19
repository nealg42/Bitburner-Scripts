/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0]

	while (true) {
		while (ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target)) {
			while (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)) { await ns.weaken(target); }
			await ns.grow(target);
		}
		while (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)) { await ns.weaken(target); }
		await ns.hack(target);
	}
}