extraExt.create(
	extraExt.form.xtype,
	function(config) {
		Ext.applyIf(config, {
			cls: 'panel-desc',
			anchor: '100%',
			baseParams: {},
			btnSubmit: true,
			btnReset: true,
			url: MODx.config.connector_url,
			success: function(form, action) {
				MODx.msg.status({
					title: _('extraExt.' + action?.msg),
					message: _('extraExt.html.success'),
					delay: 3
				})
			},
			failure: function(form, action) {
				MODx.msg.status({
					title: _('extraExt.' + action?.msg),
					message: _('extraExt.html.failure'),
					delay: 3
				})
			}
		})
		config.tbar = this.getTopBar.call(this, config)
		config.bbar = this.getBotBar.call(this, config)
		extraExt.xTypes[extraExt.form.xtype].superclass.constructor.call(this, config)

		if(this.hasOwnProperty('action')) {
			this.baseParams.action = this?.action || null
		}
		this.getForm().doAction = function(b, a) {
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
		console.debug(this, config)
	},
	Ext.form.FormPanel,
	[{
		leftTbar: [],
		rightTbar: [],
		rightBbar: [],
		leftBbar: [],
		getForm: function() {
			return this.form
		},
		getTopBar: function(config) {
			var tbar = []
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
			var bbar = []
			if(config.btnReset) {
				bbar.push({
					text: 'Reset',
					handler: () => {
						this.getForm().reset()
					}
				})
			}
			if(config.btnSubmit) {
				bbar.push({
					text: 'Submit',
					formBind: true, //only enabled once the form is valid
					handler: () => {
						console.debug(this)
						var form = this.getForm()
						if(form.isValid()) {
							form.submit({
								success: this.success,
								failure: this.failure
							})
						}
					}
				})
			}
			for(const leftBbarKey in config.leftBbar) {
				if(config.leftTbar.hasOwnProperty(leftTbarKey)) {
					bbar.push(config.leftTbar[leftTbarKey])
				}
			}
			bbar.push('->')
			for(const rightBbarKey in config.rightBbar) {
				if(config.rightTbar.hasOwnProperty(rightTbarKey)) {
					bbar.push(config.rightTbar[rightTbarKey])
				}
			}
			return bbar
		},
	}]
)