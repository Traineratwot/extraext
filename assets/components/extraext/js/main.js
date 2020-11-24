/**
 * @author Traineratwot
 * extraExt Object
 * @see extraExt.grid
 * @see extraExt.uniqueArray
 */
Ext.onReady(function() {
	setTimeout(() => {
		extraExt.hideColFromSettings()
		extraExt.activeLastTab()
	}, 50)
})
showdown.setFlavor('github')
var extraExt = {
	url: (new URL(document.location)),
	xTypes: {},
	classes: {
		grid: {},
		settings: {},
		util: {
			renderer: {}
		}
	},
	grid: {
		xtype: 'extraExt-grid',
		editor: {
			xtype: 'extraExt-grid-editor'
		},
		renderers: {},
	},
	window: {
		xtype: 'extraExt-window'
	},
	inputs: {
		modCombo: {
			xtype: 'extraExt-modCombo'
		},
		modComboSuper: {
			xtype: 'extraExt-modComboSuper'
		}
	},
	tabs: {
		xtype: 'extraExt-tabs'
	},
	bu: {},
	requireConfigField: {},
	mdConverter: new showdown.Converter({
		tables: true,
		tasklists: true,
		smartIndentationFix: true,
		openLinksInNewWindow: true,
		parseImgDimensions: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		simpleLineBreaks: true,
		omitExtraWLInCodeBlocks: true,
		emoji: true,
		// smoothPreview: '#wrap'
	}),
	util: {},
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
				for(const tKey in t) {
					tVal = t[tKey]
					if(tVal.hasOwnProperty('HiddenCol')) {
						for(const HiddenColKey in tVal.HiddenCol) {
							Ext.getCmp(tKey).getColumnModel().setHidden(HiddenColKey, tVal.HiddenCol[HiddenColKey])
						}
					}
				}
			}

		} catch(e) {
			if(devMode) {
				console.warn(e)
			}
		}
	},
	activeLastTab: function() {
		try {
			var t = extraExt.settings.get('extraExt.activeTab')
			if(t) {
				for(const tKey in t) {
					tVal = t[tKey]
					Ext.getCmp(tKey).setActiveTab(tVal)
				}
			}

		} catch(e) {
			if(devMode) {
				console.warn(e)
			}
		}
	},
	create: function(name, fn, extend) {
		extraExt.xTypes[name] = fn
		Ext.extend(extraExt.xTypes[name], extend) // Наша табличка расширяет GridPanel
		Ext.reg(name, extraExt.xTypes[name]) // Регистрируем новый xtype
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
			if(this.settings.hasOwnProperty(key)) {
				return this.settings[key]
			}
			return null
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
		name = componentName + '.' + name.toString()
		try {
			this.size = new Blob(Object.values(localStorage[name])).size
		} catch(e) {}
		if(name) {
			try {
				if(typeof localStorage[name] != 'undefined') {
					var value = localStorage.getItem(name)
					try {
						return JSON.parse(value)
					} catch(e) {
						return value
					}
				} else {
					return false
				}
			} catch(e) {
				if(devMode) {
					console.warn(e)
				}
				return false
			}
		}
	}


	setLocalStorage(name, value = {}) {
		name = componentName + '.' + name.toString()
		var store = this.getLocalStorage(name)
		try {
			if(value instanceof Object || value instanceof Array) {
				if(store instanceof Object || store instanceof Array) {
					value = Object.assign(store, value)
				}
				value = JSON.stringify(value)
			}
			localStorage.setItem(name, value)
			return true
		} catch(e) {
			if(devMode) {
				console.warn(e)
			}
			return false
		}
		return false
	}
}
extraExt.settings = new extraExt.classes.settings()