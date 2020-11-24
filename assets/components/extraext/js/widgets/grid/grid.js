extraExt.requireConfigField[extraExt.grid.xtype] = [
	'action',
	'url',
	'fields',
	'columns',
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
			requestDataType: 'default',
			searchKey: 'query',
			tbar: [],
			columns: [
				{
					dataIndex: 'id',
					header: 'id',
					sortable: true,
					renderer: extraExt.grid.renderers.default
				},
			],
			fields: ['id'],
			url: MODx.config.connector_url,
			action: 'resource/getlist',
			save_action: '',
			create_action: '',
			delete_action: '',
			paging: true,
			autoHeight: true,
			autoSize: true,
			anchor: '95%',
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
		//add actions
		if(config.extraExtCreate && config.create_action) {
			config.tbar.unshift(
				{
					xtype: 'button', // Перемещаем сюда нашу кнопку
					text: _('extraExt.create'),
					cls: 'primary-button',
					handler: () => {
						MODx.load({
							xtype: config.extraEditor,
							title: _('extraExt.create') + ` ${config.name}`,
							type: 'add',
							table: this,
						}).show()
					},
				}
			)
		}
		if(config.extraExtSearch && config.searchKey) {
			config.extraExtSearchFn = function(tf, nv, ov) {

				var s = this.getStore()
				var val = tf.getValue()
				if(val) {
					s.baseParams[this.searchKey] = tf.getValue()
				} else {
					s.baseParams[this.searchKey] = null
					delete s.baseParams[this.searchKey]
				}
				this.getBottomToolbar().changePage(1)
				this.refresh()
			}
			config.tbar.push(
				{
					xtype: 'textfield',
					emptyText: _('extraExt.search'),
					listeners: {
						'change': {
							fn: function() {this.extraExtSearchFn.call(this, ...arguments)},
							scope: this
						},
						'render': {
							fn: function(cmp) {
								new Ext.KeyMap(cmp.getEl(), {
									key: Ext.EventObject.ENTER
									, fn: function() {
										this.fireEvent('change', this)
										this.blur()
										return true
									}
									, scope: cmp
								})
							}, scope: this
						}
					}
				}
			)
		}
		if(config.extraExtUpdate && config.save_action) {
			config.extraExtUpdateFn = function() {
				var cs = this.getSelectedPrimaryKey()
				var self = this
				var row = this.getSelectionModel().getSelections()[0]
				var data = row.data
				MODx.load({
					xtype: config.extraEditor,
					title: _('extraExt.update') + ` ${data[self.nameField]}`,
					updateData: data,
					type: 'update',
					table: self,
					row: row,
				}).show()
			}
			config.extraExtMenus.update = (grid, rowIndex) => {
				return {
					text: _('extraExt.update'),
					grid: grid,
					rowIndex: rowIndex,
					handler: this.extraExtUpdateFn
				}
			}
		}
		if(config.extraExtDelete && config.delete_action) {
			config.extraExtDeleteFn = function() {
				var cs = this.getSelectedAsList()
				var self = this
				var url = this.url
				var params = {
					action: this.delete_action,
				}
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
					text: _('delete'),
					grid: grid,
					rowIndex: rowIndex,
					handler: this.extraExtDeleteFn
				}
			}
		}
		config.getMenu = function(grid, rowIndex) {
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
		if(config.extraExtUpdate || config.extraExtCreate) {
			requireConfigField.push('nameField')
			requireConfigField.push('keyField')
		}
		//validator
		if(config.extraExtSearch) {
			requireConfigField.push('searchKey')
		}
		if(config.extraExtUpdate) {
			requireConfigField.push('save_action')
		}
		if(config.extraExtCreate) {
			requireConfigField.push('create_action')
		}
		if(config.extraExtDelete) {
			requireConfigField.push('delete_action')
		}
		for(const key of requireConfigField) {
			if(config.hasOwnProperty(key)) {
				if(extraExt.empty(config[key])) {
					errorConfig.push(key)
				}
			} else {
				errorConfig.push(key)
			}

		}
		if(errorConfig.length > 0) {
			console.error(`ExtraExt: invalid require config [${this.xtype || config.xtype}]`, errorConfig)
			return false
		}
		//функции
		this.saveRecord = function(e) {

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
		}
		this.getSelectedPrimaryKey = function() {
			var selects = this.getSelectionModel().getSelections()
			if(selects.length <= 0) return false
			var cs = ''
			for(var i = 0; i < selects.length; i++) {
				cs += ',' + selects[i].data[this.keyField]
			}
			cs = cs.substr(1)
			return cs
		}
		this.addMenu = function(m, grid, rowIndex) {
			return m
		}
		extraExt.xTypes[extraExt.grid.xtype].superclass.constructor.call(this, config) // Магия

	},
	MODx.grid.Grid
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