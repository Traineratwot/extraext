extraExt.create(
	extraExt.tabs.xtype,
	function(config) {
		if(config.hasOwnProperty('items') && config.items.length > 0) {
			for(const itemsKey in config.items) {
				if(!config.items[itemsKey].hasOwnProperty('layout') && !config.items[itemsKey].hasOwnProperty('xtype')) {
					config.items[itemsKey].layout = 'anchor'
				}

			}
		}
		extraExt.xTypes[extraExt.tabs.xtype].superclass.constructor.call(this, config)
		this._onTabSwitch = function(c) {
			try {
				if(c.hidden == true) {
					var activeTab = extraExt.settings.get('extraExt.activeTab')
					if(typeof activeTab == 'undefined' || !activeTab instanceof Object || !activeTab) {
						activeTab = {}
					}
					activeTab[this.getId()] = c.getId()
					extraExt.settings.set('extraExt.activeTab', activeTab)
				}
			} catch(e) {
				if(devMode) {
					console.warn(e)
				}
			}
		}
	},
	MODx.Tabs
)
extraExt.bu.onStripMouseDown = MODx.Tabs.prototype.onStripMouseDown
MODx.Tabs.prototype.onStripMouseDown = function(b) {
	try {

		let a = this.findTargets(b)
		if(a.item && a.item != this.activeTab) {
			let c = this.getComponent(a.item)

			if(typeof this.onTabSwitch != 'undefined' && this.onTabSwitch instanceof Function) {
				this.onTabSwitch.call(this, c)
			}
			if(typeof this._onTabSwitch != 'undefined' && this._onTabSwitch instanceof Function) {
				this._onTabSwitch.call(this, c)
			}
			var tabSwitch = new CustomEvent('tabSwitch', {
				detail: {
					tab: this.getId(),
					active: c.getId(),
					data: c,
					title: c.title
				},
			})
			document.dispatchEvent(tabSwitch)
		}
	} catch(e) {
		if(devMode) {
			console.warn(e)
		}
	} finally {
		extraExt.bu.onStripMouseDown.call(this, ...arguments)
	}
}