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

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

/**
 * Class Slider
 * @package CGGrafing\Template\ContentElement
 */
class Slider extends AbstractElement
{
    /**
     *
     */
    public function getConfiguration(): void
    {
        $typeName = 'slider';
        $prefix = 'fs_';
        $extKey = 'EXT:user_template';
        $languageFilePrefix = 'LLL:' . $extKey . '/Resources/Private/Language/Database.xlf:';
        $customLanguagePrefix = 'LLL:' . $extKey . '/Resources/Private/Language/locallang_' . $typeName . '_be.xlf:';
        $frontendLanguagePrefix = 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:';

        // Add the CType 'fs_slider'
        ExtensionManagementUtility::addTcaSelectItem(
            'tt_content',
            'CType',
            [
                $customLanguagePrefix . 'wizard.title',
                $prefix . $typeName,
                'content-image'
            ],
            'textmedia',
            'after'
        );
        $typeiconClasses = &$GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes'];
        $typeiconClasses[$prefix . $typeName] = $typeiconClasses['textmedia'];

        // Define what fields to display
        $GLOBALS['TCA']['tt_content']['types'][$prefix . $typeName] = [
            'showitem' => '
                --palette--;' . $frontendLanguagePrefix . 'palette.general;general,
                --palette--;' . $languageFilePrefix . 'tt_content.palette.mediaAdjustments;mediaAdjustments,
                pi_flexform,
                --div--;' . $customLanguagePrefix . 'tca.tab.sliderElements,
                 assets
            ',
            'columnsOverrides' => [
                'media' => [
                    'label' => $languageFilePrefix . 'tt_content.media_references',
                    'config' => ExtensionManagementUtility::getFileFieldTCAConfig(
                        'media',
                        [
                            'appearance' => [
                                'createNewRelationLinkTitle' => $languageFilePrefix .
                                    'tt_content.media_references.addFileReference'
                            ],
                            // custom configuration for displaying fields in the overlay/reference table
                            // behaves the same as the image field.
                            'foreign_types' => $GLOBALS['TCA']['tt_content']['columns']['image']['config']['overrideChildTca']['types']
                        ],
                        $GLOBALS['TYPO3_CONF_VARS']['SYS']['mediafile_ext']
                    )
                ]
            ]
        ];

        // Add a flexform to the fs_slider CType
        ExtensionManagementUtility::addPiFlexFormValue(
            '',
            'FILE:' . $extKey . '/Configuration/FlexForms/' . $prefix . $typeName . '_flexform.xml',
            $prefix . $typeName
        );
    }
}