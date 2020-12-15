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
	try {
		window['extraExt-copyright-img'].src = extraExtUrl + 'media/extraExt.long.png'
	} catch(e) {}
})
showdown.setFlavor('github')
MODx.config.modx_browser_default_viewmode = 'list'
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
		/**
		 * @author Traineratwot
		 * @see default
		 * @see HTML
		 * @see PHP
		 * @see JS
		 * @see SQL
		 * @see CSS
		 * @see PYTHON
		 * @see JSON
		 * @see BOOL
		 * @see CHECKBOX
		 * @see RADIO
		 * @see HEX
		 * @see IMAGE
		 * @see CONTROL
		 */
		renderers: {},
	},
	window: {
		xtype: 'extraExt-window'
	},
	simpleWindow: {
		xtype: 'extraExt-simpleWindow'
	},
	inputs: {
		modCombo: {
			xtype: 'extraExt-modCombo'
		},
		modComboSuper: {
			xtype: 'extraExt-modComboSuper'
		},
		search: {
			xtype: 'extraExt-search'
		},
	},
	tabs: {
		xtype: 'extraExt-tabs'
	},
	form: {
		xtype: 'extraExt-form'
	},
	bu: {},
	browser: {
		xtype: "extraExt-browser",
		browser: {xtype: "extraExt-browser-browser"},
		tree: {xtype: "extraExt-browser-Tree"},
		view: {xtype: "extraExt-browser-View"},
		window: {xtype: "extraExt-browser-Window"}
	},
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
	clickGridAction: 'data-extraext-grid_action',
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
	create: function(name, fn, extend, options = [{}]) {
		extraExt.xTypes[name] = fn
		Ext.extend(extraExt.xTypes[name], extend, ...options) // Наша табличка расширяет GridPanel
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
//переопределение menu
Ext.menu.Item.prototype.onRender = function(d, b) {
	if(!this.itemTpl) {
		this.itemTpl = Ext.menu.Item.prototype.itemTpl = new Ext.XTemplate(
			'<a id="{id}" class="{cls} x-unselectable" hidefocus="true" unselectable="on" href="{href}"',
			'<tpl if="hrefTarget">', ' target="{hrefTarget}"',
			'</tpl>',
			'>',
			'<img alt="{altText}" src="{icon}" class="x-menu-item-icon {iconCls}"/>',
			'<span class="x-menu-item-text">{text}</span>',
			'</a>')
	}
	if(this.hasOwnProperty('options') && this.options.hasOwnProperty('icon')) {
		this.itemTpl = Ext.menu.Item.prototype.itemTpl = new Ext.XTemplate(
			'<a id="{id}" class="{cls} x-unselectable" hidefocus="true" unselectable="on" href="{href}"',
			'<tpl if="hrefTarget">', ' target="{hrefTarget}"',
			'</tpl>',
			'>',
			'<span title="{altText}" style="text-align: center;" class="x-menu-item-icon {iconCls}">{icon}</span>',
			'<span class="x-menu-item-text">{text}</span>',
			'</a>')
	}
	var c = this.getTemplateArgs()
	this.el = b ? this.itemTpl.insertBefore(b, c, true) : this.itemTpl.append(d, c, true)
	this.iconEl = this.el.child('img.x-menu-item-icon')
	this.textEl = this.el.child('.x-menu-item-text')
	if(!this.href) {this.mon(this.el, 'click', Ext.emptyFn, null, {preventDefault: true})}
	Ext.menu.Item.superclass.onRender.call(this, d, b)
}
Ext.menu.Item.prototype.getTemplateArgs = function() {
	var icon = Ext.BLANK_IMAGE_URL
	if(this.hasOwnProperty('options') && this.options.hasOwnProperty('icon') && this.options.icon) {
		icon = this.options.icon
	}else{
		icon = this.icon
	}
	return {
		id: this.id,
		cls: this.itemCls + (this.menu ? ' x-menu-item-arrow' : '') + (this.cls ? ' ' + this.cls : ''),
		href: this.href || '#',
		hrefTarget: this.hrefTarget,
		icon: icon,
		iconCls: this.iconCls || '',
		text: this.itemText || this.text || '&#160;',
		altText: this.altText || ''
	}
}
