<?php

$applicationContext = (string)\TYPO3\CMS\Core\Core\Environment::getContext();
if ($applicationContext === 'Development') {
    $GLOBALS['TYPO3_CONF_VARS'] = array_replace_recursive(
        $GLOBALS['TYPO3_CONF_VARS'],
        [
            'DB' => [
                'Connections' => [
                    'Default' => [
                        'dbname' => 'fw_grafing',
                        'host' => 'localhost',
                        'password' => 'Ugsa103@',
                        'user' => 'cg_grafing'
                    ]
                ]
            ],
            'SYS'  => [
                'trustedHostsPattern' => '.*.*',
                'devIPmask'           => '*',
                'displayErrors'       => 1,
            ]
        ]
    );
}

if (getenv('IS_DDEV_PROJECT') === 'true') {
    $GLOBALS['TYPO3_CONF_VARS'] = array_replace_recursive(
        $GLOBALS['TYPO3_CONF_VARS'],
        [
            'DB'   => [
                'Connections' => [
                    'Default' => [
                        'dbname'   => 'db',
                        'driver'   => 'pdo_mysql',
                        'host'     => 'db',
                        'password' => 'db',
                        'port'     => '3306',
                        'user'     => 'db',
                    ],
                ],
            ],
            // This GFX configuration allows processing by installed ImageMagick 6
            'GFX'  => [
                'processor'          => 'ImageMagick',
                'processor_path'     => '/usr/bin/',
                'processor_path_lzw' => '/usr/bin/',
            ],
            // This mail configuration sends all emails to mailhog
            'MAIL' => [
                'transport'              => 'smtp',
                'transport_smtp_encrypt' => false,
                'transport_smtp_server'  => 'localhost:1025',
            ],
            'SYS'  => [
                'trustedHostsPattern' => '.*.*',
                'devIPmask'           => '*',
                'displayErrors'       => 1,
            ],
        ]
    );
}

