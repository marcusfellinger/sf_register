<?php
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2018 Marcus Fellinger <marcus@felliweb.de>
 *  All rights reserved
 *
 *  This script is part of the user_template project.
 *
 *  For the full copyright and license information, please read the
 *  LICENSE.txt file that was distributed with this source code.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

declare(strict_types=1);

namespace CGGrafing\Template\ContentElement;

/**
 * Class Teaser
 * @package CGGrafing\Template\ContentElement
 */
class Teaser extends AbstractElement
{
    /**
     *
     */
    public function getConfiguration()
    {
        $typeName = 'teaser';
        $prefix = 'cg_';
        $extKey = 'EXT:user_template';
        $languageFilePrefix = 'LLL:' . $extKey . '/Resources/Private/Language/Database.xlf:';
        $customLanguageFilePrefix = 'LLL:' . $extKey . '/Resources/Private/Language/locallang_' . $typeName . '_be.xlf:';
        $frontendLanguageFilePrefix = 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:';

        // Add the CType 'fs_slider'
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTcaSelectItem(
            'tt_content',
            'CType',
            [
                $customLanguageFilePrefix . 'wizard.title',
                $prefix . $typeName,
                'content-image'
            ],
            'textmedia',
            'after'
        );
        $typeIconClasses = &$GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes'];
        $typeIconClasses[$prefix . $typeName] = $typeIconClasses['textmedia'];

        // Define what fields to display
        $GLOBALS['TCA']['tt_content']['types'][$prefix . $typeName] = [
            'showitem' => '
                --div--;' . $frontendLanguageFilePrefix . 'tabs.text,
                --palette--;' . $frontendLanguageFilePrefix . 'palette.general;general,
                --palette--;' . $frontendLanguageFilePrefix . 'palette.header;header,
                bodytext,
                --div--;' . $frontendLanguageFilePrefix . 'tabs.images,
                image
            ',
            'columnsOverrides' => [
                'image' => [
                    'config' => [
                        'minitems' => 1,
                        'maxitems' => 1
                    ]
                ]
            ]
        ];

        // Add a flexform to the fs_slider CType
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
            '',
            'FILE:' . $extKey . '/Configuration/FlexForms/' . $prefix . $typeName . '_flexform.xml',
            $prefix . $typeName
        );
    }
}