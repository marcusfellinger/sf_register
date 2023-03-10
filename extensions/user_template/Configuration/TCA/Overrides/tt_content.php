<?php

use CGGrafing\Template\ContentElement\Slider;
use CGGrafing\Template\ContentElement\Teaser;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') or die();

call_user_func(function () {
    $contentElement = new Slider();
    $contentElement->getConfiguration();
});

call_user_func(function () {
    $contentElement = new Teaser();
    $contentElement->getConfiguration();
});

// Adds the content element to the "Type" dropdown
ExtensionManagementUtility::addPlugin(
    array(
        'LLL:EXT:user_template/Resources/Private/Language/Tca.xlf:usertemplate_cell',
        'usertemplate_cell',
        'EXT:user_template/Resources/Public/Icons/ContentElements/usertemplate_cell.gif'
    ),
    'CType',
    'user_template'
);

call_user_func(function () {
    $contentElement = new Slider();
    $contentElement->getConfiguration();
});

// Configure the default backend fields for the content element
$GLOBALS['TCA']['tt_content']['types']['usertemplate_cell'] = [
    'showitem' => '
      --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
         --palette--;;general,
         --palette--;;headers,
         bodytext;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:bodytext_formlabel,
      --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
         --palette--;;frames,
         --palette--;;appearanceLinks,
      --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
         --palette--;;language,
      --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
         --palette--;;hidden,
         --palette--;;access,
      --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
         categories,
      --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
         rowDescription,
      --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
   ',
    'columnsOverrides' => [
        'bodytext' => [
            'config' => [
                'enableRichtext' => true,
                'richtextConfiguration' => 'default'
            ]
        ]
    ]
];