<?php
	ini_set('display_errors', 1);
	if (file_exists(MODX_CORE_PATH . 'components/extraext/model/extraext.include.php')) {
		include_once MODX_CORE_PATH . 'components/extraext/model/extraext.include.php';
	}
	if (class_exists('extraExtManagerController')) {
		//Основной контроллер
		class ExtraextIndexManagerController extends extraExtManagerController
		{

			public $componentName = 'extraext'; // название компонента так как называется его папка в assets/components/
			public $devMode = TRUE;

			public function getPageTitle()
			{
				return 'DEMO';
			}


			public function loadCustomCssJs()
			{

				$this->addJavascript('ajax/libs/jquery/3.5.1/jquery.min.js', 'https://ajax.googleapis.com/', TRUE);
				$this->addJavascript('/demo/demo.js', $this->componentUrl, TRUE);
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
