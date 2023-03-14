<?php

use CGGrafing\Template\Hooks\CgTeaserPreviewRenderer;
use CGGrafing\Template\Hooks\FsSliderPreviewRenderer;
use CGGrafing\Template\Hooks\PageLayoutView\CellPreviewRenderer;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') or die();
// Include new content elements to modWizards
ExtensionManagementUtility::addPageTSConfig(
    '<INCLUDE_TYPOSCRIPT: source="FILE:EXT:user_template/Configuration/TsConfig/Page/Mod/Wizards/FluidStyledSlider.tsconfig">'
);
// Include new content elements to modWizards
ExtensionManagementUtility::addPageTSConfig(
    '<INCLUDE_TYPOSCRIPT: source="FILE:EXT:user_template/Configuration/TsConfig/Page/Mod/Wizards/Teaser.tsconfig">'
);

// Register hook to show preview of tt_content element of CType="fluid_styled_slider" in page module
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']
['fs_slider'] = FsSliderPreviewRenderer::class;

// Register hook to show preview of tt_content element of CType="fluid_styled_slider" in page module
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']
['cg_teaser'] = CgTeaserPreviewRenderer::class;

// Register for hook to show preview of tt_content element of CType="yourextensionkey_newcontentelement" in page module
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']
['usertemplate_cell'] = CellPreviewRenderer::class;

$iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);

// use same identifier as used in TSconfig for icon
$iconRegistry->registerIcon(
// use same identifier as used in TSconfig for icon
    'fluid-styled-slider',
    \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
    // font-awesome identifier ('external-link-square')
    ['source' => 'EXT:user_template/node_modules/@typo3/icons/src/mimetypes/mimetypes-powerpoint.svg']
);

$iconRegistry->registerIcon(
// use same identifier as used in TSconfig for icon
    'teaser',
    \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
    // font-awesome identifier ('external-link-square')
    ['source' => 'EXT:user_template/node_modules/@typo3/icons/src/content/content-text-teaser.svg']
);
