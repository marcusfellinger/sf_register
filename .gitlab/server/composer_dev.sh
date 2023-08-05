#!/usr/bin/env bash
#NPROC=$(getconf _NPROCESSORS_ONLN)
#apk add --no-cache zlib-dev libpng-dev freetype-dev jpeg-dev libwebp-dev gawk libxpm-dev gd-dev icu-dev
#docker-php-ext-configure gd --enable-gd --with-external-gd --with-freetype --with-jpeg --with-webp --with-xpm
#docker-php-ext-install -j${NPROC} gd pdo_mysql intl
echo composer install --prefer-dist
composer install --prefer-dist
