extraExt.requireConfigField[extraExt.grid.editor.xtype] = [
	'action',
	'url',
	'fields',
]
extraExt.create(
	extraExt.grid.editor.xtype,
	function(config) {
		config = config || {}
		var requireConfigField = extraExt.requireConfigField[extraExt.grid.editor.xtype].slice()
		var errorConfig = []
		var warnConfig = []
		var table = config.table
		var row = config.row
		var type = config.type || 'add'
		var ident = `extraExt-grid-editor_${type}_${Ext.id()}`
		var _updateData = {}
		config.url = table.url
		config.requestDataType = table.requestDataType
		switch( type ) {
			case 'add':
				config.action = table.create_action
				break
			default:
				//устанавливаем поля из таблицы
				for(const fieldKey in table.fields) {
					if(table.fields.hasOwnProperty(fieldKey)) {
						const field = table.fields[fieldKey]
						_updateData[field] = null
					}
				}
				config.updateData = Object.assign(_updateData, config.updateData)
				config.action = table.save_action
				break
		}
		if(!config.hasOwnProperty('fields') || config.fields.length === 0) {
			var fields = []
			for(const colKey in table.colModel.lookup) {
				if(table.colModel.lookup.hasOwnProperty(colKey)) {
					const col = table.colModel.lookup[colKey]
					var xtype = 'hidden'
					var editor = {
						table: table,
						changeable: true,
						visible: true,
						xtype: 'textfield',
						name: col.dataIndex,
						fieldLabel: col.header,
						id: `${col.dataIndex}_${type}_${ident}`,
						anchor: '99%',
						allowBlank: true,
					}
					if(col.hasOwnProperty('renderer')) {
						if(col.renderer instanceof Function)
							switch( col.renderer.name ) {
								case 'BOOL':
									editor.xtype = 'combo-boolean'
									break
								case 'PHP':
								case 'JSON':
								case 'CSS':
								case 'JS':
								case 'SQL':
									editor.xtype = 'textarea'
									break

							}
					}

					if(col.hasOwnProperty('extraExtEditor')) {
						editor = Object.assign(editor, col.extraExtEditor)
						if(editor.visible == false) {
							editor.xtype = 'hidden'
						}
						if(col.extraExtEditor.hasOwnProperty('defaultValue')) {
							editor.value = col.extraExtEditor.defaultValue
						}
					}
					if(config.hasOwnProperty('updateData') && config.updateData.hasOwnProperty(col.dataIndex)) {
						editor.value = config.updateData[col.dataIndex]
					}
					if(extraExt.requireConfigField.hasOwnProperty(editor.xtype)) {
						for(const key of extraExt.requireConfigField[editor.xtype]) {
							if(editor.hasOwnProperty(key)) {
								if(!extraExt.empty(editor[key])) {
									warnConfig.push(editor.xtype + '.' + key)
								}
							} else {
								warnConfig.push(editor.xtype + '.' + key)
							}
						}
						if(warnConfig.length > 0) {
							if(devMode) {
								console.warn(`ExtraExt: not set required config [${config.xtype || config.xtype}]`, warnConfig)
							}
						}
					}
					fields.push(editor)

				}
			}
			config.fields = fields
		}
		config.closeAction = 'close'
		config.listeners = {
			beforeSubmit: function(send_data) {
				return true
			},
			success: function() {
				MODx.msg.status({
					title: _('extraExt.' + type),
					message: _('extraExt.html.success'),
					delay: 3
				})
				Ext.getCmp(this.table.id).refresh()
				this.remove()
			},
			failure: function() {
				MODx.msg.status({
					title: _('extraExt.' + type),
					message: _('extraExt.html.failure'),
					delay: 3
				})
				Ext.getCmp(this.table.id).refresh()
				this.remove()
			},
		}
		Ext.applyIf(config, {
			title: `${_('extraExt.create')} `,
			closeAction: 'close',
			requestDataType: 'default',
			id: ident,
			saveBtnText: _('extraExt.save'),
			width: (window.innerWidth / 100) * 50,
		})
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
			console.error(`ExtraExt: invalid required config [${this.xtype || config.xtype}]`, errorConfig)
			return false
		}
		extraExt.xTypes[extraExt.grid.editor.xtype].superclass.constructor.call(this, config) // Магия

	},
	extraExt.xTypes[extraExt.window.xtype]
)