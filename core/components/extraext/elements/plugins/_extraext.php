<?php
	/** @var modX $modx */
	$eventName = $modx->event->name;
	switch($eventName) {
		case 'OnManagerPageBeforeRender':
			$assets = rtrim($modx->getOption('assets_url', NULL, '/assets'), '/') . '/';
			$extraExtUrl = $assets . "components/extraext/";
			$modx->controller->addCss($extraExtUrl.'css/fontawesome.min.css');
			$modx->controller->addCss($extraExtUrl.'css/firacode.min.css');
			unset($assets);
			break;
	}