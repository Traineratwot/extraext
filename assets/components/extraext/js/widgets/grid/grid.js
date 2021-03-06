extraExt.requireConfigField[extraExt.grid.xtype] = [
	'action',
	'url',
	'fields',
]
extraExt.create(
	extraExt.grid.xtype,
	function(config) { // Придумываем название, например, «Names»
		config = config || {}
		var requireConfigField = extraExt.requireConfigField[this.xtype || config.xtype].slice()
		var errorConfig = []
		config = Object.assign({
			id: Ext.id(),
			extraEditor: extraExt.grid.editor.xtype,
			extraExtSearch: false,
			requestDataType: 'form',
			searchKey: 'query',
			tbar: [],
			leftTbar: function() {
				return [];
			},
			rightTbar: function() {
				return [];
			},
			rightBbar: function() {
				return [];
			},
			leftBbar: function() {
				return [];
			},
			columns: [
				{
					dataIndex: 'id',
					header: 'id',
					sortable: true,
					renderer: extraExt.grid.renderers.default
				},
			],
			paging: true,
			fields: ['id'],
			url: MODx.config.connector_url,
			action: 'resource/getlist',
			save_action: '',
			create_action: '',
			delete_action: '',
			autoHeight: true,
			autoSize: true,
			anchor: '99%',
			autoExpandColumn: 'content',
			viewConfig: {
				forceFit: true,
				enableRowBody: true,
				autoFill: true,
				showPreview: true,
				scrollOffset: 0,
			},
			remoteSort: true,
			extraExtMenus: {},
			keyField: 'id',
			nameField: 'id',
			sortBy: config.keyField,
			sortDir: 'ASC',
			extraExtSearch: false,
			extraExtUpdate: false,
			extraExtCreate: false,
			extraExtDelete: false,
		}, config)
		config.leftTbar  = config.leftTbar()
		config.rightTbar = config.rightTbar()
		config.rightBbar = config.rightBbar()
		config.leftBbar  = config.leftBbar()
		//add actions
		if(config.extraExtCreate && config.create_action) {
			if(!config.hasOwnProperty('createBtnText')) {
				config.createBtnText = _('create') + ' ' + config.name
			}
			config.leftTbar.unshift(
				{
					xtype: 'button', // Перемещаем сюда нашу кнопку
					text: '<i class="fas fa-plus"></i>&nbsp;' + config.createBtnText,
					handler: this.ExtraExtCreate,
					scope: this,
				}
			)
		}
		if(config.extraExtSearch && config.searchKey) {
			config.rightTbar.unshift(
				{
					xtype: extraExt.inputs.search.xtype,
					width: '150',
					name: this.searchKey,
					listeners: {
						search: {
							fn: function(field) {
								this.extraExtSearchFn.call(this, ...arguments)
							}, scope: this
						},
						clear: {
							fn: function(field) {
								field.setValue('')
								this.extraExtClearSearch()
							}, scope: this
						},
					}
				}
			)
		}
		if(config.extraExtUpdate && config.save_action) {
			this.extraExtUpdateFn = function() {
				var cs = this.getSelectedPrimaryKey()
				var self = this
				var row = this.getSelectionModel().getSelections()[0]
				var data = row.data
				MODx.load({
					xtype: this.extraEditor,
					title: _('extraExt.update') + ` ${data[self.nameField]}`,
					updateData: data,
					type: 'update',
					table: self,
					row: row,
				}).show()
			}
			config.extraExtMenus.update = (grid, rowIndex) => {
				return {
					icon: '<i class="fad fa-edit"></i>',
					text: _('extraExt.update'),
					grid: grid,
					rowIndex: rowIndex,
					handler: this.extraExtUpdateFn
				}
			}
		}
		if(config.extraExtDelete && config.delete_action) {
			this.extraExtDeleteFn = function() {
				var cs = this.getSelectedPrimaryKey()
				var self = this
				var url = this.url
				var params = Object.assign({},this.store.baseParams)
				params.action = this.delete_action
				params[this.keyField] = cs
				MODx.msg.confirm({
					title: _('delete'),
					text: _('confirm_remove'),
					url: url,
					params: params,
					listeners: {
						'success': {
							fn: function(r) {
								if(!r.success) {
									MODx.msg.status({
										title: _('undeleted'),
										message: _('extraExt.html.failure'),
										delay: 3
									})
								} else {
									MODx.msg.status({
										title: _('delete'),
										message: _('extraExt.html.success'),
										delay: 3
									})
								}
								self.refresh()
							}, scope: true
						},
						'failure': {
							fn: function(r) {
								MODx.msg.status({
									title: _('undeleted'),
									message: _('extraExt.html.failure'),
									delay: 3
								})
							}, scope: true
						}
					}
				})
			}
			config.extraExtMenus.delete = (grid, rowIndex) => {
				return {
					icon: '<i class="fas fa-minus"></i>',
					text: _('delete'),
					grid: grid,
					rowIndex: rowIndex,
					handler: this.extraExtDeleteFn
				}
			}
		}
		this.getMenu = function(grid, rowIndex) {
			var m = []
			for(const menu in config.extraExtMenus) {
				if(config.extraExtMenus.hasOwnProperty(menu)) {
					if(config.extraExtMenus[menu] instanceof Function) {
						m.push(config.extraExtMenus[menu](grid, rowIndex))
					}
				}
			}
			m = this.addMenu.call(this, m, grid, rowIndex)
			return m
		}
		if(this.extraExtUpdate || this.extraExtCreate) {
			requireConfigField.push('nameField')
			requireConfigField.push('keyField')
		}
		config.tbar = this.getTopBar.call(this, config)
		config.bbar = this.getBotBar.call(this, config)
		if(config.hasOwnProperty('baseParams')) {
			delete config.baseParams
		}

		extraExt.xTypes[extraExt.grid.xtype].superclass.constructor.call(this, config) // Магия

		Object.assign(this.getStore().baseParams, config.base_params)
		//validator
		if(this.extraExtSearch) {
			requireConfigField.push('searchKey')
		}
		if(this.extraExtUpdate) {
			requireConfigField.push('save_action')
		}
		if(this.extraExtCreate) {
			requireConfigField.push('create_action')
		}
		if(this.extraExtDelete) {
			requireConfigField.push('delete_action')
		}
		for(const key of requireConfigField) {
			if(this.hasOwnProperty(key)) {
				if(extraExt.empty(this[key])) {
					errorConfig.push(key)
				}
			} else {
				errorConfig.push(key)
			}

		}
		if(errorConfig.length > 0) {
			if(devMode) {
				console.warn(`ExtraExt: invalid require this [${this.xtype || this.xtype}]`, errorConfig)
			}
			//return false
		}
		this.getId = function() {
			return this.id || config.id
		}
	},
	MODx.grid.Grid,
	[{
		leftTbar: [],
		rightTbar: [],
		rightBbar: [],
		leftBbar: [],
		extraExtMenus: {},
		saveRecord: function(e) {
			e.record.data.menu = null
			var p = this.config.saveParams || {}
			Ext.apply(e.record.data, p)
			var url = this.config.saveUrl || this.config.url || this.config.connector
			var params = {
				action: this.config.save_action
			}
			if(this.requestDataType == 'json') {
				var d = Ext.util.JSON.encode(e.record.data)
				Object.assign(params, {data: d})
			} else {
				Object.assign(params, e.record.data)
			}
			MODx.Ajax.request({
				url: url,
				params: params,
				listeners: {
					success: {
						fn: function(r) {
							this.config.save_callback && Ext.callback(this.config.save_callback, this.config.scope || this, [r]),
								e.record.commit(),
							this.config.preventSaveRefresh || this.refresh(),
								this.fireEvent('afterAutoSave', r)
						},
						scope: this
					},
					failure: {
						fn: function(r) {
							e.record.reject(),
								this.fireEvent('afterAutoSave', r)
						},
						scope: this
					}
				}
			})
		},
		getSelectedPrimaryKey: function() {
			var selects = this.getSelectionModel().getSelections()
			if(selects.length <= 0) return false
			var cs = ''
			for(var i = 0; i < selects.length; i++) {
				cs += ',' + selects[i].data[this.keyField]
			}
			cs = cs.substr(1)
			return cs
		},
		addMenu: function(m, grid, rowIndex) {
			return m
		},
		getTopBar: function(config) {
			var tbar = config.tbar || []
			for(const leftTbarKey in config.leftTbar) {
				if(config.leftTbar.hasOwnProperty(leftTbarKey)) {
					tbar.push(config.leftTbar[leftTbarKey])
				}
			}
			tbar.push('->')
			for(const rightTbarKey in config.rightTbar) {
				if(config.rightTbar.hasOwnProperty(rightTbarKey)) {
					tbar.push(config.rightTbar[rightTbarKey])
				}
			}
			return tbar
		},
		getBotBar: function(config) {
			if(this.paging == 1 || config.paging == 1) {
				return undefined
			}
			var bbar = this.bbar || []
			for(const leftBbarKey in config.leftBbar) {
				if(config.leftTbar.hasOwnProperty(leftBbarKey)) {
					bbar.push(config.leftBbar[leftBbarKey])
				}
			}
			bbar.push('->')
			for(const rightBbarKey in config.rightBbar) {
				if(config.rightTbar.hasOwnProperty(rightBbarKey)) {
					bbar.push(config.rightBbar[rightBbarKey])
				}
			}
			return bbar
		},
		extraExtSearchFn: function(tf) {
			this.getStore().baseParams[this.searchKey] = tf.getValue()
			this.getBottomToolbar().changePage(1)
		},
		extraExtClearSearch: function() {
			this.getStore().baseParams[this.searchKey] = null
			this.getBottomToolbar().changePage(1)
		},
		ExtraExtCreate: function() {
			MODx.load({
				xtype: this.extraEditor,
				title: _('extraExt.create') + ` ${this.name}`,
				type: 'add',
				table: this,
			}).show()
		},
		onClick: function(e) {
			var elem = e.getTarget()
			if(elem.hasAttribute(extraExt.clickGridAction)) {
				var row = this.getSelectionModel().getSelected()
				if(typeof (row) != 'undefined') {
					var action = elem.getAttribute('action')
					if(action == 'showMenu') {
						var ri = this.getStore().find('id', row.id)
						return this._showMenu(this, ri, e)
					} else if(typeof this[action] === 'function') {
						this.menu.record = row.data
						var x = elem.getAttribute('data-x')
						var y = elem.getAttribute('data-y')
						var row = this.getRow(y)
						var col = this.getCol(x)
						return this[action].call(this, e, row, col, x, y)
					}
				}
			} else if(elem.nodeName == 'A' && elem.href.match(/(\?|\&)a=resource/)) {
				if(e.button == 1 || (e.button == 0 && e.ctrlKey == true)) {
					// Bypass
				} else if(elem.target && elem.target == '_blank') {
					// Bypass
				} else {
					e.preventDefault()
					MODx.loadPage('', elem.href)
				}
			}
			return this.processEvent('click', e)
		},
		getRow: function(y) {
			return this.store.data.items[y]
		},
		getCol: function(x) {
			return this.getColumnModel().config[x]
		},
	}]
)

extraExt.bu.updateColumnHidden = Ext.grid.GridView.prototype.updateColumnHidden
Ext.grid.GridView.prototype.updateColumnHidden = function(b, j) {
	try {
		var tableId = this.hmenu.id.replace('-hctx', '')
		var settings = extraExt.settings.get('extraExt.grids') || {}

		if(!settings.hasOwnProperty(tableId)) {
			settings[tableId] = {}
		}
		if(!settings[tableId].hasOwnProperty('HiddenCol')) {
			settings[tableId].HiddenCol = {}
		}
		settings[tableId].HiddenCol[b.toString()] = j

		extraExt.settings.set('extraExt.grids', settings)
	} catch(e) {
		if(devMode) {
			console.warn(e)
		}
	} finally {
		extraExt.bu.updateColumnHidden.call(this, b, j)
	}
}