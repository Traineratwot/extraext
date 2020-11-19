
	<?php
		// Ищем MODX
		// Подключаем MODX
		if (!isset($modx)) {
			$base_path = __DIR__;
			// Ищем MODX
			while (!file_exists($base_path . "/config.core.php")) {
				$base_path = dirname($base_path);
			}
			if (file_exists($base_path . "/index.php")) {
				require_once $base_path . "/config.core.php";
				require_once MODX_CORE_PATH . "config/" . MODX_CONFIG_KEY . ".inc.php";
				require_once MODX_CONNECTORS_PATH . "index.php";
			} else {
				die("modx not found");
			}
		}
		if (!isset($modx)) {
			die("modx not found");
		}
	
		// Указываем путь к папке с процессорами и заставляем MODX работать
		$modx->addPackage("extraext", MODX_CORE_PATH . "components/extraext/model/");
		$modx->lexicon->load("extraext:default");
		$modx->request->handleRequest([
			"processors_path" => MODX_CORE_PATH . "components/extraext/processors/",
			"location" => "",
		]);
	