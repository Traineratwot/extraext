extraExt.window.xtype = 'extraExt-window'
extraExt.requireConfigField[extraExt.window.xtype] = [
	'action',
	'url',
	'fields',
]
extraExt.xTypes[extraExt.window.xtype] = function(config) {
	config = config || {}
	var requireConfigField = extraExt.requireConfigField[extraExt.window.xtype].slice()
	var errorConfig = []
	var warnConfig = []
	Object.assign({}, config)
	Ext.applyIf(config, {
		closeAction: 'close',
		requestDataType: 'default',
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

}
Ext.extend(extraExt.xTypes[extraExt.window.xtype], MODx.Window) // Расширяем MODX.Window
Ext.reg(extraExt.window.xtype, extraExt.xTypes[extraExt.window.xtype]) // Регистрируем