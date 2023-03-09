<?php

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3_MODE') || die();

ExtensionManagementUtility::addStaticFile(
    'user_template',
    'Configuration/Typoscript',
    'Grafing'
);
