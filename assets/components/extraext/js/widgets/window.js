extraExt.requireConfigField[extraExt.window.xtype] = [
	'action',
	'url',
	'fields',
]
extraExt.create(
	extraExt.window.xtype,
	function(config) {
		config = config || {}
		var requireConfigField = extraExt.requireConfigField[extraExt.window.xtype].slice()
		var errorConfig = []
		var warnConfig = []
		Object.assign({}, config)
		Ext.applyIf(config, {
			closeAction: 'close',
			requestDataType: 'form',
			saveBtnText: _('extraExt.save'),
			width: (window.innerWidth / 100) * 50,
		})
		this.listeners = {
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
		for(const key of requireConfigField) {
			try {
				if(config.hasOwnProperty(key)) {
					if(!extraExt.empty(config[key])) {
						throw false
					}
				}
				if(this.hasOwnProperty(key)) {
					if(!extraExt.empty(this[key])) {
						throw false
					}
				}
				throw true
			} catch(e) {
				if(e) {
					errorConfig.push(key)
				}
			}
		}
		if(errorConfig.length > 0) {
			console.error(`ExtraExt: invalid required config [${this.xtype || config.xtype}]`, errorConfig)
			return false
		}
		extraExt.xTypes[extraExt.window.xtype].superclass.constructor.call(this, config) // Магия
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

	},
	MODx.Window
)
extraExt.create(
	extraExt.popupWindow.xtype,
	function(config) {
		config = config || {}
		btns = []
		if(config.fields.length > 0) {
			btns.push({
				text: config.saveBtnText || _('edit') + ' <i class="fad fa-edit"></i>',
				scope: this,
				handler: this.proEditSwitch
			})
		}
		btns.push({
			text: config.cancelBtnText || _('cancel') + ' <i class="fas fa-times-square"></i>',
			scope: this,
			handler: function() {
				'close' !== config.closeAction ? this.hide() : this.close()
			}
		})
		btns.push({
			text: config.saveBtnText || _('save') + ' <i class="fas fa-save"></i>',
			cls: 'primary-button',
			scope: this,
			handler: this.submit
		})
		Ext.applyIf(config, {
			modal: !1,
			layout: 'auto',
			closeAction: 'close',
			shadow: !0,
			fields: [],
			resizable: !0,
			collapsible: !0,
			maximizable: !0,
			autoHeight: !1,
			autoScroll: !0,
			allowDrop: !0,
			width: 400,
			constrain: !0,
			constrainHeader: !0,
			cls: 'modx-window',
			buttons: btns,
			record: {},
			keys: [{
				key: Ext.EventObject.ENTER,
				fn: function(keyCode, event) {
					var elem = event.getTarget()
						, component = Ext.getCmp(elem.id)
					if(component instanceof Ext.form.TextArea)
						return component.append('\n')
					this.submit()
				},
				scope: this
			}],
			prepare: function(data) {return data},
			dePrepare: function(data) {return data},
		})
		if(Ext.getCmp(config.returnCmpId)) {
			config.returnCmp = Ext.getCmp(config.returnCmpId)
			Ext.applyIf(config, {
				title: config.returnCmp.fieldLabel || config.returnCmp.name || ''
			})
		}
		extraExt.xTypes[extraExt.popupWindow.xtype].superclass.constructor.call(this, config),
			this.options = config,
			this.config = config,
			this.addEvents({
				success: !0,
				failure: !0,
				beforeSubmit: !0
			}),
			this._loadForm(),
			this.on('show', function() {
				this.config.blankValues && this.fp.getForm().reset(),
				this.config.allowDrop && this.loadDropZones(),
					this.syncSize(),
					this.focusFirstField()
			}, this),
			this.on('afterrender', function() {
				this.originalHeight = this.el.getHeight(),
					this.toolsHeight = this.originalHeight - this.body.getHeight() + 50,
					this.resizeWindow()
			}),
			Ext.EventManager.onWindowResize(this.resizeWindow, this)
	},
	Ext.Window,
	[{
		rawValue: {},
		proEdit: false,
		proEditSwitch: function() {
			if(this.proEdit == false) {
				this.proEdit = true
			} else {
				this.proEdit = false
			}
			if(this.proEdit) {
				this.proFp.show()
				this.fp.hide()
			} else {
				this.fp.show()
				this.proFp.hide()
			}
		},
		_loadForm: function() {
			if(!this.returnCmpId) {
				if(devMode) {
					console.warn('not found returnCmpId')
				}
			}
			if(this.checkIfLoaded(this.config.record || null))
				return !1
			var r = this.config.record
			if(this.config.fields)
				for(var l = this.config.fields.length, i = 0; i < l; i++) {
					var f = this.config.fields[i]
					r[f.name] && ('checkbox' == f.xtype || 'radio' == f.xtype ? f.checked = r[f.name] : f.value = r[f.name])
				}
			this.fp = this.createForm({
				url: this.config.url,
				baseParams: this.config.baseParams || {
					action: this.config.action || ''
				},
				items: this.config.fields || []
			})
			var w = this
			var proValue = ''
			try {
				proValue = this.returnCmp.rawValue || this.returnCmp.getValue() || null
				proValue = extraExt.util.renderer.jsonBeautify(proValue)
			} catch(e) {
				proValue = ''
			}
			this.fp.getForm().items.each(function(f) {
				f.on('invalid', function() {
					w.doLayout()
				})
			}),
				this.proFp = this.createForm({
					url: this.config.url,
					baseParams: this.config.baseParams || {
						action: this.config.action || ''
					},
					items: [
						{
							xtype: 'modx-texteditor',
							anchor: '99%',
							height: this.height / 1.85,
							resizable: true,
							mimeType: 'application/json',
							name: 'proEdit-' + this.returnCmpId,
							fieldLabel: _('edit'),
							value: proValue || '',
							modxTags: true,
							enableKeyEvents: true,
						}
					]
				})
			this.proFp.getForm().items.each(function(f) {
				f.on('invalid', function() {
					w.doLayout()
				})
			})
			this.renderForm()
			var values = this.returnCmp.rawValue
			if(values) {
				try {
					this.fp.getForm().setValues(values)
				} catch(e) {
					if(devMode) {
						console.warn(e)
					}
				}
			} else {
				try {
					var values = JSON.parse(this.returnCmp.getValue() || null)
					if(values) {
						if(this.dePrepare && this.dePrepare instanceof Function) {
							try {
								var _v = this.dePrepare(values)
								if(_v) {
									values = _v
								}
							} catch(e) {
								if(devMode) {
									console.warn(e)
								}
							}
						}
						this.fp.getForm().setValues(values)
					}
				} catch(e) {
					if(devMode) {
						console.warn(e)
					}
				}
			}
		},
		focusFirstField: function() {
			if(this.fp && this.fp.getForm() && 0 < this.fp.getForm().items.getCount()) {
				var fld = this.findFirstTextField()
				fld && fld.focus(!1, 200)
			}
		},
		findFirstTextField: function(i) {
			i = i || 0
			var fld = this.fp.getForm().items.itemAt(i)
			return !!fld && ((fld.isXType('combo') || fld.isXType('checkbox') || fld.isXType('radio') || fld.isXType('displayfield') || fld.isXType('statictextfield') || fld.isXType('hidden')) && (i += 1,
				fld = this.findFirstTextField(i)),
				fld)
		},
		submit: function(close) {
			close = !1 !== close

			if(this.proEdit) {
				var value = this.proFp.getForm().getValues()['proEdit-' + this.returnCmpId]
				try {
					objValue = JSON.parse(value)
					jsonValue = extraExt.util.renderer.jsonMinify(objValue)
				} catch(e) {
					jsonValue = ''
					objValue = {}
				}
				this.returnCmp.rawValue = objValue
				this.returnCmp.setValue(jsonValue)
			} else {
				var values = this.fp.getForm().getValues()
				this.returnCmp.rawValue = values
				if(this.prepare && this.prepare instanceof Function) {
					try {
						var _v = this.prepare(values)
						if(_v) {
							values = _v
						}
					} catch(e) {
						if(devMode) {
							console.warn(e)
						}
					}

				}
				this.returnCmp.setValue(JSON.stringify(values))
			}
			this.close()
		},
		createForm: function(config) {
			return Ext.applyIf(this.config, {
				formFrame: !0,
				border: !1,
				bodyBorder: !1,
				autoHeight: !0
			}),
				config = config || {},
				Ext.applyIf(config, {
					labelAlign: this.config.labelAlign || 'top',
					labelWidth: this.config.labelWidth || 100,
					labelSeparator: this.config.labelSeparator || '',
					frame: this.config.formFrame,
					border: this.config.border,
					bodyBorder: this.config.bodyBorder,
					autoHeight: this.config.autoHeight,
					anchor: '100% 100%',
					errorReader: MODx.util.JSONReader,
					defaults: this.config.formDefaults || {
						msgTarget: this.config.msgTarget || 'under'
					},
					url: this.config.url,
					baseParams: this.config.baseParams || {},
					fileUpload: this.config.fileUpload || !1
				}),
				new Ext.FormPanel(config)
		},
		renderForm: function() {
			this.proFp.on('destroy', function() {
				Ext.EventManager.removeResizeListener(this.resizeWindow, this)
			}, this),
				this.add(this.proFp)

			this.fp.on('destroy', function() {
				Ext.EventManager.removeResizeListener(this.resizeWindow, this)
			}, this),
				this.add(this.fp)
			if(this.config.fields.length > 0) {
				this.proFp.hide()
			} else {
				this.proEditSwitch()
			}
		},
		checkIfLoaded: function(r) {
			return r = r || {},
			!(!this.fp || !this.fp.getForm()) && (this.fp.getForm().reset(),
				this.fp.getForm().setValues(r),
				!0)
		},
		setValues: function(r) {
			if(null === r)
				return !1
			this.fp.getForm().setValues(r)
		},
		reset: function() {
			this.fp.getForm().reset()
		},
		hideField: function(f) {
			f.disable(),
				f.hide()
			var d = f.getEl().up('.x-form-item')
			d && d.setDisplayed(!1)
		},
		showField: function(f) {
			f.enable(),
				f.show()
			var d = f.getEl().up('.x-form-item')
			d && d.setDisplayed(!0)
		},
		loadDropZones: function() {
			if(this._dzLoaded)
				return !1
			this.fp.getForm().items.each(function(fld) {
				fld.isFormField && (fld.isXType('textfield') || fld.isXType('textarea')) && !fld.isXType('combo') && new MODx.load({
					xtype: 'modx-treedrop',
					target: fld,
					targetEl: fld.getEl().dom
				})
			}),
				this._dzLoaded = !0
		},
		resizeWindow: function() {
			var viewHeight = Ext.getBody().getViewSize().height
				, el = this.fp.getForm().el
			viewHeight < this.originalHeight ? (el.setStyle('overflow-y', 'scroll'),
				el.setHeight(viewHeight - this.toolsHeight)) : (el.setStyle('overflow-y', 'auto'),
				el.setHeight('auto'))
		}
	}]
)
extraExt.create(
	extraExt.infinityWindow.xtype,
	function(config) {
		config = config || {}
		btns = []
		btns.push({
			text: config.addBtnText || _('extraExt.add') + '<i class="fas fa-plus"></i>',
			cls: 'info-button',
			scope: this,
			handler: this.addNewField
		})
		if(config.fields.length > 0) {
			btns.push({
				text: config.saveBtnText || _('edit') + ' <i class="fad fa-edit"></i>',
				scope: this,
				handler: this.proEditSwitch
			})
		}
		btns.push({
			text: config.cancelBtnText || _('cancel') + ' <i class="fas fa-times-square"></i>',
			scope: this,
			handler: function() {
				'close' !== config.closeAction ? this.hide() : this.close()
			}
		})
		btns.push({
			text: config.saveBtnText || _('save') + ' <i class="fas fa-save"></i>',
			cls: 'primary-button',
			scope: this,
			handler: this.submit
		})

		Ext.applyIf(config, {
			modal: !1,
			layout: 'auto',
			closeAction: 'hide',
			shadow: !0,
			fields: [],
			resizable: !0,
			collapsible: !0,
			maximizable: !0,
			autoHeight: !1,
			autoScroll: !0,
			allowDrop: !0,
			width: 400,
			constrain: !0,
			constrainHeader: !0,
			cls: 'modx-window',
			buttons: btns,
			record: {},
			keys: [{
				key: Ext.EventObject.ENTER,
				fn: function(keyCode, event) {
					var elem = event.getTarget()
						, component = Ext.getCmp(elem.id)
					if(component instanceof Ext.form.TextArea)
						return component.append('\n')
					this.submit()
				},
				scope: this
			}],
			prepare: function(data) {return data},
			dePrepare: function(data) {return data},
		})
		if(Ext.getCmp(config.returnCmpId)) {
			config.returnCmp = Ext.getCmp(config.returnCmpId)
			Ext.applyIf(config, {
				title: config.returnCmp.fieldLabel || config.returnCmp.name || ''
			})
		}
		extraExt.xTypes[extraExt.popupWindow.xtype].superclass.constructor.call(this, config),
			this.options = config,
			this.config = config,
			this.addEvents({
				success: !0,
				failure: !0,
				beforeSubmit: !0
			}),
			this._loadForm(),
			this.on('show', function() {
				this.config.blankValues && this.fp.getForm().reset(),
				this.config.allowDrop && this.loadDropZones(),
					this.syncSize(),
					this.focusFirstField()
			}, this),
			this.on('afterrender', function() {
				this.originalHeight = this.el.getHeight(),
					this.toolsHeight = this.originalHeight - this.body.getHeight() + 50,
					this.resizeWindow()
			}),
			Ext.EventManager.onWindowResize(this.resizeWindow, this)
	},
	Ext.Window,
	[{
		rawValue: {},
		proEdit: false,
		proEditSwitch: function() {
			if(this.proEdit == false) {
				this.proEdit = true
			} else {
				this.proEdit = false
			}
			if(this.proEdit) {
				this.proFp.show()
				this.fp.hide()
			} else {
				this.fp.show()
				this.proFp.hide()
			}
		},
		_loadForm: function() {
			if(!this.returnCmpId) {
				if(devMode) {
					console.warn('not found returnCmpId')
				}
			}
			if(this.checkIfLoaded(this.config.record || null)) {
				return !1
			}
			var r = this.config.record
			if(this.config.fields) {
				for(var l = this.config.fields.length, i = 0; i < l; i++) {
					var f = this.config.fields[i]
					r[f.name] && ('checkbox' == f.xtype || 'radio' == f.xtype ? f.checked = r[f.name] : f.value = r[f.name])
				}
			}
			this.fp = this.createForm({
				url: this.config.url,
				baseParams: this.config.baseParams || {
					action: this.config.action || ''
				},
				items: this.fieldsPrepare() || []
			})
			var w = this
			var proValue = ''
			try {
				proValue = this.returnCmp.rawValue || this.returnCmp.getValue() || null
				proValue = extraExt.util.renderer.jsonBeautify(proValue)
			} catch(e) {
				proValue = ''
			}
			this.fp.getForm().items.each(function(f) {
				f.on('invalid', function() {
					w.doLayout()
				})
			})
			this.proFp = this.createForm({
				url: this.config.url,
				baseParams: this.config.baseParams || {
					action: this.config.action || ''
				},
				items: [
					{
						xtype: 'modx-texteditor',
						anchor: '99%',
						height: this.height / 1.85,
						resizable: true,
						mimeType: 'application/json',
						name: 'proEdit-' + this.returnCmpId,
						fieldLabel: _('edit'),
						value: proValue || '',
						modxTags: true,
						//enableKeyEvents: true,
					}
				]
			})
			this.proFp.getForm().items.each(function(f) {
				f.on('invalid', function() {
					w.doLayout()
				})
			})
			this.renderForm()
		},
		fieldsPrepare: function() {
			Ext.applyIf(this.returnCmp.field, {
				fieldLabel: null,
				anchor: '99%',
			})
			this.fieldCounter = 0
			this.returnCmp.field.requestDataType = 'json'
			var fields = []
			try {
				var value = JSON.parse(this.returnCmp.getValue())
				for(const valueKey in value) {
					if(value.hasOwnProperty(valueKey)) {
						this.fieldCounter++
						var field = Object.assign({}, this.returnCmp.field)
						field.value = value[valueKey]
						field.requestDataType = 'json'
						field.name = this.returnCmp.name + `-${this.fieldCounter}`
						field.id = this.returnCmp.id + `-${this.fieldCounter}`
						field.fieldLabel = `<sub>${this.fieldCounter}</sub>`
						fields.push(field)
					}
				}

			} catch(e) {
				this.returnCmp.setValue('')
			}
			if(this.fieldCounter == 0){
				this.fieldCounter++
				var field = Object.assign({}, this.returnCmp.field)
				field.value = ''
				field.requestDataType = 'json'
				field.name = this.returnCmp.name + `-${this.fieldCounter}`
				field.id = this.returnCmp.id + `-${this.fieldCounter}`
				field.fieldLabel = `<sub>${this.fieldCounter}</sub>`
				fields.push(field)
			}
			return fields || []
		},
		addNewField: function() {
			this.fieldCounter++
			var field = Object.assign({}, this.returnCmp.field)
			field.value = ''
			field.requestDataType = 'json'
			field.name = this.returnCmp.name + `-${this.fieldCounter}`
			field.id = this.returnCmp.id + `-${this.fieldCounter}`
			field.fieldLabel = `<sub>${this.fieldCounter}</sub>`
			this.fp.add(field)
			this.fp.doLayout()
		},
		focusFirstField: function() {
			if(this.fp && this.fp.getForm() && 0 < this.fp.getForm().items.getCount()) {
				var fld = this.findFirstTextField()
				fld && fld.focus(!1, 200)
			}
		},
		findFirstTextField: function(i) {
			i = i || 0
			var fld = this.fp.getForm().items.itemAt(i)
			return !!fld && ((fld.isXType('combo') || fld.isXType('checkbox') || fld.isXType('radio') || fld.isXType('displayfield') || fld.isXType('statictextfield') || fld.isXType('hidden')) && (i += 1,
				fld = this.findFirstTextField(i)),
				fld)
		},
		submit: function(close) {
			close = !1 !== close
			if(this.proEdit) {
				var value = this.proFp.getForm().getValues()['proEdit-' + this.returnCmpId]
				try {
					objValue = JSON.parse(value)
					jsonValue = extraExt.util.renderer.jsonMinify(objValue)
				} catch(e) {
					jsonValue = ''
					objValue = {}
				}
				this.returnCmp.rawValue = objValue
				this.returnCmp.setValue(jsonValue)
			} else {
				var values = this.fp.getForm().getValues()

				var outValue = []
				for(const valuesKey in values) {
					try {
						outValue.push(JSON.parse(values[valuesKey]))
					}catch(e) {
						outValue.push(values[valuesKey])
					}
				}
				this.returnCmp.rawValue = outValue
				this.returnCmp.setValue(JSON.stringify(outValue))
			}
			this.close()
		},
		createForm: function(config) {
			return Ext.applyIf(this.config, {
				formFrame: !0,
				border: !1,
				bodyBorder: !1,
				autoHeight: !0
			}),
				config = config || {},
				Ext.applyIf(config, {
					labelAlign: this.config.labelAlign || 'top',
					labelWidth: this.config.labelWidth || 100,
					labelSeparator: this.config.labelSeparator || '',
					frame: this.config.formFrame,
					border: this.config.border,
					bodyBorder: this.config.bodyBorder,
					autoHeight: this.config.autoHeight,
					anchor: '100% 100%',
					errorReader: MODx.util.JSONReader,
					defaults: this.config.formDefaults || {
						msgTarget: this.config.msgTarget || 'under'
					},
					url: this.config.url,
					baseParams: this.config.baseParams || {},
					fileUpload: this.config.fileUpload || !1
				}),
				new Ext.FormPanel(config)
		},
		renderForm: function() {
			this.proFp.on('destroy', function() {
				Ext.EventManager.removeResizeListener(this.resizeWindow, this)
			}, this),
				this.add(this.proFp)

			this.fp.on('destroy', function() {
				Ext.EventManager.removeResizeListener(this.resizeWindow, this)
			}, this),
				this.add(this.fp)
			if(this.fieldCounter > 0) {
				this.proFp.hide()
			} else {
				this.proEditSwitch()
			}
		},
		checkIfLoaded: function(r) {
			return r = r || {},
			!(!this.fp || !this.fp.getForm()) && (this.fp.getForm().reset(),
				this.fp.getForm().setValues(r),
				!0)
		},
		setValues: function(r) {
			if(null === r)
				return !1
			this.fp.getForm().setValues(r)
		},
		reset: function() {
			this.fp.getForm().reset()
		},
		hideField: function(f) {
			f.disable(),
				f.hide()
			var d = f.getEl().up('.x-form-item')
			d && d.setDisplayed(!1)
		},
		showField: function(f) {
			f.enable(),
				f.show()
			var d = f.getEl().up('.x-form-item')
			d && d.setDisplayed(!0)
		},
		loadDropZones: function() {
			if(this._dzLoaded)
				return !1
			this.fp.getForm().items.each(function(fld) {
				fld.isFormField && (fld.isXType('textfield') || fld.isXType('textarea')) && !fld.isXType('combo') && new MODx.load({
					xtype: 'modx-treedrop',
					target: fld,
					targetEl: fld.getEl().dom
				})
			}),
				this._dzLoaded = !0
		},
		resizeWindow: function() {
			var viewHeight = Ext.getBody().getViewSize().height
				, el = this.fp.getForm().el
			viewHeight < this.originalHeight ? (el.setStyle('overflow-y', 'scroll'),
				el.setHeight(viewHeight - this.toolsHeight)) : (el.setStyle('overflow-y', 'auto'),
				el.setHeight('auto'))
		}
	}]
)