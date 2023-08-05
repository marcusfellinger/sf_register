<?php
return [
    'BE' => [
        'debug' => true,
        'explicitADmode' => 'explicitAllow',
        'installToolPassword' => '$pbkdf2-sha256$25000$uVF4Ny0tYUE6.llXxEzdAQ$8Aaieeh2TYb3vxO4.hdOJfmsmACoLYOHs3pLF.pF0iM',
        'lockSSL' => true,
        'passwordHashing' => [
            'className' => 'TYPO3\\CMS\\Core\\Crypto\\PasswordHashing\\Pbkdf2PasswordHash',
            'options' => [],
        ],
    ],
    'DB' => [
        'Connections' => [
            'Default' => [
                'charset' => 'utf8mb4',
                'dbname' => 'dbs11195631',
                'driver' => 'mysqli',
                'host' => 'rdbms.strato.de',
                'password' => 'WhcaHUENWDPVCq6k0tau',
                'port' => 3306,
                'tableoptions' => [
                    'charset' => 'utf8mb4',
                    'collate' => 'utf8mb4_unicode_ci',
                ],
                'user' => 'dbu225894',
            ],
        ],
    ],
    'EXT' => [],
    'EXTCONF' => [
        'helhum-typo3-console' => [
            'initialUpgradeDone' => '11.5',
        ],
        'lang' => [
            'availableLanguages' => [
                'de',
            ],
        ],
    ],
    'EXTENSIONS' => [
        'autoloader' => [
            'enableAutoloaderClearCacheInProduction' => '0',
            'enableLanguageFileOnTableBase' => '0',
            'smartObjectClassLoadingIgnorePattern' => '',
        ],
        'backend' => [
            'backendFavicon' => '',
            'backendLogo' => '',
            'loginBackgroundImage' => '',
            'loginFootnote' => '',
            'loginHighlightColor' => '',
            'loginLogo' => '',
            'loginLogoAlt' => '',
        ],
        'calendarize' => [
            'disableDateInSpeakingUrl' => '0',
            'disableDefaultEvent' => '0',
            'frequencyLimitPerItem' => '300',
            'respectTimesInTimeFrameConstraints' => '0',
            'tillDays' => '',
            'tillDaysPast' => '',
            'tillDaysRelative' => '',
        ],
        'container_elements' => [
            'autoLoadStaticTS' => '1',
            'showDeprecatedItems' => '1',
        ],
        'extensionmanager' => [
            'automaticInstallation' => '1',
            'offlineMode' => '0',
        ],
        'fal_securedownload' => [
            'force_download' => '',
            'force_download_for_ext' => '',
            'login_redirect_url' => '',
            'no_access_redirect_url' => '',
            'resumable_download' => '1',
            'track_downloads' => '0',
        ],
        'news' => [
            'advancedMediaPreview' => '1',
            'archiveDate' => 'date',
            'categoryBeGroupTceFormsRestriction' => '0',
            'categoryRestriction' => '',
            'contentElementPreview' => '1',
            'contentElementRelation' => '1',
            'dateTimeNotRequired' => '0',
            'hidePageTreeForAdministrationModule' => '0',
            'manualSorting' => '0',
            'mediaPreview' => 'false',
            'prependAtCopy' => '1',
            'resourceFolderImporter' => '/news_import',
            'rteForTeaser' => '0',
            'showAdministrationModule' => '1',
            'showImporter' => '0',
            'slugBehaviour' => 'unique',
            'storageUidImporter' => '1',
            'tagPid' => '1',
        ],
        'recaptcha' => [
            'api_server' => 'https://www.google.com/recaptcha/api.js',
            'enforceCaptcha' => '0',
            'lang' => '',
            'private_key' => '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
            'public_key' => '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            'robotMode' => '0',
            'verify_server' => 'https://www.google.com/recaptcha/api/siteverify',
        ],
        'static_info_tables' => [
            'constraints' => [
                'depends' => [
                    'extbase' => '11.5.0-11.5.99',
                    'extensionmanager' => '11.5.0-11.5.99',
                    'typo3' => '11.5.0-11.5.99',
                ],
            ],
            'enableManager' => '0',
            'entities' => [
                'Country',
                'CountryZone',
                'Currency',
                'Language',
                'Territory',
            ],
            'tables' => [
                'static_countries' => [
                    'isocode_field' => [
                        'cn_iso_##',
                    ],
                    'label_fields' => [
                        'cn_short_##' => [
                            'mapOnProperty' => 'shortName##',
                        ],
                        'cn_short_en' => [
                            'mapOnProperty' => 'shortNameEn',
                        ],
                    ],
                ],
                'static_country_zones' => [
                    'isocode_field' => [
                        'zn_code',
                        'zn_country_iso_##',
                    ],
                    'label_fields' => [
                        'zn_name_##' => [
                            'mapOnProperty' => 'name##',
                        ],
                        'zn_name_local' => [
                            'mapOnProperty' => 'localName',
                        ],
                    ],
                ],
                'static_currencies' => [
                    'isocode_field' => [
                        'cu_iso_##',
                    ],
                    'label_fields' => [
                        'cu_name_##' => [
                            'mapOnProperty' => 'name##',
                        ],
                        'cu_name_en' => [
                            'mapOnProperty' => 'nameEn',
                        ],
                    ],
                ],
                'static_languages' => [
                    'isocode_field' => [
                        'lg_iso_##',
                        'lg_country_iso_##',
                    ],
                    'label_fields' => [
                        'lg_name_##' => [
                            'mapOnProperty' => 'name##',
                        ],
                        'lg_name_en' => [
                            'mapOnProperty' => 'nameEn',
                        ],
                    ],
                ],
                'static_territories' => [
                    'isocode_field' => [
                        'tr_iso_##',
                    ],
                    'label_fields' => [
                        'tr_name_##' => [
                            'mapOnProperty' => 'name##',
                        ],
                        'tr_name_en' => [
                            'mapOnProperty' => 'nameEn',
                        ],
                    ],
                ],
            ],
            'version' => '11.5.3',
        ],
    ],
    'FE' => [
        'debug' => true,
        'passwordHashing' => [
            'className' => 'TYPO3\\CMS\\Core\\Crypto\\PasswordHashing\\Pbkdf2PasswordHash',
            'options' => [],
        ],
    ],
    'GFX' => [
        'processor' => 'ImageMagick',
        'processor_allowTemporaryMasksAsPng' => false,
        'processor_colorspace' => 'sRGB',
        'processor_effects' => true,
        'processor_enabled' => true,
        'processor_path' => '/usr/bin/',
        'processor_path_lzw' => '/usr/bin/',
    ],
    'LOG' => [
        'TYPO3' => [
            'CMS' => [
                'deprecations' => [
                    'writerConfiguration' => [
                        'notice' => [
                            'TYPO3\CMS\Core\Log\Writer\FileWriter' => [
                                'disabled' => false,
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'MAIL' => [
        'transport' => 'sendmail',
        'transport_sendmail_command' => '/usr/sbin/sendmail -t -i ',
        'transport_smtp_encrypt' => '',
        'transport_smtp_password' => '',
        'transport_smtp_server' => '',
        'transport_smtp_username' => '',
    ],
    'SYS' => [
        'caching' => [
            'cacheConfigurations' => [
                'hash' => [
                    'backend' => 'TYPO3\\CMS\\Core\\Cache\\Backend\\Typo3DatabaseBackend',
                ],
                'imagesizes' => [
                    'backend' => 'TYPO3\\CMS\\Core\\Cache\\Backend\\Typo3DatabaseBackend',
                ],
                'pages' => [
                    'backend' => 'TYPO3\\CMS\\Core\\Cache\\Backend\\Typo3DatabaseBackend',
                ],
                'pagesection' => [
                    'backend' => 'TYPO3\\CMS\\Core\\Cache\\Backend\\Typo3DatabaseBackend',
                ],
                'rootline' => [
                    'backend' => 'TYPO3\\CMS\\Core\\Cache\\Backend\\Typo3DatabaseBackend',
                ],
            ],
        ],
        'devIPmask' => '*',
        'displayErrors' => 1,
        'encryptionKey' => 'be7f33f62dc93300865fa7a6a8838d6629f01de863e7720881275d3f0c8352d554a7c697cd4d9dd0b4f1b3b9f1f3e541',
        'exceptionalErrors' => 12290,
        'features' => [
            'unifiedPageTranslationHandling' => true,
        ],
        'sitename' => 'Christliche Gemeinde Grafing',
        'systemMaintainers' => [
            1,
            3,
            3,
        ],
    ],
];
