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

	function recoupeTime(cost = new Number) {
		let gainRate = new Number;
		for (let node of nodeIdx) {
			gainRate += ns.hacknet.getNodeStats(node).production;
		}
		let recoupeSec = cost / gainRate;
		return recoupeSec * 1000;
	}

	if (ns.hacknet.numNodes() == 0) { ns.hacknet.purchaseNode(); }
	while (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes() || ns.getPurchasedServerLimit() > ns.getPurchasedServers().length) {
		let nodeIdx = nodeId();
		let lvlMin = minLvl(nodeIdx);
		let ramMin = minRam(nodeIdx);
		let coresMin = minCores(nodeIdx);

		let minCosts = [ns.hacknet.getLevelUpgradeCost(lvlMin, 1), ns.hacknet.getRamUpgradeCost(ramMin, 1),
		ns.hacknet.getCoreUpgradeCost(coresMin, 1), ns.hacknet.getPurchaseNodeCost(),
		ns.getPurchasedServerCost(ns.getPurchasedServerMaxRam())];
		if (ns.singularity) { minCosts.push(ns.singularity.getUpgradeHomeRamCost(), ns.singularity.getUpgradeHomeCoresCost()); }

		let minCost = Math.min.apply(null, minCosts);
		let mIndex = minCosts.indexOf(minCost);
		if (ns.getPlayer().money > minCost) {
			switch (mIndex) {
				case 0:
					ns.hacknet.upgradeLevel(lvlMin, 1);
					await ns.sleep(recoupeTime(minCost));
					break;
				case 1:
					ns.hacknet.upgradeRam(ramMin, 1);
					await ns.sleep(recoupeTime(minCost));
					break;
				case 2:
					ns.hacknet.upgradeCore(coresMin, 1);
					await ns.sleep(recoupeTime(minCost));
					break;
				case 3:
					ns.hacknet.purchaseNode()
					await ns.sleep(recoupeTime(minCost));
					break;
				case 4:
					ns.purchaseServer('big-gun', ns.getPurchasedServerMaxRam());
					await ns.sleep('60000');
					break;
				case 5:
					ns.singularity.upgradeHomeRam();
					await ns.sleep('60000');
					break;
				case 6:
					ns.singularity.upgradeHomeCores();
					await ns.sleep('60000');
					break;
			}
		}
	}
}