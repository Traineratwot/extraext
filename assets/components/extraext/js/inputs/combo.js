//регистрируем кастомный способ отправки
extraExt.inputs.Submit = function(b, a) {extraExt.inputs.Submit.superclass.constructor.call(this, b, a)}
Ext.extend(extraExt.inputs.Submit, Ext.form.Action.Submit, {
	type: 'submit', run: function() {
		var e = this.options, g = this.getMethod(), d = g == 'GET'
		if(e.clientValidation === false || this.form.isValid()) {
			if(e.submitEmptyText === false) {
				var a = this.form.items, c = [], b = function(h) {
					if(h.el.getValue() == h.emptyText) {
						c.push(h)
						h.el.dom.value = ''
					}
					if(h.isComposite && h.rendered) {h.items.each(b)}
				}
				a.each(b)
			}
			
			var params = this.form.baseParams
			params.data = Ext.util.JSON.encode(this.form.getValues())
			Ext.Ajax.request(Ext.apply(this.createCallback(e), {
				params: params,
				url: this.getUrl(d),
				method: g,
				headers: e.headers,
				isUpload: this.form.fileUpload
			}))
			if(e.submitEmptyText === false) {Ext.each(c, function(h) {if(h.applyEmptyText) {h.applyEmptyText()}})}
		} else {
			if(e.clientValidation !== false) {
				this.failureType = Ext.form.Action.CLIENT_INVALID
				this.form.afterAction(this, false)
			}
		}
	}
})
//modCombo
extraExt.requireConfigField[extraExt.inputs.modCombo.xtype] = [
	'action',
	'displayField',
	'valueField',
	'fields',
	'url',
]
extraExt.create(
	extraExt.inputs.modCombo.xtype,
	function(config) {
		config = config || {}
		var requireConfigField = extraExt.requireConfigField[this.xtype || config.xtype].slice()
		var errorConfig = []
		this.ident = config.ident || 'mecnewsletter' + Ext.id()
		Ext.applyIf(config, {
			url: MODx.config.connector_url,
			anchor: '99%',
			editable: true,
			pageSize: 20,
			mode: 'remote',
			fields: ['id'],
			hiddenName: config.name,
			displayField: 'id',
			valueField: 'id',
			preventRender: true,
			forceSelection: true,
			enableKeyEvents: true,
		})
		config.baseParams = Object.assign({
			action: config.action
		}, config.baseParams)
		
		config.store = new Ext.data.JsonStore({
			id: (config.name || Ext.id()) + '-store'
			, root: 'results'
			, autoLoad: true
			, autoSave: false
			, totalProperty: 'total'
			, fields: config.fields
			, url: config.url
			, baseParams: config.baseParams
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
			console.error(`ExtraExt: invalid require config [${this.xtype || config.xtype}]`, errorConfig)
			return false
		}
		extraExt.xTypes[extraExt.inputs.modCombo.xtype].superclass.constructor.call(this, config) // Магия
	},
	MODx.combo.ComboBox
)
//modComboSuper
extraExt.requireConfigField[extraExt.inputs.modComboSuper.xtype] = [
	'action',
	'displayField',
	'valueField',
	'fields',
	'url',
]
extraExt.create(
	extraExt.inputs.modComboSuper.xtype,
	function(config) {
		var requireConfigField = extraExt.requireConfigField[extraExt.inputs.modComboSuper.xtype].slice()
		var errorConfig = []
		config = config || {}
		Ext.applyIf(config, {
			xtype: 'superboxselect'
			, allowBlank: true
			, url: MODx.config.connector_url
			, msgTarget: 'under'
			, allowAddNewData: true
			, addNewDataOnBlur: true
			, width: '100%'
			, editable: true
			, pageSize: 20
			, preventRender: true
			, forceSelection: true
			, enableKeyEvents: true
			, minChars: 2
			, hiddenName: config.name + '[]'
			, mode: 'remote'
			, displayField: 'id'
			, valueField: 'id'
			, triggerAction: 'all'
			, extraItemCls: 'x-tag'
			, expandBtnCls: 'x-form-trigger'
			, clearBtnCls: 'x-form-trigger'
			, listeners: {
				newitem: function(config, v, f) {bs.addItem({tag: v})}
			}
			, renderTo: Ext.getBody()
		})
		if(!config.hasOwnProperty('id') || !config.id) {
			config.id = Ext.id()
		}
		config.baseParams = Object.assign({
			action: config.action
		}, config.baseParams)
		config.store = new Ext.data.JsonStore({
			id: (config.name || Ext.id()) + '-store'
			, root: 'results'
			, autoLoad: true
			, autoSave: false
			, totalProperty: 'total'
			, fields: config.fields
			, url: config.url
			, baseParams: config.baseParams
		})
		if(config.hasOwnProperty('table') && config.table.hasOwnProperty('requestDataType')) {
			config.requestDataType = config.table.requestDataType
		}
		
		if(config.hasOwnProperty('requestDataType') && config.requestDataType == 'json') {
			config.hiddenName = config.name
		} else {
			config.hiddenName = config.name + '[]'
		}
		extraExt.xTypes[extraExt.inputs.modComboSuper.xtype].superclass.constructor.call(this, config)
	},
	Ext.ux.form.SuperBoxSelect,
	[{}]
)

extraExt.create(
	extraExt.inputs.search.xtype,
	function(config) {
		config = config || {}
		Ext.applyIf(config, {
			xtype: 'twintrigger',
			ctCls: 'x-field-search',
			allowBlank: true,
			msgTarget: 'under',
			emptyText: _('search'),
			name: 'query',
			triggerAction: 'all',
			clearBtnCls: 'x-field-search-clear',
			searchBtnCls: 'x-field-search-go',
			onTrigger1Click: this._triggerSearch,
			onTrigger2Click: this._triggerClear,
		})
		extraExt.xTypes[extraExt.inputs.search.xtype].superclass.constructor.call(this, config)
		this.on('render', function() {
			this.getEl().addKeyListener(Ext.EventObject.ENTER, function() {
				this._triggerSearch()
			}, this)
		})
		this.addEvents('clear', 'search')
	},
	Ext.form.TwinTriggerField,
	[
		{
			initComponent: function() {
				Ext.form.TwinTriggerField.superclass.initComponent.call(this)
				this.triggerConfig = {
					tag: 'span',
					cls: 'x-field-search-btns',
					cn: [
						{tag: 'div', cls: 'x-form-trigger ' + this.searchBtnCls},
						{tag: 'div', cls: 'x-form-trigger ' + this.clearBtnCls}
					]
				}
			},
			_triggerSearch: function() {
				this.fireEvent('search', this)
			},
			_triggerClear: function() {
				this.fireEvent('clear', this)
			},
		}
	]
)

//popup
extraExt.inputs.popup = {}
extraExt.inputs.popup.xtype = 'extraExt-popup'
extraExt.create(
	extraExt.inputs.popup.xtype,
	function(config) {
		Ext.applyIf(config, {
			fields: [],
			id: Ext.id(),
			prepare: function(data) {return data},
			dePrepare: function(data) {return data},
		})
		this.valuePrepare = function(a) {
			try {
				if(a instanceof Array || typeof a === 'object') {
					return JSON.stringify(a)
				}
				return a
			} catch(e) {
				return a
			}
		}
		config.value = this.valuePrepare(config.value)
		extraExt.xTypes[extraExt.inputs.search.xtype].superclass.constructor.call(this, config)
		this.fieldsPrepare()
		
	},
	Ext.form.TriggerField,
	[
		{
			
			fieldsPrepare: function() {
				for(const fieldsKey in this.fields) {
					var field = this.fields[fieldsKey]
					Ext.applyIf(this.fields[fieldsKey], {
						fieldLabel: field.name,
						anchor: '99%',
					})
					Ext.apply(this.fields[fieldsKey], {
						requestDataType: 'json',
					})
					this.fields[fieldsKey].requestDataType = 'json'
				}
				return this.fields || []
			},
			triggerClass: 'far fa-edit',
			onTriggerClick: function(btn) {
				return !this.disabled && (this.browser = MODx.load({
					xtype: extraExt.popupWindow.xtype,
					width: window.innerWidth / 100 * 50,
					height: window.innerHeight / 100 * 50,
					fields: this.fields || [],
					returnCmpId: this.id,
					prepare: this.prepare,
					dePrepare: this.dePrepare,
					closeAction: 'close',
					id: Ext.id(),
					listeners: {
						select: {
							fn: function(data) {
								this.setValue(data.relativeUrl),
									this.fireEvent('select', data)
							},
							scope: this
						}
					}
				}),
					this.browser.show(btn),
					!0)
			},
			onDestroy: function() {
				extraExt.xTypes[extraExt.inputs.popup.xtype].superclass.onDestroy.call(this)
			},
		}
	]
)
extraExt.inputs.infinity = {}
extraExt.inputs.infinity.xtype = 'extraExt-infinity'
extraExt.create(
	extraExt.inputs.infinity.xtype,
	function(config) {
		Ext.applyIf(config, {
			field: {xtype: 'textfield'},
			id: Ext.id(),
			prepare: function(data) {return data},
			dePrepare: function(data) {return data},
		})
		extraExt.xTypes[extraExt.inputs.search.xtype].superclass.constructor.call(this, config)
		this.fieldPrepare()
	},
	Ext.form.TriggerField,
	[
		{
			field: {xtype: 'textfield', name: 'infinity'},
			fields: [],
			fieldPrepare: function() {
				Ext.applyIf(this.field, {
					fieldLabel: null,
					anchor: '99%',
				})
				this.field.requestDataType = 'json'
				this.fields = []
				try {
					var value = JSON.parse(this.getValue())
					var i = 1
					for(const valueKey in value) {
						if(value.hasOwnProperty(valueKey)) {
							var field = Object.assign({}, this.field)
							field.value = value[valueKey]
							field.name = this.name + `-${i}`
							field.fieldLabel = `<sub>${i}</sub>`
							this.fields.push(field)
							i++
						}
					}
				} catch(e) {
					this.setValue('')
				}
				
				return this.field || []
			},
			triggerClass: 'far fa-pen-square',
			onTriggerClick: function(btn) {
				return !this.disabled && (this.browser = MODx.load({
					xtype: extraExt.infinityWindow.xtype,
					width: window.innerWidth / 100 * 50,
					height: window.innerHeight / 100 * 50,
					field: this.field || {xtype: 'textfield', name: 'infinity'},
					fields: this.fields || [],
					returnCmpId: this.id,
					returnCmp: this,
					prepare: this.prepare,
					dePrepare: this.dePrepare,
					closeAction: 'close',
					id: Ext.id(),
					listeners: {
						select: {
							fn: function(data) {
								this.setValue(data.relativeUrl),
									this.fireEvent('select', data)
							},
							scope: this
						}
					}
				}),
					this.browser.show(btn),
					!0)
			},
			onDestroy: function() {
				extraExt.xTypes[extraExt.inputs.infinity.xtype].superclass.onDestroy.call(this)
			}
		}
	]
)

extraExt.create(
	extraExt.inputs.date.xtype,
	function(config) {
		config = config || {}
		Ext.applyIf(config, {})
		extraExt.xTypes[extraExt.inputs.date.xtype].superclass.constructor.call(this, config)
	},
	Ext.form.DateField,
	[
		{
			onTriggerClick: function() {
				Ext.form.DateField.prototype.onTriggerClick.apply(this, arguments)
				if(!this.hasOwnProperty('btnClear')) {
					var self = this
					this.btnClear = new Ext.Button({
						text: _('reset'),
						listeners: {
							click: function() {
								self.reset()
								self.menu.hide()
								self.fireEvent('select')
							}
						}
						
					})
					this.btnClear.render(this.menu.picker.todayBtn.container)
				}
			}
		}
	]
)

