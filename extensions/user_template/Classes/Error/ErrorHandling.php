<?php

namespace CGGrafing\Template\Error;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Error\PageErrorHandler\PageContentErrorHandler;
use TYPO3\CMS\Core\Error\PageErrorHandler\PageErrorHandlerInterface;

class ErrorHandling implements PageErrorHandlerInterface
{
    public function __construct(int $statusCode, array $configuration)
    {
        $configuration['errorContentSource'] = '/';
        parent::__construct($statusCode, $configuration);
    }

    public function handlePageError(
        ServerRequestInterface $request,
        string $message,
        array $reasons = []
    ): ResponseInterface {
        return parent::handlePageError($request, $message, $reasons);
    }
}