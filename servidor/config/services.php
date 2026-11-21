<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    | Inicio de sesión con Google (ADR-0005). Los clientes OAuth son de cada entorno y van en su .env (ADR-0012):
    | el idToken se acepta solo si su destinatario (aud) es uno de ellos. Son identificadores públicos, no secretos.
    */
    'google' => [
        'clientes' => array_values(array_filter(array_map(
            'trim',
            explode(',', (string) env('GOOGLE_CLIENTES_OAUTH', '')),
        ))),
        // Las llaves públicas con que Google firma sus idTokens, en formato JWK.
        'llaves' => env('GOOGLE_DIRECCION_DE_LLAVES', 'https://www.googleapis.com/oauth2/v3/certs'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
