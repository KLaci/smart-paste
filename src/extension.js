async function activate(context) {
	(await import('./registerModel.mjs')).activate(context);
}
module.exports.activate = activate;
