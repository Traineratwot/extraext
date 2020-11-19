extraExt.grid.editor = {}
extraExt.grid.editor.xtype = 'extraExt-grid-editor'
extraExt.requireConfigField[extraExt.grid.editor.xtype] = [
	'action',
	'url',
	'fields',
]
extraExt.xTypes[extraExt.grid.editor.xtype] = function(config) {
	config = config || {}
	var requireConfigField = extraExt.requireConfigField[this.xtype || config.xtype].slice()
	var errorConfig = []
	var warnConfig = []
	var table = config.table
	var row = config.table
	var columns = config.columns
	var type = config.type || 'add'
	var ident = `extraExt-grid-editor_${type}_${row.id}_${Ext.id()}`
	var _updateData = {}
	var fields = []
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
	//генерация полей
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
					console.warn(`ExtraExt: not set required config [${this.xtype || config.xtype}]`, warnConfig)
				}
			}
			fields.push(editor)

		}
	}
	Object.assign({}, config)
	config.fields = fields
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
	console.log(this)
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
	console.log(this.fp)
	if(this.hasOwnProperty('requestDataType')) {
		this.fp.getForm().requestDataType = this.requestDataType
	}
	this.fp.getForm().doAction = function(b, a) {
		if(b == 'submit' && this.requestDataType == 'json') {
			if(Ext.isString(b)) {b = new extraExt.inputs.Submit(this, a)}
			if(this.fireEvent('beforeaction', this, b) !== false) {
				this.beforeAction(b)
				b.run.defer(100, b)
			}
			return this
		}
		if(Ext.isString(b)) {b = new Ext.form.Action.ACTION_TYPES[b](this, a)}
		if(this.fireEvent('beforeaction', this, b) !== false) {
			this.beforeAction(b)
			b.run.defer(100, b)
		}
		return this
	}

}
Ext.extend(extraExt.xTypes[extraExt.grid.editor.xtype], MODx.Window) // Расширяем MODX.Window
Ext.reg(extraExt.grid.editor.xtype, extraExt.xTypes[extraExt.grid.editor.xtype]) // Регистрируем новый xtype
//# sourceMappingURL=editor.js.map

//# sourceMappingURL=editor.js.map
