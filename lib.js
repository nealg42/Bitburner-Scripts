/** @param {NS} ns */

//One-off hacking script file paths. args = [target, delay]
export const wkn = 'tWeak.js'
export const grw = 'tGrow.js'
export const hak = 'tHack.js'


//NS based functions that I'm not sure how to import, but I like to have them recorded
export function tAvail(svr = new String, script = new String) {
    ns.disableLog('getScriptRam');
    return Math.floor(ramAvail(svr) / ns.getScriptRam(script));
}

export function ramAvail(svr = new String) {
    ns.disableLog('getServerMaxRam'); ns.disableLog('getServerUsedRam');
    let avail = ns.getServerMaxRam(svr) - ns.getServerUsedRam(svr);
    return avail;
}