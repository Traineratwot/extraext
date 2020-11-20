/**
 * @author Traineratwot
 * extraExt Object
 * @see extraExt.grid
 * @see extraExt.uniqueArray
 */
Ext.onReady(function() {
	setTimeout(() => {extraExt.hideColFromSettings()}, 500)

})
showdown.setFlavor('github')
var extraExt = {
	xTypes: {},
	classes: {
		grid: {}
	},
	grid: {},
	bu: {},
	requireConfigField: {},
	mdConverter: new showdown.Converter({
		tables: true,
		tasklists: true,
		smartIndentationFix: true,
		openLinksInNewWindow: true,
		emoji: true,
		// smoothPreview: '#wrap'
	}),
	uniqueArray: (a) => {
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
	},
	trim: (str = '', L = '\s', R = false, replace = '') => {
		if(!R) {
			R = L
		}
		var reg1 = new RegExp('(^' + L + '+)')
		var reg2 = new RegExp('(' + R + '+$)')
		return str.replace(reg1, replace).replace(reg2, replace)
	},
	empty: (a = null) => {
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
	},
	hideColFromSettings: function() {
		try {
			var t = extraExt.settings.get('extraExt.grids')
			if(t) {
				if(typeof componentName != 'undefined' && !extraExt.empty(componentName)) {
					if(t.hasOwnProperty(componentName)) {
						for(const tKey in t[componentName]) {
							tVal = t[componentName][tKey]
							if(tVal.hasOwnProperty('HiddenCol')) {
								for(const HiddenColKey in tVal.HiddenCol) {
									Ext.getCmp(tKey).getColumnModel().setHidden(HiddenColKey, tVal.HiddenCol[HiddenColKey])
								}
							}
						}
					}
				} else {
					for(const tKey in t) {
						tVal = t[tKey]
						if(tVal.hasOwnProperty('HiddenCol')) {
							for(const HiddenColKey in tVal.HiddenCol) {
								Ext.getCmp(tKey).getColumnModel().setHidden(HiddenColKey, tVal.HiddenCol[HiddenColKey])
							}
						}
					}
				}
			}
		} catch(e) {
			if(devMode) {
				console.warn(e)
			}
		}
	}
}
extraExt.classes.settings = class {
	settings = {}


	set(key, value) {
		this.getAll()
		this.settings[key] = value
		return this.setLocalStorage('extraExt.settings', this.settings)
	}


	get(key) {
		if(this.getAll()) {
			return this.settings[key]
		}
		return false
	}


	getAll() {
		var settings = this.getLocalStorage('extraExt.settings')
		if(settings instanceof Object || settings instanceof Array) {
			this.settings = settings
			return settings
		}
		return false
	}


	getLocalStorage(name) {
		name = name.toString()
		if(name) {
			try {
				return JSON.parse(localStorage[name])
			} catch(e) {
				if(typeof localStorage[name] != 'undefined') {
					return localStorage[name]
				} else {
					return false
				}
			}
		}
	}


	setLocalStorage(name, value = {}) {
		name = name.toString()
		var store = this.getLocalStorage(name)
		try {
			if(value instanceof Object || value instanceof Array) {
				if(store instanceof Object || store instanceof Array) {
					value = Object.assign(store, value)
				}
				value = JSON.stringify(value)
			}

			localStorage[name] = value
			return true
		} catch(e) {
			return e
		}
		return false
	}
}
extraExt.settings = new extraExt.classes.settings()

extraExt.bu.updateColumnHidden = Ext.grid.GridView.prototype.updateColumnHidden
Ext.grid.GridView.prototype.updateColumnHidden = function(b, j) {
	try {
		var tableId = this.hmenu.id.replace('-hctx', '')
		var settings = extraExt.settings.get('extraExt.grids') || {}
		if(typeof componentName != 'undefined' && !extraExt.empty(componentName)) {
			if(!settings.hasOwnProperty(componentName)) {
				settings[componentName] = {}
			}
			if(!settings[componentName].hasOwnProperty(tableId)) {
				settings[componentName][tableId] = {}
			}
			if(!settings[componentName][tableId].hasOwnProperty('HiddenCol')) {
				settings[componentName][tableId].HiddenCol = {}
			}
			settings[componentName][tableId].HiddenCol[b.toString()] = j
		} else {
			if(!settings.hasOwnProperty(tableId)) {
				settings[tableId] = {}
			}
			if(!settings[tableId].hasOwnProperty('HiddenCol')) {
				settings[tableId].HiddenCol = {}
			}
			settings[tableId].HiddenCol[b.toString()] = j
		}
		extraExt.settings.set('extraExt.grids', settings)
	} catch(e) {
		if(devMode) {
			console.warn(e)
		}
	}
	extraExt.bu.updateColumnHidden.call(this, b, j)
}

//# sourceMappingURL=main.js.map

//# sourceMappingURL=main.js.map
