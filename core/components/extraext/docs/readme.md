# ExtraExt 
Библиотека готовых решения для ExtJs в ModX
### Введение
в этом компоненте я хочу собрать самые удачные решения для разработки интерфейса в админке modx.
Если у вас есть что-то что вы таскаете из компонента в компонент напишите мне или сделайте pull request на GitHub
## Начало работы
что бы начать работать с ExtraExt
вам нужно подключить `extraExtManagerController`

Например:

файл: core/ваш_компонент/index.class.php
```php
<?php
	if (file_exists(MODX_CORE_PATH . 'components/extraext/model/extraext.include.php')) {
		include_once MODX_CORE_PATH . 'components/extraext/model/extraext.include.php';
	}
	if (class_exists('extraExtManagerController')) {
		//Основной контроллер
		class ExtraextIndexManagerController extends extraExtManagerController
		{

			public $componentName = 'компонент'; // название компонента так как называется его папка в assets/components/
			public $devMode = TRUE;

			public function getPageTitle()
			{
				return 'Page title';
			}


			public function loadCustomCssJs()
			{
				$this->addJavascript('https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', null, TRUE); //кеширование сторонних скриптов. кеш храниться в assets/cache
				$this->addJavascript('js/mgr/script.js', $this->componentUrl); //подключение своего скрипта 
				$this->addJCss('css/mgr/style.css', $this->componentUrl); //подключение своего скрипта 
			}
		}
	} else {
		//Запасной контроллер
		class ExtraextIndexManagerController extends modExtraManagerController
		{
			public function getPageTitle()
			{
				return 'install Error';
			}

			public function loadCustomCssJs()
			{
				$this->addHtml("
					<H1 class='error'>INSTALL ERROR</H1>
					<p>Pleas install <strong>extraExt</strong> for correct work</p>
				");
			}
		}
	}
```

после этого на вашей страннице будут определены следующие константы:
 ```js
    const assetsUrl = `/assets`
    const ваш_компонентConnectorUrl = `/assets/components/ваш_компонент/connector.php`
    const ваш_компонентAssetsUrl = `/assets/components/ваш_компонент/`
    const extraExtUrl = `/assets/components/extraext/`
    const componentName = `ваш_компонент` 
    const devMode =true/false
    var extraExt // базоый объект
```
Список зарегистрированных xtype'oв `extraExt.xTypes`

[подробнее о Grid](https://github.com/Traineratwot/extraext/wiki/Grid)
[подробнее о renderer](https://github.com/Traineratwot/extraext/wiki/Grid)
[подробнее о editor](https://github.com/Traineratwot/extraext/wiki/editor)
[подробнее о tab](https://github.com/Traineratwot/extraext/wiki/tab)
