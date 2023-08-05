<?php

namespace CGGrafing\Template\Error;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Error\PageErrorHandler\PageErrorHandlerInterface;
use TYPO3\CMS\Core\Http\RedirectResponse;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class ErrorHandling implements PageErrorHandlerInterface
{
    /**
     * @param ServerRequestInterface $request
     * @param string $message
     * @param array $reasons
     * @return ResponseInterface
     * @throws \TYPO3\CMS\Core\Context\Exception\AspectNotFoundException
     * @inheritdoc
     */
    public function handlePageError(
        ServerRequestInterface $request,
        string $message,
        array $reasons = []
    ): ResponseInterface {
        //check whether user is logged in
        $context = GeneralUtility::makeInstance(Context::class);
        if ($context->getPropertyFromAspect('frontend.user', 'isLoggedIn')) {
            //show page with info that the access restricted page can't be visited because of missing access rights
            return new RedirectResponse('/anmelden?return_url=' . $request->getUri()->getPath(), 403);
        }
        return new RedirectResponse('/anmelden?return_url=' . $request->getUri()->getPath(), 403);
    }
}
