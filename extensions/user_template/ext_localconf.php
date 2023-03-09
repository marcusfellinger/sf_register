<?php

defined('TYPO3_MODE') or die();
if (TYPO3_MODE === 'BE') {
    // Include new content elements to modWizards
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
        '<INCLUDE_TYPOSCRIPT: source="FILE:EXT:user_template/Configuration/PageTSconfig/FluidStyledSlider.ts">'
    );
    // Include new content elements to modWizards
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
        '<INCLUDE_TYPOSCRIPT: source="FILE:EXT:user_template/Configuration/PageTSconfig/Teaser.ts">'
    );

    // Register hook to show preview of tt_content element of CType="fluid_styled_slider" in page module
    $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']
    ['fs_slider'] = CGGrafing\Template\Hooks\FsSliderPreviewRenderer::class;

    // Register hook to show preview of tt_content element of CType="fluid_styled_slider" in page module
    $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']
    ['cg_teaser'] = CGGrafing\Template\Hooks\CgTeaserPreviewRenderer::class;

    // Register for hook to show preview of tt_content element of CType="yourextensionkey_newcontentelement" in page module
    $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms/layout/class.tx_cms_layout.php']['tt_content_drawItem']
    ['usertemplate_cell'] = \CGGrafing\Template\Hooks\PageLayoutView\CellPreviewRenderer::class;
}