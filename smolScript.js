/** @param {NS} ns */
import { wkn, grw } from '/scripts/prod/lib.js';
export async function main(ns) {
	function ramAvail(svr = new String) {
		return ns.getServerMaxRam(svr) - ns.getServerUsedRam(svr);
	}

	function svrScan() {
		let servers = ['home'];		//vars that will be returned
		let targets = new Array;
		let platforms = ['home'];
		let threadTotal = Math.floor(ramAvail('home') / 1.75);

		let serverBloc = new Array;	//ancilliary vars

		let delta = 0;
		do {
			delta = 0;
			for (const server of servers) {
				let serversNew = ns.scan(server);
				if (server != 'home') { serversNew.shift(); }
				for (const serverNew of serversNew) {
					if (!servers.includes(serverNew)) {
						servers.push(serverNew);				//start of all servers' code
						let route = [ns.scan(serverNew)[0]];	//serverBloc writer
						while (route[0] != 'home') { route.unshift(ns.scan(route[0])[0]); }
						serverBloc.push(serverNew +
							'\nCores: ' + ns.getServer(serverNew).cpuCores +
							'\nRAM: ' + ns.getServerMaxRam(serverNew) +
							'\nLvl: ' + ns.getServerRequiredHackingLevel(serverNew) +
							'\nMaxCash: ' + ns.getServerMaxMoney(serverNew).toLocaleString() +
							'\nRoute: ' + (route.length) +
							'\n' + route.join(', '));
						let litFiles = ns.ls(serverNew, ".lit");//.lit file gatherer
						for (let file of litFiles) {
							ns.scp(file, "home", serverNew);
						}
						let serverO = ns.getServer(serverNew);//end of all servers' code

						//start of attempt to gain AdminRights
						if (!serverO.hasAdminRights) {
							function getOpenExes() {
								let exes = ns.ls('home', '.exe');
								let open = new Array;
								for (let file of exes) {
									if (file.match(/(SSH|FTP|SMTP|HTTP|SQL).*?\.exe$/)) { open.push(file); }
								}
								return open;
							}

							ns.print('Attempting to break into ' + serverNew);
							const reqs = ns.getServerNumPortsRequired(serverNew);
							if (reqs == serverO.openPortCount) {
								ns.nuke(serverNew);
							}
							else if (reqs <= getOpenExes().length) {
								for (let exe of getOpenExes().slice(0, reqs)) {
									switch (exe) {
										case 'BruteSSH.exe':
											ns.brutessh(serverNew);
											break;
										case 'FTPCrack.exe':
											ns.ftpcrack(serverNew);
											break;
										case 'relaySMTP.exe':
											ns.relaysmtp(serverNew);
											break;
										case 'HTTPWorm.exe':
											ns.httpworm(serverNew);
											break;
										case 'SQLInject.exe':
											ns.sqlinject(serverNew);
											break;
									}
								}
								ns.nuke(serverNew);
							}
						} //end of attempt to gain AdminRights

						//designate targets or platforms, and count one-off threads
						if (serverO.hasAdminRights) {
							serverBloc.push(serverBloc.pop() + '\nHackable: Y');
							if (ns.getServerMaxMoney(serverNew) > 0) { targets.push(serverNew); }
							if (ramAvail(serverNew) > 1.75) {
								platforms.push(serverNew);
								threadTotal += Math.floor(ramAvail(serverNew) / 1.75);
							}
						}
						else { serverBloc.push(serverBloc.pop() + '\nHackable: N'); }

						delta++;
					}
				}
			}
		} while (delta > 0);
		//results begin
		ns.write('servers.txt', serverBloc.join('\n\n'), "w");
		return { servers: servers, platforms: platforms, targets: targets, threadTotal: threadTotal };
	}
	function launch(script = new String, threads = new Number, targ = new String, delay = new Number) {
		ns.print('Attempting to launch ' + threads + ' threads of ' + script);
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

	//Start of real main
	//DEBUG: ns.tail();
	let sngl = '/scripts/prod/singles.js'
	while (true) {
		for (let target of svrScan().targets) {
			while (ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target)) {
				while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
					launch(wkn, svrScan().threadTotal, target, 0);
					await ns.sleep(Math.ceil(ns.getWeakenTime(target)) + 2000);
				}
				launch(grw, svrScan().threadTotal, target, 0);
				await ns.sleep(Math.ceil(ns.getGrowTime(target)) + 2000);
			}
			let sThread = Math.floor(ramAvail(target) / ns.getScriptRam(sngl));
			if (sThread > 0) {
				ns.scp(sngl, target, 'home');
				ns.exec(sngl, target, Math.floor(ramAvail(target) / 2.40), target);
			}
		}
		await ns.sleep(60000);
	}
}