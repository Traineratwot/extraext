# ediror
Это всплывающее окно с формой для изменения или создания строки в `grid`

настройка поля формы производиться в `Grid` в поле `extraExtEditor` внутри `columns` 
```js
columns = [
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

		renderer: extraExt.grid.renderers.default,
	}
]
```