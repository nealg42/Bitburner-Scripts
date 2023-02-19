/** @param {NS} ns */
export async function main(ns) {
	let ram = ns.getPurchasedServerMaxRam();

	while (ram > 1) {
		let cost = ns.getPurchasedServerCost(ram);
		if (cost <= ns.getPlayer().money) {
			const confirm = await ns.prompt('\nWould you like to buy a ' + ram + 'GB Server for $' + ns.getPurchasedServerCost(ram).toLocaleString() + '?', { "type": "boolean" })
			if (confirm == true) {
				ns.purchaseServer('big-gun',ram);
				break;
			} else { break; }
		} else { ram /= 2; }
	}
}