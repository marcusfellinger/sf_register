<?php

$EM_CONF['sf_register'] = [
    'title' => 'Frontend User Registration',
    'description' => 'Offers the possibility to maintain the fe_user data in frontend by the user self.',
    'category' => 'fe',
    'author' => 'Sebastian Fischer',
    'author_email' => 'typo3@evoweb.de',
    'author_company' => 'evoWeb',
    'state' => 'stable',
    'clearCacheOnLoad' => true,
    'version' => '12.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '12.2.0-12.9.99',
        ],
        'suggests' => [
            'extender' => '12.0.0-',
            'recaptcha' => '10.0.0-',
        ],
    ],
];
