/** @param {NS} ns */
export async function main(ns) {
	function nodeId() {
		let nodeCnt = ns.hacknet.numNodes();
		let nodeIdx = new Array;
		while (nodeCnt > 0) {
			nodeCnt--;
			nodeIdx.unshift(nodeCnt);
		}
		return nodeIdx;
	}

	function minLvl(nodeIdx = new Array) {
		let lvlArry = new Array;
		for (let node of nodeIdx) { lvlArry.push(ns.hacknet.getNodeStats(node).level); }
		let min = lvlArry.indexOf(Math.min.apply(null, lvlArry));
		return min;
	}

	function minRam(nodeIdx = new Array) {
		let ramArry = new Array
		for (let node of nodeIdx) { ramArry.push(ns.hacknet.getNodeStats(node).ram); }
		let min = ramArry.indexOf(Math.min.apply(null, ramArry));
		return min;
	}

	function minCores(nodeIdx = new Array) {
		let coresArry = new Array
		for (let node of nodeIdx) { coresArry.push(ns.hacknet.getNodeStats(node).cores); }
		let min = coresArry.indexOf(Math.min.apply(null, coresArry));
		return min;
	}

	if (ns.hacknet.numNodes() == 0) { ns.hacknet.purchaseNode(); }

	while (ns.hacknet.getCoreUpgradeCost(minCores(nodeId()), 1) != Infinity) {
		let nodeIdx = nodeId();
		let lvlMin = minLvl(nodeIdx);
		let ramMin = minRam(nodeIdx);
		let coresMin = minCores(nodeIdx);

		let minCosts = [ns.hacknet.getLevelUpgradeCost(lvlMin, 1), ns.hacknet.getRamUpgradeCost(ramMin, 1),
		ns.hacknet.getCoreUpgradeCost(coresMin, 1), ns.hacknet.getPurchaseNodeCost()];

		let minCost = Math.min.apply(null, minCosts);
		let mIndex = minCosts.indexOf(minCost);
		if (ns.getPlayer().money > minCost) {
			switch (mIndex) {
				case 0:
					ns.hacknet.upgradeLevel(lvlMin, 1);
					break;
				case 1:
					ns.hacknet.upgradeRam(ramMin, 1);
					break;
				case 2:
					ns.hacknet.upgradeCore(coresMin, 1);
					break;
				case 3:
					ns.hacknet.purchaseNode()
					break;
			}
		}
		await ns.sleep(200);
	}
	while (ns.getPurchasedServerLimit() > ns.getPurchasedServers().length) {
		if (ns.getPlayer().money >= ns.getPurchasedServerCost(ns.getPurchasedServerMaxRam())) { ns.purchaseServer('big-gun', ns.getPurchasedServerMaxRam()); }
		//else if (ns.getPlayer().money >= ns.singularity.getUpgradeHomeRamCost()) { ns.singularity.upgradeHomeRam(); }
		else {
			await ns.sleep(60000);
		}
	}
}