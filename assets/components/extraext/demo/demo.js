var demo = {}
Ext.onReady(function() {
	MODx.add({
		xtype: 'demo-panel'
	})
})
$(document).on('tabSwitch', function(c) {
	console.info(this, ...arguments)
})
demo.panel = function(config) {
	config = config || {}
	Ext.apply(config, {
		cls: 'container', // Добавляем отступы
		items: [{
			html: ' <h2>Demo table</h2>',
		},
			{
				xtype: extraExt.tabs.xtype,
				id: 'main-modx-tabs',
				deferredRender: false,
				border: true,
				items: [
					{
						id: 'tab1',
						title: 'demo extraExt-grid',
						items: [
							{
								xtype: extraExt.grid.xtype,
								id: 'demo-table-1',
								name: 'demo - snippet',
								columns: [
									{
										dataIndex: 'id',
										header: 'id',
										sortable: true,
										extraExtEditor: {
											visible: false,
										},
										renderer: extraExt.grid.renderers.default
									},
									{
										dataIndex: 'name',
										header: 'name',
										sortable: true,
										editor: {},
										extraExtEditor: {},
										renderer: extraExt.grid.renderers.default

									},
									{
										dataIndex: 'content',
										header: 'content',
										sortable: true,
										extraExtRenderer: {
											popup: true,
										},
										extraExtEditor: {
											xtype:'modx-texteditor',
											height: '300',
											mimeType: 'text/x-smarty',
											enableKeyEvents: true,
											modxTags: true
										},
										renderer: extraExt.grid.renderers.PHP
									},
									{
										dataIndex: 'description',
										header: 'description',
										sortable: true,
										editor: {xtype: MODx.combo.Browser.xtype},
										extraExtRenderer: {
											popup: true,
										},
										renderer: extraExt.grid.renderers.BOOL

									},
									{
										dataIndex: 'category',
										header: _('category'),
										sortable: true,
										extraExtEditor: {
											xtype: extraExt.inputs.modCombo.xtype,
											action: 'element/category/getlist',
											fields: ['id', 'name'],
											displayField: 'name',
											valueField: 'id',
										},

										renderer: extraExt.grid.renderers.BOOL,
									},
									{
										dataIndex: 'CONTROL',
										header: 'CONTROL',
										extraExtRenderer: {
											controls: [
												{
													action: 'test',
													icon: 'far fa-arrow-alt-from-left',
													cls: 'test-cls'
												}
											],
										},
										renderer: extraExt.grid.renderers.CONTROL,
									},
								],
								extraExtSearch: true,
								extraExtUpdate: true,
								extraExtCreate: true,
								extraExtDelete: true,
								create_action: 'element/snippet/create',
								save_action: 'element/snippet/update',
								delete_action: 'element/snippet/remove',
								nameField: 'name',
								keyField: 'id',
								addMenu: function(m, grid, rowIndex) {
									m.push({
										text: 'test',
										grid: grid,
										rowIndex: rowIndex,
										handler: this.test
									})
									return m
								},
								test: function() {
									console.log(this, arguments)
									alert('work')
								},
								autosave: true,
								sortBy: 'id',
								sortDir: 'desc',
								requestDataType: 'form',
								fields: ['id', 'name', 'description', 'content', 'category'],
								// url: MODx.config.connector_url, //по умолчанию
								action: 'element/snippet/getlist',
							}]
					},
					{
						id: 'tab2',
						title: 'demo',
						items: [{
							html: 'demo text',
							cls: 'panel-desc',
						},
							{
								xtype: 'grid',
								id: 'demo-table-2',
								autoHeight: true,
								columns: [ // Добавляем ширину и заголовок столбца
									{
										dataIndex: 'int',
										header: 'int',
										sortable: true,
										renderer: extraExt.grid.renderers.default
									},
									{
										dataIndex: 'text',
										header: 'text',
										sortable: true,
										renderer: extraExt.grid.renderers.default
									},
									{
										dataIndex: 'json',
										header: 'json',
										sortable: true,
										width: 350,
										test: 1548452154,
										extraExtRenderer: {
											popup: true,
										},
										renderer: extraExt.grid.renderers.JSON
									},
									{
										dataIndex: 'html',
										header: 'html',
										sortable: true,
										extraExtRenderer: {
											popup: true,
										},
										renderer: extraExt.grid.renderers.HTML
									},
									{
										dataIndex: 'md',
										header: 'MarkDown',
										sortable: true,
										extraExtRenderer: {
											popup: true,
										},
										renderer: extraExt.grid.renderers.MD
									},
									{
										dataIndex: 'bool',
										header: 'bool',
										sortable: true,
										renderer: extraExt.grid.renderers.BOOL
									},
									{
										dataIndex: 'radio',
										header: 'radio',
										renderer: extraExt.grid.renderers.RADIO,
									},
									{
										dataIndex: 'HEX',
										header: 'HEX',
										renderer: extraExt.grid.renderers.HEX,
									},
									{
										dataIndex: 'IMAGE',
										header: 'IMAGE',
										extraExtRenderer: {
											popup: true,
											cellMaxHeight: 100,
										},
										renderer: extraExt.grid.renderers.IMAGE,
									},

								],
								store: new Ext.data.ArrayStore({ // Объект ArrayStore
									fields: ['int', 'text', 'json', 'html', 'bool', 'radio', 'md', 'HEX', 'IMAGE'], // Поля, доступные в массиве данных
									data: [ // Собственно, массив данных ([id, name])
										[1, 'Pencil', '{"a":1}', '<div class="demo"></div>', 1, 'да', `
											# H1
											## H2
											### h3
											
										`, '#ffffff', 'https://college.tapsell.ir/wp-content/uploads/2018/06/03-3.jpg'],
										[2, 'Umbrella', '{"a":"text"}', '<div class="demo"></div>', false, 'нет', `
											# H1
											## H2
											### H3
											
										`, '#000000', 'https://static2.aniimg.com/upload/20170516/441/i/w/E/iwEFEF.jpg'],
										[3, 'Ball', '[{"a":1},{"a":"text"}]', `
<div class="demo">
	<p>
		<div></div>
	</p>
</div>`, '0', 'наверное', `
											# H1
											## H2
											### H3
											
										`, '#ff0055'],
									]
								}),
							}
						]
					},
					{
						id: 'tab3',
						title: 'test',
						items: [{
							html: 'demo text',
							cls: 'panel-desc',
						},
							{
								xtype: MODx.combo.Browser.xtype,
							},
							{
								xtype: extraExt.browser.xtype,
								openTo: 'core/',
								canSelectFolder: true,
								canSelectFile: true,
							},
							{
								xtype: extraExt.inputs.popup.xtype,
								prepare: function(data) {
									if(data.test == _('yes')) {
										data.test = 1
									} else {
										data.test = 0
									}
								},
								dePrepare: function(data) {
									if(data.test == 1) {
										data.test = _('yes')
									} else {
										data.test = _('no')
									}
								},
								fields: [
									{
										xtype: MODx.combo.Boolean.xtype,
										name: 'test',
									},
									{
										xtype: 'textarea',
										name: 'description',
									},
									{
										xtype: extraExt.inputs.modComboSuper.xtype,
										action: 'element/category/getlist',
										fields: ['id', 'name'],
										displayField: 'name',
										valueField: 'id',
										name: 'category',
										hiddenName: 'category'
									}
								]
							},
							{
								xtype: extraExt.inputs.infinity.xtype,
								name:'inf',
								field: {
									xtype: extraExt.inputs.popup.xtype,
									prepare: function(data) {
										if(data.test == _('yes')) {
											data.test = 1
										} else {
											data.test = 0
										}
									},
									dePrepare: function(data) {
										if(data.test == 1) {
											data.test = _('yes')
										} else {
											data.test = _('no')
										}
									},
									fields: [
										{
											xtype: MODx.combo.Boolean.xtype,
											name: 'test',
										},
										{
											xtype: 'textarea',
											name: 'description',
										},
										{
											xtype: extraExt.inputs.modComboSuper.xtype,
											action: 'element/category/getlist',
											fields: ['id', 'name'],
											displayField: 'name',
											valueField: 'id',
											name: 'category',
											hiddenName: 'category'
										}
									]
								},

							},
							{
								xtype: extraExt.inputs.date.xtype,
								name:'date',
							},
						]
					}
				]
			}]
	})
	demo.panel.superclass.constructor.call(this, config) // Чёртова магия =)
}

Ext.extend(demo.panel, MODx.Panel)
Ext.reg('demo-panel', demo.panel)
