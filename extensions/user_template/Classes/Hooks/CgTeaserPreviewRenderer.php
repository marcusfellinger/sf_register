<?php

namespace CGGrafing\Template\Hooks;

/*
 * This file is part of the TYPO3 CMS extension fluid_styled_content.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use TYPO3\CMS\Backend\View\PageLayoutView;
use TYPO3\CMS\Backend\View\PageLayoutViewDrawItemHookInterface;

/**
 * Contains a preview rendering for the page module of CType="cg_teaser"
 */
class CgTeaserPreviewRenderer implements PageLayoutViewDrawItemHookInterface
{
    /**
     * Preprocesses the preview rendering of a content element of type "cg_teaser"
     *
     * @param PageLayoutView $parentObject Calling parent object
     * @param bool $drawItem Whether to draw the item using the default functionality
     * @param string $headerContent Header content
     * @param string $itemContent Item content
     * @param array<mixed> $row Record row of tt_content
     * @return void
     */
    public function preProcess(
        PageLayoutView &$parentObject,
        &$drawItem,
        &$headerContent,
        &$itemContent,
        array &$row
    ) {
        if ($row['CType'] === 'cg_teaser') {
            $itemContent .= '<h3>Teaser: ' . $row['header'] . '</h3>';
            if ($row['image']) {
                $itemContent .= $parentObject->thumbCode($row, 'tt_content', 'image') . '<br />';
            }
            $drawItem = false;
            $headerContent = "";
        }
    }
}
