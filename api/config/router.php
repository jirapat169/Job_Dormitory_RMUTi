<?php

//->add(new \Middleware\JWTverity());

$app->get('/', \Controller\Home::class . ":index")->add(new \Middleware\JWTverify());

$app->group('/user', function ($app) {
    $app->get('/getSSO', \Controller\User::class . ":getSSO");
    $app->post('/login', \Controller\User::class . ":login");
    $app->post('/register', \Controller\User::class . ":register");
    $app->post('/resetPassword', \Controller\User::class . ":resetPassword");
});

$app->group('/support', function ($app) {
    $app->get('/getServerTime', \Controller\Support::class . ":getServerTime")->add(new \Middleware\JWTverify());
    $app->get('/getRoom', \Controller\Support::class . ":getRoom")->add(new \Middleware\JWTverify());
});

$app->group('/admin', function ($app) {
    $app->post('/setCurrentMeter', \Controller\Admin::class . ":setCurrentMeter")->add(new \Middleware\JWTverify());
    $app->get('/getCurrentMeter/{month}/{year}', \Controller\Admin::class . ":getCurrentMeter")->add(new \Middleware\JWTverify());
    $app->get('/getAllMeter', \Controller\Admin::class . ":getAllMeter")->add(new \Middleware\JWTverify());
});
