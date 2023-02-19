/** @param {NS} ns */
export async function main(ns) {
	let files = ns.ls(ns.getHostname(), ns.args[0]);
	for (let file of files) {
		ns.rm(file);
	}
}