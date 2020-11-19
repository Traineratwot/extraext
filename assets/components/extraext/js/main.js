/**
 * @author Traineratwot
 * extraExt Object
 * @see extraExt.grid
 * @see extraExt.uniqueArray
 */
var extraExt = {}
extraExt.requireConfigField = {}
showdown.setFlavor('github')
extraExt.mdConverter = new showdown.Converter({
	tables: true,
	tasklists: true,
	smartIndentationFix: true,
	openLinksInNewWindow: true,
	emoji: true,
	// smoothPreview: '#wrap'
})
/**
 * FASTER array unique
 * @param {array} a
 */
extraExt.uniqueArray = (a) => {
	try {
		return [...new Set(a)]
	} catch(e) {
		var j = {}
		a.forEach(function(v) {
			j[v + '::' + typeof v] = v
		})

		return Object.keys(j).map(function(v) {
			return j[v]
		})
	}
}
/**
 * FASTER random key generator
 * @return {string}
 */
extraExt.uniqueId = () => {
	return Math.random().toString(36).slice(5)
}
/**
 * FASTER is empty
 * @param {mixed} a
 * @return {boolean}
 */
extraExt.empty = (a = null) => {
	try {
		if(typeof a === 'undefined') {
			throw true
		}
		if(a === null) {
			throw true
		}
		if(a === '') {
			throw true
		}

		throw false

	} catch(e) {
		return e
	}
}
extraExt.xTypes = {}
extraExt.classes = {}
extraExt.classes.grid = {}
/**
 * @author Traineratwot
 * extraExt Object
 * @see extraExt.grid.renderers
 * @see extraExt.grid.grid.
 */
extraExt.grid = {}

//# sourceMappingURL=main.js.map

//# sourceMappingURL=main.js.map
