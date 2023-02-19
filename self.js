export async function main(ns) {
	while (true) {
		const hostName = ns.getHostname();
		const secLvl = ns.getServerSecurityLevel(hostName);
		while (secLvl < 99.996) {
			var cash = ns.getServerMoneyAvailable(hostName);
			var cashMax = ns.getServerMaxMoney(hostName);
			if (cash == cashMax) {
				await ns.hack(hostName);
			}
			else {
				await ns.grow(hostName);
			}
		}
		while (secLvl > 90) {
			await ns.weaken(hostName)
		}
	}
}