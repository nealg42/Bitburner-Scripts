/** @param {NS} ns */
export async function main(ns) {
	let servers = ['home'];
	let routes = new Object;

	let delta = 0;
	do {
		delta = 0;
		for (const server of servers) {
			let serversNew = ns.scan(server);
			if (server != 'home') { serversNew.shift(); }
			for (const serverNew of serversNew) {
				if (!servers.includes(serverNew)) {
					servers.push(serverNew);
					let route = [ns.scan(serverNew)[0]];
					while (route[0] != 'home') { route.unshift(ns.scan(route[0])[0]); }
					routes[serverNew] = route;
					delta++;
				}
			}
		}
	} while (delta > 0);

	for (let node of routes[ns.args[0]]) {
		ns.singularity.connect(node);
	}
	ns.singularity.connect(ns.args[0]);
}