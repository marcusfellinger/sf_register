<?php
defined('TYPO3_MODE') || die();

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
    'user_template',
    'Configuration/Typoscript',
    'Grafing'
);
