extraExt.create(
	extraExt.browser.xtype,
	function(config) {
		Ext.applyIf(config, {
			canSelectFolder: true,
			canSelectFile: true,
			id: Ext.id(),
			triggerClass: 'far fa-file-search',
		})
		extraExt.xTypes[extraExt.browser.xtype].superclass.constructor.call(this, config)
	},
	MODx.combo.Browser,
	[
		{
			onTriggerClick: function(btn) {
				return !this.disabled && (this.browser = MODx.load({
					xtype: extraExt.browser.browser.xtype,
					returnEl: this.id,
					returnElem: this,
					closeAction: 'close',
					id: Ext.id(),
					multiple: !0,
					source: this.config.source || MODx.config.default_media_source,
					hideFiles: this.config.hideFiles || !1,
					rootVisible: this.config.rootVisible || !1,
					allowedFileTypes: this.config.allowedFileTypes || '',
					wctx: this.config.wctx || 'web',
					openTo: this.config.openTo || '',
					rootId: this.config.rootId || '/',
					hideSourceCombo: this.config.hideSourceCombo || !1,
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
		}
	]
)
extraExt.create(
	extraExt.browser.browser.xtype,
	MODx.Browser = function(config) {
		if(MODx.browserOpen && !config.multiple)
			return !1
		config.multiple || (MODx.browserOpen = !0),
			config = config || {},
			Ext.applyIf(config, {
				onSelect: function(data) {},
				scope: this,
				source: config.source || 1,
				cls: 'modx-browser',
				closeAction: 'hide'
			}),
			extraExt.xTypes[extraExt.browser.browser.xtype].superclass.constructor.call(this, config),
			this.config = config,
			this.win = new extraExt.xTypes[extraExt.browser.window.xtype](config),
			this.win.reset()
	},
	Ext.Component,
	[
		{
			show: function(el) {
				this.win && this.win.show(el)
			},
			hide: function() {
				this.win && this.win.hide()
			},
			setSource: function(source) {
				this.config.source = source,
					this.win.tree.config.baseParams.source = source,
					this.win.view.config.baseParams.source = source
			}
		}
	]
)
extraExt.create(
	extraExt.browser.view.xtype,
	function(config) {
		config = config || {},
			this.ident = config.ident + '-view' || 'modx-browser-' + Ext.id() + '-view',
			this._initTemplates(),
			Ext.applyIf(config, {
				url: MODx.config.connector_url,
				id: this.ident,
				fields: [{
					name: 'name',
					sortType: Ext.data.SortTypes.asUCString
				}, 'cls', 'url', 'relativeUrl', 'fullRelativeUrl', 'image', 'image_width', 'image_height', 'thumb', 'thumb_width', 'thumb_height', 'pathname', 'pathRelative', 'ext', 'disabled', 'preview', {
					name: 'size',
					type: 'float'
				}, {
					name: 'lastmod',
					type: 'date',
					dateFormat: 'timestamp'
				}, 'menu'],
				baseParams: {
					action: 'browser/directory/getfiles',
					prependPath: config.prependPath || null,
					prependUrl: config.prependUrl || null,
					source: config.source || 1,
					allowedFileTypes: config.allowedFileTypes || '',
					wctx: config.wctx || 'web',
					dir: config.openTo || ''
				},
				tpl: 'list' === MODx.config.modx_browser_default_viewmode ? this.templates.list : this.templates.thumb,
				itemSelector: 'list' === MODx.config.modx_browser_default_viewmode ? 'div.modx-browser-list-item' : 'div.modx-browser-thumb-wrap',
				thumbnails: [],
				lazyLoad: function() {
					for(var height = this.getEl().parent().getHeight() + 100, i = 0; i < this.thumbnails.length; i++) {
						var image = this.thumbnails[i]
						if(void 0 !== image) {
							var rect = image.getBoundingClientRect()
							0 <= rect.top && 0 <= rect.left && rect.top <= height && (image.src = image.getAttribute('data-src'),
								delete this.thumbnails[i])
						}
					}
				},
				refresh: function() {
					MODx.DataView.prototype.refresh.call(this),
						this.thumbnails = Array.prototype.slice.call(document.querySelectorAll('img[data-src]')),
						this.lazyLoad()
				},
				listeners: {
					selectionchange: {
						fn: this.showDetails,
						scope: this,
						buffer: 100
					},
					dblclick: config.onSelect || {
						fn: Ext.emptyFn,
						scope: this
					},
					render: {
						fn: this.sortStore,
						scope: this
					},
					afterrender: {
						fn: function() {
							this.getEl().parent().on('scroll', function() {
								this.lazyLoad()
							}, this)
						},
						scope: this
					}
				},
				prepareData: this.formatData.createDelegate(this)
			}),
			extraExt.xTypes[extraExt.browser.view.xtype].superclass.constructor.call(this, config)
	},
	MODx.browser.View,
	[
		{
			showDetails: function() {
				var node = this.getSelectedNodes()
					, detailPanel = Ext.getCmp(this.config.ident + '-img-detail-panel').body
					, okBtn = Ext.getCmp(this.ident + '-ok-btn')
				if(node && 0 < node.length) {
					node = node[0],
					okBtn && okBtn.enable()
					var data = this.lookup[node.id]
					this.config.tree.getNodeById(data.pathRelative) && (this.config.tree.cm.activeNode = this.config.tree.getNodeById(data.pathRelative),
						this.config.tree.getSelectionModel().select(this.config.tree.getNodeById(data.pathRelative)))
					Ext.getCmp(this.ident + '-filepath').setValue((-1 === data.fullRelativeUrl.indexOf('http') ? '/' : '') + data.fullRelativeUrl)
					detailPanel.hide()
					this.templates.details.default.overwrite(detailPanel, data)
					detailPanel.slideIn('l', {
						stopFx: !0,
						duration: '.2'
					})
				} else
					okBtn && okBtn.disable(),
						detailPanel.update('')
			},
			formatData: function(data) {
				var MIME = ''
				var type = '0'
				switch( data.ext.toLowerCase() ) {
					case 'doc':
					case 'docx':
						MIME = 'application/msword'
						break
					case 'pdf':
						MIME = 'application/pdf'
						break
					case 'css':
						type = 'CSS'
						MIME = 'text/plain'
						break
					case 'txt':
						MIME = 'text/plain'
						break
					case 'log':
						MIME = 'text/plain'
						break
					case 'tpl':
						type = 'HTML'
						MIME = 'text/plain'
						break
					case 'html':
						type = 'HTML'
						MIME = 'text/plain'
						break
					case 'md':
						type = 'MD'
						MIME = 'text/plain'
						break
					case 'js':
						type = 'JS'
						MIME = 'text/javascript'
						break
					case 'json':
						type = 'JSON'
						MIME = 'text/javascript'
						break
					default:
						MIME = 'text/plain'
						break
				}
				return data.shortName = Ext.util.Format.ellipsis(data.name, 18),
					data.sizeString = extraExt.util.convert(data.size).join(' '),
					data.MIME = MIME,
					data.id = Ext.id(),
					data.type = type,
					data.imageSizeString = 0 != data.preview ? data.image_width + 'x' + data.image_height + 'px' : 0,
					data.imageSizeString = 'xpx' === data.imageSizeString ? 0 : data.imageSizeString,
					data.dateString = Ext.isEmpty(data.lastmod) ? 0 : new Date(data.lastmod).format(MODx.config.manager_date_format + ' ' + MODx.config.manager_time_format),
					this.lookup[data.name] = data
			},
			_initTemplates: function() {
				this.templates.thumb = new Ext.XTemplate('<tpl for=".">', '<div class="modx-browser-thumb-wrap" id="{name:htmlEncode}" title="{name:htmlEncode}">', '  <div class="modx-browser-thumb">', '      <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{thumb:htmlEncode}" width="{thumb_width}" height="{thumb_height}" alt="{name:htmlEncode}" title="{name:htmlEncode}" />', '  </div>', '  <span>{shortName:htmlEncode}</span>', '</div>', '</tpl>')
				this.templates.thumb.compile()
				this.templates.list = new Ext.XTemplate('<tpl for=".">', '<div class="modx-browser-list-item" id="{name:htmlEncode}">', '  <span class="icon icon-file {cls}">', '      <span class="file-name">{name:htmlEncode}</span>', '      <tpl if="sizeString !== 0">', '      <span class="file-size">{sizeString}</span>', '      </tpl>', '      <tpl if="imageSizeString !== 0">', '      <span class="image-size">{imageSizeString}</span>', '      </tpl>', '  </span>', '</div>', '</tpl>')
				this.templates.list.compile()
				this.templates.details = {}
				var temp = [
					'  <div class="modx-browser-details-info">',
					'      <b>' + _('file_name') + ':</b>',
					'      <span>{name:htmlEncode}</span>',
					'  <tpl if="sizeString !== 0">',
					'      <b>' + _('file_size') + ':</b>',
					'      <span>{sizeString}</span>',
					'  </tpl>',
					'  <tpl if="dateString !== 0">',
					'      <b>' + _('last_modified') + ':</b>',
					'      <span>{dateString}</span>',
					'  </tpl>',
					'  </div>',
					'  </tpl>',
					'</div>'
				]
				this.templates.details.default = new Ext.XTemplate(
					'<div class="details">',
					'  <tpl for=".">',
					'  		<tpl if="size !== 0 && size <= 10485760">',
					'      		<div class="modx-browser-detail-thumb">',
					`				<button style="width: 100%;" class="btn" onclick='extraExt.util.renderer.openPopup({msg:"/manager/?a=mgr/preview&namespace=extraext&p=/{pathRelative}",type:"href"})'>${_('extraExt.increase')}<i class="fad fa-search-plus"></i></button>`,
					'      		    <iframe src="/manager/?a=mgr/preview&namespace=extraext&p=/{pathRelative}"  class="extraExt extraExt-embed" frameborder="0" alt="" id="{id}" data-content-type="{type}" type="{MIME}" style="width: 100%;"></iframe>',
					'      		</div>',
					'  		</tpl>',
					'  		<tpl if="!(size !== 0 && size <= 10485760)">',
					'      		<div class="modx-browser-detail-thumb">',
					'      		    <img src="{image:htmlEncode}" alt="" />',
					'      		</div>',
					'  		</tpl>',
					'  </tpl>',
					...temp
				)
				this.templates.details.default.compile()
			}
		}
	]
)
extraExt.create(
	extraExt.browser.tree,
	function(config) {
		extraExt.xTypes[extraExt.browser.tree].superclass.constructor.call(this, config)
	},
	MODx.tree.Directory,
	[
		{
			_initExpand: function() {
				var treeState = Ext.state.Manager.get(this.treestate_id)
				Ext.isEmpty(this.config.openTo) ? this.expandPath(treeState, 'id') : this.selectPath(this.config.openTo, 'id')
			},
			selectPath: function(e, a, g) {
				if(Ext.isEmpty(e)) {
					if(g) {g(false, undefined)}
					return
				}
				a = a || 'id'
				var c = e.split(this.pathSeparator), b = ''
				if(c[c.length - 1].indexOf('.') > 0) {
					b = c.pop()
				}
				if(c.length > 1) {
					var d = function(i, h) {
						if(i && h) {
							var j = h.findChild(a, b)
							if(j) {
								j.select()
								if(g) {g(true, j)}
							} else {if(g) {g(false, j)}}
						} else {if(g) {g(false, j)}}
					}
					this.expandPath(c.join(this.pathSeparator), a, d)
				} else {
					this.root.select()
					if(g) {g(true, this.root)}
				}
			},
			expandPath: function(g, a, h) {
				if(g[0] == '/') {
					g = g.slice(1)
				}
				if(g[g.length - 1] != '/') {
					g += '/'
				}
				if(Ext.isEmpty(g)) {
					if(h) {h(false, undefined)}
					return
				}
				a = a || 'id'
				var d = g.split(this.pathSeparator)
				var c = this.root
				if(c.attributes[a] != d[0] && c.attributes[a] != this.rootId) {
					if(h) {h(false, null)}
					return
				}
				var b = 0
				var self = this
				var pre = ''
				var e = function() {
					if(b + 1 == d.length) {
						if(h) {h(true, c)}
						return
					}
					var i = c.findChild(a, pre + d[b] + self.pathSeparator)
					pre += d[b] + self.pathSeparator
					b++
					if(!i) {
						if(h) {h(false, c)}
						return
					}
					c = i
					i.expand(false, false, e)
					if(b >= d.length - 1) {
						i.select()
					}
				}
				c.expand(false, false, e)
			},
		}
	]
)

extraExt.create(
	extraExt.browser.window.xtype,
	function(config) {
		config = config || {},
			this.ident = Ext.id()
		MODx.browserOpen = !0
		this.path = config.returnElem.getValue() || config.openTo
		this.dir = this.path
		this.file = ''
		if(this.path.indexOf('.') > 0) {
			var t = this.path.split('/')
			this.file = t.pop()
			this.dir = t.join('/')
		}
		this.tree = MODx.load({
			xtype: extraExt.browser.tree,
			onUpload: function() {
				this.view.run()
			},
			scope: this,
			source: config.source || MODx.config.default_media_source,
			hideFiles: config.hideFiles || MODx.config.modx_browser_tree_hide_files,
			hideTooltips: config.hideTooltips || MODx.config.modx_browser_tree_hide_tooltips || !0,
			openTo: this.dir || '',
			ident: this.ident,
			rootId: config.rootId || '/',
			rootName: _('files'),
			rootVisible: null == config.rootVisible || !Ext.isEmpty(config.rootId),
			id: this.ident + '-tree',
			hideSourceCombo: config.hideSourceCombo || !1,
			useDefaultToolbar: !1,
			listeners: {
				afterUpload: {
					fn: function() {
						this.view.run()
					},
					scope: this
				},
				afterQuickCreate: {
					fn: function() {
						this.view.run()
					},
					scope: this
				},
				afterRename: {
					fn: function() {
						this.view.run()
					},
					scope: this
				},
				afterRemove: {
					fn: function() {
						this.view.run()
					},
					scope: this
				},
				changeSource: {
					fn: function(s) {
						this.config.source = s,
							this.view.config.source = s,
							this.view.baseParams.source = s,
							this.view.dir = '/',
							this.view.run()
					},
					scope: this
				},
				afterrender: {
					fn: function(tree) {
						tree.root.expand()
					},
					scope: this
				},
				beforeclick: {
					fn: function(node, e) {
						if(node.leaf)
							return this.view.select(this.view.store.indexOfId('/' + node.attributes.url)),
							this.view.dir !== node.parentNode.id && this.load(node.parentNode.id),
								!1
						this.load(node.id)
					},
					scope: this
				}
			}
		})
		this.view = MODx.load({
			xtype: extraExt.browser.view.xtype,
			onSelect: {
				fn: this.onSelect,
				scope: this
			},
			source: config.source || MODx.config.default_media_source,
			allowedFileTypes: config.allowedFileTypes || '',
			wctx: config.wctx || 'web',
			openTo: config.openTo || this.dir,
			ident: this.ident,
			id: this.ident + '-view',
			tree: this.tree,
			returnEl: this.returnEl,
			returnElem: config.returnElem,
		})
		this.tree.view = this.view

		var btns = []
		btns.push({
			id: this.ident + '-cancel-btn',
			text: _('cancel') + ' <i class="fas fa-times-square"></i>',
			handler: this.close,
			scope: this
		})

		if(config.returnElem.canSelectFile) {
			btns.push({
				id: this.ident + '-ok-btn',
				text: _('extraExt.select') + ' <i class="fas fa-file"></i>',
				cls: 'primary-button',
				handler: this.onSelect,
				scope: this
			})
		}
		if(config.returnElem.canSelectFolder) {
			btns.push({
				id: this.ident + '-selectFolder-btn',
				text: _('extraExt.select') + ' <i class="fas fa-folder-open"></i>',
				cls: 'primary-button',
				handler: this.onSelectFolder,
				scope: this
			})
		}
		Ext.applyIf(config, {
			title: _('modx_browser') + ' (' + (MODx.ctx ? MODx.ctx : 'web') + ')',
			cls: 'modx-browser modx-browser-window',
			layout: 'border',
			minWidth: 500,
			minHeight: 300,
			width: '90%',
			height: .9 * Ext.getBody().getViewSize().height,
			modal: false,
			closeAction: 'hide',
			border: false,
			enableTree: true,
			items: [
				{
					id: this.ident + '-browser-tree',
					cls: 'modx-browser-tree',
					region: 'west',
					width: 250,
					height: '100%',
					items: this.tree,
					autoScroll: !0,
					split: !0,
					border: !1
				},
				{
					id: this.ident + '-browser-view',
					cls: 'modx-browser-view-ct',
					region: 'center',
					autoScroll: !0,
					border: !1,
					items: this.view,
					tbar: this.getToolbar(),
					bbar: this.getPathbar()
				},
				{
					id: this.ident + '-img-detail-panel',
					cls: 'modx-browser-details-ct',
					region: 'east',
					split: !0,
					border: !1,
					width: 250
				}
			],
			buttons: btns,
			keys: {
				key: 27,
				handler: this.hide,
				scope: this
			}
		})

		extraExt.xTypes[extraExt.browser.window.xtype].superclass.constructor.call(this, config)
		this.config = config
		this.addEvents({
			select: !0
		})
	},
	Ext.Window,
	[
		{
			returnEl: null,
			filter: function() {
				var filter = Ext.getCmp(this.ident + 'filter')
				this.view.store.filter('name', filter.getValue(), !0),
					this.view.select(0)
			},
			load: function(dir) {
				dir = dir || (Ext.isEmpty(this.config.openTo) ? '' : this.config.openTo),
					this.view.run({
						dir: dir,
						source: this.config.source,
						allowedFileTypes: this.config.allowedFileTypes || '',
						wctx: this.config.wctx || 'web'
					}),
					this.sortStore()
			},
			sortStore: function() {
				var v = Ext.getCmp(this.ident + 'sortSelect').getValue()
				this.view.store.sort(v, 'name' == v ? 'ASC' : 'DESC'),
					this.view.select(0)
			},
			changeViewmode: function() {
				var v = Ext.getCmp(this.ident + 'viewSelect').getValue()
				this.view.setTemplate(v),
					this.view.select(0)
			},
			reset: function() {
				this.rendered && (Ext.getCmp(this.ident + 'filter').reset(),
					this.view.getEl().dom.scrollTop = 0),
					this.view.store.clearFilter(),
					this.view.select(0)
			},
			getToolbar: function() {
				return [
					{
						text: _('filter') + ':',
						xtype: 'label'
					},
					{
						xtype: 'textfield',
						id: this.ident + 'filter',
						selectOnFocus: !0,
						width: 200,
						listeners: {
							render: {
								fn: function() {
									Ext.getCmp(this.ident + 'filter').getEl().on('keyup', function() {
										this.filter()
									}, this, {
										buffer: 500
									})
								},
								scope: this
							}
						}
					},
					{
						text: _('sort_by') + ':',
						xtype: 'label'
					},
					{
						id: this.ident + 'sortSelect',
						xtype: 'combo',
						typeAhead: !0,
						triggerAction: 'all',
						width: 130,
						editable: !1,
						mode: 'local',
						displayField: 'desc',
						valueField: 'name',
						lazyInit: !1,
						value: MODx.config.modx_browser_default_sort || 'name',
						store: new Ext.data.SimpleStore({
							fields: ['name', 'desc'],
							data: [['name', _('name')], ['size', _('file_size')], ['lastmod', _('last_modified')]]
						}),
						listeners: {
							select: {
								fn: this.sortStore,
								scope: this
							}
						}
					},
					'-',
					{
						text: _('files_viewmode') + ':',
						xtype: 'label'
					},
					'-',
					{
						id: this.ident + 'viewSelect',
						xtype: 'combo',
						typeAhead: !1,
						triggerAction: 'all',
						width: 100,
						editable: !1,
						mode: 'local',
						displayField: 'desc',
						valueField: 'type',
						lazyInit: !1,
						value: MODx.config.modx_browser_default_viewmode || 'grid',
						store: new Ext.data.SimpleStore({
							fields: ['type', 'desc'],
							data: [
								['grid', _('files_viewmode_grid')],
								['list', _('files_viewmode_list')],
							]
						}),
						listeners: {
							select: {
								fn: this.changeViewmode,
								scope: this
							}
						}
					}
				]
			},
			getPathbar: function() {
				return {
					cls: 'modx-browser-pathbbar',
					items: [{
						xtype: 'textfield',
						id: this.ident + '-filepath',
						cls: 'modx-browser-filepath',
						listeners: {
							focus: {
								fn: function(el) {
									setTimeout(function() {
										var field = el.getEl().dom
										if(field.createTextRange) {
											var selRange = field.createTextRange()
											selRange.collapse(!0),
												selRange.moveStart('character', 0),
												selRange.moveEnd('character', field.value.length),
												selRange.select()
										} else
											field.setSelectionRange ? field.setSelectionRange(0, field.value.length) : field.selectionStart && (field.selectionStart = 0,
												field.selectionEnd = field.value.length)
									}, 50)
								},
								scope: this
							}
						}
					}]
				}
			},
			setReturn: function(el) {
				this.returnEl = el
			},
			onSelect: function(data) {
				var selNode = this.view.getSelectedNodes()[0]
					, callback = this.config.onSelect || this.onSelectHandler
					, lookup = this.view.lookup
					, scope = this.config.scope
				this.hide(this.config.animEl || null, function() {
					if(selNode && callback) {
						var data = lookup[selNode.id]
						Ext.callback(callback, scope || this, [data]),
							this.fireEvent('select', data)
					}
				}, scope)
			},
			onSelectFolder: function() {
				var data = this.view.dir,
					scope = this.config.scope
				this.hide(this.config.animEl || null, function() {
					if(data) {
						Ext.get(this.config.scope.returnEl).dom.value = unescape(data)
					}
				}, scope)
			},
			onSelectHandler: function(data) {
				Ext.get(this.returnEl).dom.value = unescape(data.url)
			}
		},
	]
)