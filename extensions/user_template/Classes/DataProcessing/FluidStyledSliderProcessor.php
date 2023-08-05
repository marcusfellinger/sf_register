<?php

declare(strict_types=1);

namespace CGGrafing\Template\DataProcessing;

/*
 * This file is part of the TYPO3 CMS extension user_template.
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

use TYPO3\CMS\Core\Imaging\ImageManipulation\CropVariantCollection;
use TYPO3\CMS\Core\Resource\FileInterface;
use TYPO3\CMS\Core\Resource\FileReference;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

/**
 * This data processor will calculate the width of a slider
 * based on the included images and is used for the CType "fs_slider"
 */
class FluidStyledSliderProcessor implements DataProcessorInterface
{
    /**
     * Process data for the CType "fs_slider"
     *
     * @param ContentObjectRenderer $cObj The content object renderer, which contains data of the content element
     * @param array<mixed> $contentObjectConfiguration The configuration of Content Object
     * @param array<mixed> $processorConfiguration The configuration of this processor
     * @param array<mixed> $processedData Key/value store of processed data (e.g. to be passed to a Fluid View)
     * @return array<mixed> the processed data as key/value store
     */
    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ) {
        // Calculating the total width of the slider
        $sliderWidth = 0;
        if ((int)$processedData['data']['imagewidth'] > 0) {
            $sliderWidth = (int)$processedData['data']['imagewidth'];
        } else {
            $files = $processedData['files'];
            /** @var FileReference $file */
            foreach ($files as $file) {
                $fileWidth = $this->getCroppedWidth($file);
                $sliderWidth = $fileWidth > $sliderWidth ? $fileWidth : $sliderWidth;
            }
        }
        // This will be available in fluid with {slider.options}
        $processedData['slider']['options'] = json_encode(
            $this->getOptionsFromFlexFormData($processedData['data']),
            JSON_THROW_ON_ERROR
        );
        // This will be available in fluid with {slider.width}
        $processedData['slider']['width'] = $sliderWidth + 80;
        return $processedData;
    }

    /**
     * When retrieving the width for a media file
     * a possible cropping needs to be taken into account.
     *
     * @return int
     */
    protected function getCroppedWidth(FileInterface $fileObject)
    {
        if (!$fileObject->hasProperty('crop') || empty($fileObject->getProperty('crop'))) {
            return (int)$fileObject->getProperty('width');
        }
        $cropString = $fileObject->getProperty('crop');
        // TYPO3 7LTS
        $croppingConfiguration = json_decode($cropString, true, 512, JSON_THROW_ON_ERROR);
        if (!empty($croppingConfiguration['width'])) {
            return (int)$croppingConfiguration['width'];
        }
        // TYPO3 8LTS
        $cropVariantCollection = CropVariantCollection::create((string)$cropString);
        $width = 0;
        foreach (array_keys($croppingConfiguration) as $cropVariant) {
            $cropArea = $cropVariantCollection->getCropArea((string)$cropVariant);
            if ($cropArea->isEmpty()) {
                continue;
            }
            $cropResult = json_decode(
                (string)$cropArea->makeAbsoluteBasedOnFile($fileObject),
                true,
                512,
                JSON_THROW_ON_ERROR
            );
            if (!empty($cropResult['width']) && (int)$cropResult['width'] > $width) {
                $width = (int)$cropResult['width'];
            }
        }
        return $width;
    }

    /**
     * @param array<mixed> $row
     * @return array<mixed>
     */
    protected function getOptionsFromFlexFormData(array $row)
    {
        $options = [];
        /** @var FlexFormService $flexFormService */
        $flexFormService = GeneralUtility::makeInstance(FlexFormService::class);
        $flexFormAsArray = $flexFormService->convertFlexFormContentToArray($row['pi_flexform']);
        foreach ($flexFormAsArray['options'] as $optionKey => $optionValue) {
            $options[$optionKey] = match ($optionValue) {
                '1' => true,
                '0' => false,
                default => $optionValue,
            };
        }
        return $options;
    }
}
