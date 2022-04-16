<?php
defined('TYPO3_MODE') or die();

call_user_func(function () {
    $contentElement = new \CGGrafing\Template\ContentElement\Slider();
    $contentElement->getConfiguration();
});

call_user_func(function () {
    $contentElement = new \CGGrafing\Template\ContentElement\Teaser();
    $contentElement->getConfiguration();
});

// Adds the content element to the "Type" dropdown
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPlugin(
    array(
        'LLL:EXT:user_template/Resources/Private/Language/Tca.xlf:usertemplate_cell',
        'usertemplate_cell',
        'EXT:user_template/Resources/Public/Icons/ContentElements/usertemplate_cell.gif'
    ),
    'CType',
    'user_template'
);

call_user_func(function () {
    $contentElement = new \CGGrafing\Template\ContentElement\Slider();
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
\TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\B13\Container\Tca\Registry::class)->configureContainer(
    (
    new \B13\Container\Tca\ContainerConfiguration(
        'b13-2cols-with-header-container', // CType
        '2 Column Container With Header', // label
        'Some Description of the Container', // description
        [
            [
                ['name' => 'header', 'colPos' => 200, 'colspan' => 2, 'allowed' => ['CType' => 'header, textmedia']]
            ],
            [
                ['name' => 'left side', 'colPos' => 201],
                ['name' => 'right side', 'colPos' => 202]
            ]
        ] // grid configuration
    )
    )
        // override default configurations
        ->setIcon('EXT:container_example/Resources/Public/Icons/b13-2cols-with-header-container.svg')
        ->setSaveAndCloseInNewContentElementWizard(false)
);

// override default settings
$GLOBALS['TCA']['tt_content']['types']['b13-2cols-with-header-container']['showitem'] = 'sys_language_uid,CType,header,tx_container_parent,colPos';

// second container
\TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\B13\Container\Tca\Registry::class)->configureContainer(
    (
    new \B13\Container\Tca\ContainerConfiguration(
        'b13-2cols', // CType
        '2 Column', // label
        'Some Description of the Container', // description
        [
            [
                ['name' => '2-cols-left', 'colPos' => 200],
                ['name' => '2-cols-right', 'colPos' => 201]
            ]
        ] // grid configuration
    )
    )
);
