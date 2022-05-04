<?php

declare(strict_types=1);

namespace CGGrafing\Template\Composer;

use Composer\Installer\InstallationManager;
use Composer\Package\PackageInterface;
use Composer\Repository\RepositoryManager;
use Composer\Script\Event;
use RuntimeException;
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

        /** @var PackageInterface $templatePackage */
        $package = $repositoryManager->findPackage('cggrafing/user-template', '*');
        if($package) {
            $packagePath = $installationManager->getInstallPath($package);
            $packagePath = realpath($packagePath);
            $publicPath = $packagePath . DIRECTORY_SEPARATOR . 'Resources' . DIRECTORY_SEPARATOR . 'Public';
            $privatePath = $packagePath . DIRECTORY_SEPARATOR . 'Resources' . DIRECTORY_SEPARATOR . 'Private';
            $publicVendorPath = $publicPath . DIRECTORY_SEPARATOR . 'Vendor';
            $privateVendorPath = $privatePath . DIRECTORY_SEPARATOR . 'Vendor' . DIRECTORY_SEPARATOR . 'bootstrap';
            $this->mkdirp($publicVendorPath);
            $this->mkdirp($privateVendorPath);

            /** @var PackageInterface $bootstrapPackage */
            $bootstrapPackage = $repositoryManager->findPackage('twbs/bootstrap', '*');
            $bootstrapPath = $installationManager->getInstallPath($bootstrapPackage);
            $bootstrapPath = realpath($bootstrapPath);
            $distPath = $bootstrapPath . DIRECTORY_SEPARATOR . 'dist';
            $this->linkFiles($distPath, $publicVendorPath);
            $this->linkFile($bootstrapPath, $privateVendorPath, 'scss');
        }

        return true;
    }

    private function linkFiles($sourcePath, $targetPath): void
    {
        $files = array_diff(scandir($sourcePath), array('.', '..'));
        foreach ($files as $file) {
            $this->linkFile($sourcePath, $targetPath, $file);
        }
    }

    private function mkdirp($directory): void
    {
        if (!is_dir($directory) && !mkdir($directory, 0777, true) && !is_dir($directory)) {
            throw new RuntimeException(sprintf('Directory "%s" was not created', $directory));
        }
    }

    private function getRelativePath($from, $to): string
    {
        // some compatibility fixes for Windows paths
        $from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
        $to   = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
        $from = str_replace('\\', '/', $from);
        $to   = str_replace('\\', '/', $to);

        $from     = explode('/', $from);
        $to       = explode('/', $to);
        $relPath  = $to;

        foreach($from as $depth => $dir) {
            // find first non-matching dir
            if($dir === $to[$depth]) {
                // ignore this directory
                array_shift($relPath);
            } else {
                // get number of remaining dirs to $from
                $remaining = count($from) - $depth;
                if($remaining > 1) {
                    // add traversals up to first matching dir
                    $padLength = (count($relPath) + $remaining - 1) * -1;
                    $relPath = array_pad($relPath, $padLength, '..');
                    break;
                }
                $relPath[0] = './' . $relPath[0];
            }
        }
        return implode('/', $relPath);
    }

    /**
     * @param $targetPath
     * @param $file
     * @param $sourcePath
     * @return void
     */
    private function linkFile($sourcePath, $targetPath, $file): void
    {
        $link = $targetPath . DIRECTORY_SEPARATOR . $file;
        $target = $sourcePath . DIRECTORY_SEPARATOR . $file;
        $target = $this->getRelativePath($link, $target);
        echo "$target => $link\n";
        if(file_exists($link)) {
            unlink($link);
        }
        symlink($target, $link);
    }
}
