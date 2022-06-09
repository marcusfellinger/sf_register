<?php

namespace CGGrafing\Template\ContentObject\Exception;

use TYPO3\CMS\Frontend\ContentObject\AbstractContentObject;
use TYPO3\CMS\Frontend\ContentObject\Exception\ExceptionHandlerInterface;

class DebugExceptionHandler extends \TYPO3\CMS\Core\Error\DebugExceptionHandler implements ExceptionHandlerInterface
{

    public function handle(
        \Exception $exception,
        AbstractContentObject $contentObject = null,
        $contentObjectConfiguration = []
    ) {
        $this->handleException($exception);
    }
}
