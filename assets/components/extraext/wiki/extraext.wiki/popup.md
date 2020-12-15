# popup
0) ![1](https://i.imgur.com/zljgNfk.jpg)
0) ![1](https://i.imgur.com/W5JYda6.jpg)

функция `prepare` устанавливает обработчик формы
функция `dePrepare` должна иметь эффект обратный `prepare`
```js
obj = {
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
}
```