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
		if(config.hasOwnProperty('table') && config.table.hasOwnProperty('requestDataType') && config.table.requestDataType == 'json') {
			config.hiddenName = config.name
		} else {
			config.hiddenName = config.name + '[]'
		}
		extraExt.xTypes[extraExt.inputs.modComboSuper.xtype].superclass.constructor.call(this, config)
	},
	Ext.ux.form.SuperBoxSelect
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
// extraExt.inputs.popup = {}
// extraExt.inputs.popup.xtype = 'extraExt-popup'
// extraExt.xTypes[extraExt.inputs.popup.xtype] = Ext.extend(Ext.form.Field, {
// 	grow: false,
// 	growMin: 30,
// 	growMax: 800,
// 	vtype: null,
// 	maskRe: null,
// 	disableKeyFilter: false,
// 	allowBlank: true,
// 	minLength: 0,
// 	maxLength: Number.MAX_VALUE,
// 	minLengthText: 'The minimum length for this field is {0}',
// 	maxLengthText: 'The maximum length for this field is {0}',
// 	selectOnFocus: false,
// 	blankText: 'This field is required',
// 	validator: null,
// 	regex: null,
// 	regexText: '',
// 	emptyText: null,
// 	emptyClass: 'x-form-empty-field',
// 	initComponent: function() {
//
// 		Ext.form.TextField.superclass.initComponent.call(this)
// 		this.addEvents('autosize', 'keydown', 'keyup', 'keypress')
// 	},
// 	initEvents: function() {
// 		Ext.form.TextField.superclass.initEvents.call(this)
// 		// if(this.validationEvent == 'keyup') {
// 		// 	this.validationTask = new Ext.util.DelayedTask(this.validate, this)
// 		// 	this.mon(this.el, 'keyup', this.filterValidation, this)
// 		// } else {if(this.validationEvent !== false && this.validationEvent != 'blur') {this.mon(this.el, this.validationEvent, this.validate, this, {buffer: this.validationDelay})}}
// 		// if(this.selectOnFocus || this.emptyText) {
// 		// 	this.mon(this.el, 'mousedown', this.onMouseDown, this)
// 		// 	if(this.emptyText) {this.applyEmptyText()}
// 		// }
// 		// if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype + 'Mask']))) {this.mon(this.el, 'keypress', this.filterKeys, this)}
// 		// if(this.grow) {
// 		// 	this.mon(this.el, 'keyup', this.onKeyUpBuffered, this, {buffer: 50})
// 		// 	this.mon(this.el, 'click', this.autoSize, this)
// 		// }
// 		// if(this.enableKeyEvents) {
// 		// 	this.mon(this.el, {
// 		// 		scope: this,
// 		// 		keyup: this.onKeyUp,
// 		// 		keydown: this.onKeyDown,
// 		// 		keypress: this.onKeyPress
// 		// 	})
// 		// }
// 	},
// 	onMouseDown: function(a) {
//
// 		if(!this.hasFocus) {
// 			this.mon(this.el, 'mouseup', Ext.emptyFn, this, {
// 				single: true,
// 				preventDefault: true
// 			})
// 		}
// 	},
// 	processValue: function(a) {
//
// 		if(this.stripCharsRe) {
// 			var b = a.replace(this.stripCharsRe, '')
// 			if(b !== a) {
// 				this.setRawValue(b)
// 				return b
// 			}
// 		}
// 		return a
// 	},
// 	filterValidation: function(a) {
//
// 		if(!a.isNavKeyPress()) {this.validationTask.delay(this.validationDelay)}
// 	},
// 	onDisable: function() {
//
// 		Ext.form.TextField.superclass.onDisable.call(this)
// 		if(Ext.isIE) {this.el.dom.unselectable = 'on'}
// 	},
// 	onEnable: function() {
//
// 		Ext.form.TextField.superclass.onEnable.call(this)
// 		if(Ext.isIE) {this.el.dom.unselectable = ''}
// 	},
// 	onKeyUpBuffered: function(a) {
//
// 		if(this.doAutoSize(a)) {this.autoSize()}
// 	},
// 	doAutoSize: function(a) {
//
// 		return !a.isNavKeyPress()
// 	},
// 	onKeyUp: function(a) {
//
// 		this.fireEvent('keyup', this, a)
// 	},
// 	onKeyDown: function(a) {
//
// 		this.fireEvent('keydown', this, a)
// 	},
// 	onKeyPress: function(a) {
//
// 		this.fireEvent('keypress', this, a)
// 	},
// 	reset: function() {
//
// 		Ext.form.TextField.superclass.reset.call(this)
// 		this.applyEmptyText()
// 	},
// 	applyEmptyText: function() {
//
// 		if(this.rendered && this.emptyText && this.getRawValue().length < 1 && !this.hasFocus) {
// 			this.setRawValue(this.emptyText)
// 			this.el.addClass(this.emptyClass)
// 		}
// 	},
// 	preFocus: function() {
// 		console.info('preFocus', this)
// 		var a = this.el, b
// 		if(this.emptyText) {
// 			if(a.dom.value == this.emptyText) {
// 				this.setRawValue('')
// 				b = true
// 			}
// 			a.removeClass(this.emptyClass)
// 		}
// 	},
// 	postBlur: function() {
// 		console.info('postBlur', this)
// 		this.applyEmptyText()
// 	},
// 	filterKeys: function(b) {
//
// 		if(b.ctrlKey) {return}
// 		var a = b.getKey()
// 		if(Ext.isGecko && (b.isNavKeyPress() || a == b.BACKSPACE || (a == b.DELETE && b.button == -1))) {return}
// 		var c = String.fromCharCode(b.getCharCode())
// 		if(!Ext.isGecko && b.isSpecialKey() && !c) {return}
// 		if(!this.maskRe.test(c)) {b.stopEvent()}
// 	},
// 	setValue: function(a) {
//
// 		if(this.emptyText && this.el && !Ext.isEmpty(a)) {this.el.removeClass(this.emptyClass)}
// 		Ext.form.TextField.superclass.setValue.apply(this, arguments)
// 		this.applyEmptyText()
// 		this.autoSize()
// 		return this
// 	},
// 	getErrors: function(a) {
//
// 		var d = Ext.form.TextField.superclass.getErrors.apply(this, arguments)
// 		a = Ext.isDefined(a) ? a : this.processValue(this.getRawValue())
// 		if(Ext.isFunction(this.validator)) {
// 			var c = this.validator(a)
// 			if(c !== true) {d.push(c)}
// 		}
// 		if(a.length < 1 || a === this.emptyText) {if(this.allowBlank) {return d} else {d.push(this.blankText)}}
// 		if(!this.allowBlank && (a.length < 1 || a === this.emptyText)) {d.push(this.blankText)}
// 		if(a.length < this.minLength) {d.push(String.format(this.minLengthText, this.minLength))}
// 		if(a.length > this.maxLength) {d.push(String.format(this.maxLengthText, this.maxLength))}
// 		if(this.vtype) {
// 			var b = Ext.form.VTypes
// 			if(!b[this.vtype](a, this)) {d.push(this.vtypeText || b[this.vtype + 'Text'])}
// 		}
// 		if(this.regex && !this.regex.test(a)) {d.push(this.regexText)}
// 		return d
// 	},
// 	selectText: function(h, a) {
//
// 		var c = this.getRawValue()
// 		var e = false
// 		if(c.length > 0) {
// 			h = h === undefined ? 0 : h
// 			a = a === undefined ? c.length : a
// 			var g = this.el.dom
// 			if(g.setSelectionRange) {g.setSelectionRange(h, a)} else {
// 				if(g.createTextRange) {
// 					var b = g.createTextRange()
// 					b.moveStart('character', h)
// 					b.moveEnd('character', a - c.length)
// 					b.select()
// 				}
// 			}
// 			e = Ext.isGecko || Ext.isOpera
// 		} else {e = true}
// 		if(e) {this.focus()}
// 	},
// 	autoSize: function() {
//
// 		if(!this.grow || !this.rendered) {return}
// 		if(!this.metrics) {this.metrics = Ext.util.TextMetrics.createInstance(this.el)}
// 		var c = this.el
// 		var b = c.dom.value
// 		var e = document.createElement('div')
// 		e.appendChild(document.createTextNode(b))
// 		b = e.innerHTML
// 		Ext.removeNode(e)
// 		e = null
// 		b += '&#160;'
// 		var a = Math.min(this.growMax, Math.max(this.metrics.getWidth(b) + 10, this.growMin))
// 		this.el.setWidth(a)
// 		this.fireEvent('autosize', this, a)
// 	},
// 	onDestroy: function() {
//
// 		if(this.validationTask) {
// 			this.validationTask.cancel()
// 			this.validationTask = null
// 		}
// 		Ext.form.TextField.superclass.onDestroy.call(this)
// 	}
// })
// Ext.reg(extraExt.inputs.popup.xtype, extraExt.xTypes[extraExt.inputs.popup.xtype])






