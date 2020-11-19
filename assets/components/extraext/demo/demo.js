var demo = {}
Ext.onReady(function() {
	MODx.add({
		xtype: 'demo-panel'
	})
})

demo.panel = function(config) {
	config = config || {}
	Ext.apply(config, {
		cls: 'container', // Добавляем отступы
		items: [{
			html: ' <h2>Demo table</h2>',
		},
			{
				xtype: 'modx-tabs',
				id: 'main-modx-tabs',
				deferredRender: false,
				border: true,
				items: [
					{
						title: 'demo extraExt-grid',
						items: [
							{
								xtype: extraExt.grid.xtype,
								name:'demo - snippet',
								columns: [
									{
										dataIndex: 'id',
										header: 'id',
										sortable: true,
										extraExtEditor:{
											visible:false,
										},
										renderer: extraExt.grid.renderers.default
									},
									{
										dataIndex: 'name',
										header: 'name',
										sortable: true,
										editor: {
										},
										extraExtEditor:{

										},
										renderer: extraExt.grid.renderers.default

									},
									{
										dataIndex: 'content',
										header: 'content',
										sortable: true,
										extraExtRenderer:{
											popup: true,
										},
										extraExtEditor:{
											// xtype:'modx-texteditor',
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
										editor: {xtype: 'textarea'},
										extraExtEditor:{
											xtype:extraExt.inputs.modComboSuper.xtype,
											action:'element/category/getlist',
											fields:['id','name'],
											displayField:'name',
											valueField: 'id',
										},
										extraExtRenderer:{
											popup: true,
										},
										renderer: extraExt.grid.renderers.HTML

									},
									{
										dataIndex: 'category',
										header: _('category'),
										sortable: true,
										extraExtEditor:{
											xtype:extraExt.inputs.modCombo.xtype,
											action:'element/category/getlist',
											fields:['id','name'],
											displayField:'name',
											valueField: 'id',
										},

										renderer: extraExt.grid.renderers.BOOL,
									},
								],
								extraExtSearch: true,
								extraExtUpdate: true,
								extraExtCreate: true,
								extraExtDelete: true,
								create_action:  'element/snippet/create',
								save_action:    'element/snippet/update',
								delete_action:  'element/snippet/remove',
								nameField: 'name',
								keyField: 'id',

								autosave: true,
								sortBy: 'id',
								sortDir:'desc',
								requestDataType: 'default',
								fields: ['id', 'name','description', 'content', 'category'],
								// url: MODx.config.connector_url, //по умолчанию
								action: 'element/snippet/getlist',
							}]
					},
					{
						title: 'demo',
						items: [{
							html: 'demo text',
							cls: 'panel-desc',
						},
							{
								xtype: 'grid',
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
										extraExtRenderer:{
											popup: true,
										},
										renderer: extraExt.grid.renderers.JSON
									},
									{
										dataIndex: 'html',
										header: 'html',
										sortable: true,
										width: 350,
										extraExtRenderer:{
											popup: true,
										},
										renderer: extraExt.grid.renderers.HTML
									},
									{
										dataIndex: 'bool',
										header: 'bool',
										sortable: true,
										renderer: extraExt.grid.renderers.BOOL
									},
									{
										dataIndex: 'control',
										header: 'control',
										renderer: extraExt.grid.renderers.RADIO,
									},

								],
								store: new Ext.data.ArrayStore({ // Объект ArrayStore
									fields: ['int', 'text', 'json', 'html', 'bool', 'control'], // Поля, доступные в массиве данных
									data: [ // Собственно, массив данных ([id, name])
										[1, 'Pencil', '{"a":1}', '<div class="demo"></div>', 1, 'да'],
										[2, 'Umbrella', '{"a":"text"}', '<div class="demo"></div>', false, 'нет'],
										[3, 'Ball', '[{"a":1},{"a":"text"}]', `
<div class="demo">
	<p>
		<div></div>
	</p>
</div>`, '0', 'наверное'],
									]
								}),
							}
						]
					}

				]
			}]
	})
	demo.panel.superclass.constructor.call(this, config) // Чёртова магия =)
}

Ext.extend(demo.panel, MODx.Panel)
Ext.reg('demo-panel', demo.panel)


//# sourceMappingURL=demo.js.map

//# sourceMappingURL=demo.js.map
