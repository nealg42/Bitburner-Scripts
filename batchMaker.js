/** @param {NS} ns */
import { grw, hak, wkn } from 'lib.js'
export async function main(ns) {
	//DEBUG: ns.tail();
	function ramAvail(svr = new String) {
		ns.disableLog('getServerMaxRam'); ns.disableLog('getServerUsedRam');
		let avail = ns.getServerMaxRam(svr) - ns.getServerUsedRam(svr);
		return avail;
	}

	function svrScan() {
		let servers = ['home'];
		let targets = new Array;
		let platforms = new Array;
		let threadTotal = new Number;
		ns.disableLog('scan'); ns.disableLog('getServerMaxMoney');

		let delta = 0;
		do {
			delta = 0;
			for (const server of servers) {
				let serversNew = ns.scan(server);
				if (server != 'home') { serversNew.shift(); }
				for (const serverNew of serversNew) {
					if (!servers.includes(serverNew)) {
						servers.push(serverNew);
						let serverO = ns.getServer(serverNew);
						if (serverO.hasAdminRights) {
							if (ns.getServerMaxMoney(serverNew) > 0) { targets.push(serverNew); }
							if (ramAvail(serverNew) > 1.75) {
								platforms.push(serverNew);
								threadTotal += Math.floor(ramAvail(serverNew) / 1.75);
							}
						}
						delta++;
					}
				}
			}
		} while (delta > 0);
		platforms.unshift('home')
		return { servers: servers, platforms: platforms, targets: targets, threadTotal: threadTotal };
	}


	function launch(script = new String, threads = new Number, targ = new String, delay = new Number) {
		ns.disableLog('scp'); ns.disableLog('getScriptRam');  ns.enableLog('exec');
		let platforms = svrScan().platforms
		while (threads > 0) {
			let tAvail = Math.floor(ramAvail(platforms[0]) / ns.getScriptRam(script));
			if (tAvail > threads) {
				ns.scp(script, platforms[0], 'home')
				ns.exec(script, platforms[0], threads, targ, delay);
				threads = 0;
			} else if (tAvail == 0) {
				platforms.shift();
			} else if (threads >= tAvail && threads > 0) {
				ns.scp(script, platforms[0], 'home')
				ns.exec(script, platforms.shift(), tAvail, targ, delay);
				threads -= tAvail;
			}
		}
	}

	ns.disableLog('ALL');
	ns.enableLog('print');
	const target = ns.args[0];
	while (svrScan().threadTotal > 0) {
		ns.print('\n\nPreparing batch for ' + target);
		let initWtime = 0;
		let gTime = 0;
		let gDelay = 0;
		let gWtime = 0;
		let gWdelay = 0;

		let wknTgt = (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target));
		ns.print('Initial security:' + wknTgt);
		if (wknTgt > 0) {
			let tIw = Math.ceil(wknTgt / ns.weakenAnalyze(1));
			//DEBUG: ns.print('tIW: ' + tIw);
			if (tIw < svrScan().threadTotal && tIw > 0) {
				launch(wkn, tIw, target, 0);
			}
			initWtime = Math.ceil(ns.getWeakenTime(target));
		}

		let growth = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
		ns.print('Growth Factor: ' + growth);
		if (growth > 1) {
			let tG = new Number;
			if (growth < Infinity) { tG = Math.ceil(ns.growthAnalyze(target, growth)); }
			else { tG = 1; }
			gTime = Math.ceil(ns.getGrowTime(target));
			gDelay = initWtime - gTime;
			if (gDelay < 0) { gDelay = 0; }
			if (svrScan().threadTotal > tG && tG > 0) { launch(grw, tG, target, gDelay + 200); }
			let gSec = ns.growthAnalyzeSecurity(tG, target);
			ns.print('Growth Sec Impact: ' + gSec);
			let tGw = Math.ceil(gSec / ns.weakenAnalyze(1));
			gWtime = Math.ceil(ns.getWeakenTime(target));
			gWdelay = gTime - gWtime;
			if (gWdelay < 0) { gWdelay = 0; }
			if (svrScan().threadTotal > tGw && tGw > 0) { launch(wkn, tGw, target, gDelay + gWdelay + 200); }
		}

		let tH = Math.ceil(1 / ns.hackAnalyze(target));
		let hTime = Math.ceil(ns.getHackTime(target));
		let hDelay = gWtime - hTime;
		if (hDelay < 0) { hDelay = 0 }
		if (svrScan().threadTotal > tH) { launch(hak, tH, target, gDelay + gWdelay + hDelay + 200); }

		let batchTime = Math.ceil(Math.max(initWtime, gDelay + 200 + gTime, gDelay + gWdelay + 200 + gWtime, gDelay + gWdelay + hDelay + 200 + hTime));
		await ns.sleep(batchTime);
	}
}