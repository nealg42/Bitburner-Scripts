/** @param {NS} ns */
import { solveCct } from 'contractsLib.js';
import { wkn, grw, hak } from 'scripts/prod/lib.js';
export async function main(ns) {
	//DEBUG: ns.tail();

	function ramAvail(svr = new String) { return ns.getServerMaxRam(svr) - ns.getServerUsedRam(svr); }

	function svrScan() {
		let servers = ['home'];		//vars that will be returned
		let targets = new Array;
		let platforms = new Array;
		let threadTotal = new Number;

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

						let cctFiles = ns.ls(serverNew, '.cct');//start of .cct contract solver
						if (cctFiles.length > 0) {
							for (let file of cctFiles) {
								const type = ns.codingcontract.getContractType(file, serverNew);
								ns.print(type + ', ' + file + ' on ' + serverNew);
								let fileName = ns.codingcontract.getContractType(file, serverNew).replace(/^.*?:\s/, '').replace(/\s/g, '_').replace(/è/, 'e');
								ns.write('/contracts/' + fileName + '.txt', serverNew + '\n' + ns.codingcontract.getDescription(file, serverNew), 'w');

								function atmpt(solution, file, serverNew) {
									if (solution == 'No solution ready') { ns.print('No solution ready'); }
									else {
										let msg = ns.codingcontract.attempt(solution, file, serverNew);
										if (msg) {
											ns.print(msg);
										} else {
											let type = ns.codingcontract.getContractType(file, serverNew);
											ns.print('Failed to ' + type + ' ' + file + ' on ' + serverNew);
										}
									}
								}

								let data = ns.codingcontract.getData(file, serverNew)
								let solution = solveCct(type, data);
								ns.print(solveCct(type, data));
								if (solution != undefined) { atmpt(solution, file, serverNew); }
							}
						}//end of contract attempt

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

							const reqs = ns.getServerNumPortsRequired(serverNew);
							if (reqs <= serverO.openPortCount) {
								ns.nuke(serverNew);
							}
							else if (reqs <= getOpenExes().length) {
								ns.print('Attempting to break into ' + serverNew);
								for (let exe of getOpenExes()) {
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
						let scriptMax = Math.max(ns.getScriptRam(wkn), ns.getScriptRam(grw), ns.getScriptRam(hak));
						if (serverO.hasAdminRights) {
							serverBloc.push(serverBloc.pop() + '\nHackable: Y');
							if (ns.getServerMaxMoney(serverNew) > 0 && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverNew)) { targets.push(serverNew); }
							if (ramAvail(serverNew) > scriptMax) {
								platforms.push(serverNew);
								threadTotal += Math.floor(ramAvail(serverNew) / scriptMax);
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

	//Start of real main
	//DEBUG: ns.tail();
	let hacnet = 'hacknet.js';
	if (ramAvail('home') < 1) { ns.spawn('smolScript.js'); }
	else if (ns.getRunningScript(hacnet, 'home') == null &&
		ramAvail('home') > ns.getScriptRam(hacnet)) {
		ns.run('hacknet.js');
	}

	const batMkr = 'batchMaker.js';
	while (true) {
		for (let target of svrScan().targets) {
			if (ns.getRunningScript(batMkr, 'home', target) == null && ramAvail('home') > ns.getScriptRam(batMkr)) {
				ns.run(batMkr, 1, target);
			}
		}
		await ns.sleep(30000);
	}
}