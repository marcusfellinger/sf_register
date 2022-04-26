<?php

declare(strict_types=1);

namespace CGGrafing\Template\Composer;

use Composer\Installer\InstallationManager;
use Composer\Package\PackageInterface;
use Composer\Repository\RepositoryManager;
use Composer\Script\Event;
use TYPO3\CMS\Composer\Plugin\Core\InstallerScript;
use TYPO3\CMS\Composer\Plugin\Core\InstallerScriptsRegistration;
use TYPO3\CMS\Composer\Plugin\Core\ScriptDispatcher;

class InstallerScripts implements InstallerScriptsRegistration, InstallerScript
{
    /**
     * @inheritDoc
     */
    public static function register(Event $event, ScriptDispatcher $scriptDispatcher): void
    {
        $scriptDispatcher->addInstallerScript(
            new static()
        );
    }

    /**
     * @param Event $event
     * @return void
     */
    public function run(Event $event): bool
    {
        $composer = $event->getComposer();

        /** @var InstallationManager $installationManager */
        $installationManager = $composer->getInstallationManager();

        /** @var RepositoryManager $repositoryManager */
        $repositoryManager = $composer->getRepositoryManager();

        /** @var PackageInterface $bootstrapPackage */
        $bootstrapPackage = $repositoryManager->findPackage('twbs/bootstrap', '*');
        $bootstrapPath = $installationManager->getInstallPath($bootstrapPackage);
        $distPath = $bootstrapPath . DIRECTORY_SEPARATOR . 'dist';
        $jsPath = $distPath . DIRECTORY_SEPARATOR . 'js';
        $cssPath = $distPath . DIRECTORY_SEPARATOR . 'css';

        /** @var PackageInterface $templatePackage */
        $package = $repositoryManager->findPackage('cggrafing/user-template', '*');
        $packagePath = $installationManager->getInstallPath($package);
        $publicPath = $packagePath . DIRECTORY_SEPARATOR . 'Resources' . DIRECTORY_SEPARATOR . 'Public';
        $vendorPath = $publicPath . DIRECTORY_SEPARATOR . 'Vendor';
        if (!is_dir($vendorPath) && !mkdir($vendorPath, 0777, true) && !is_dir($vendorPath)) {
            throw new \RuntimeException(sprintf('Directory "%s" was not created', $vendorPath));
        }

        $this->linkFiles($distPath, $vendorPath);

        return true;
    }

    private function linkFiles($sourcePath, $targetPath): void
    {
        $files = array_diff(scandir($sourcePath), array('.', '..'));
        foreach ($files as $file) {
            $target = $sourcePath . DIRECTORY_SEPARATOR . $file;
            $link = $targetPath . DIRECTORY_SEPARATOR . $file;
            echo "$target => $link\n";
            symlink($target, $link);
        }
    }
}
