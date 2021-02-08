<?php

//->add(new \Middleware\JWTverity());

$app->get('/', \Controller\Home::class . ":index")->add(new \Middleware\JWTverify());

$app->group('/user', function ($app) {
    $app->get('/getSSO', \Controller\User::class . ":getSSO");
    $app->post('/login', \Controller\User::class . ":login");
    $app->post('/register', \Controller\User::class . ":register");
    $app->post('/resetPassword', \Controller\User::class . ":resetPassword");
    $app->post('/setElectricBillSeen', \Controller\User::class . ":setElectricBillSeen");
});

$app->group('/support', function ($app) {
    $app->get('/getServerTime', \Controller\Support::class . ":getServerTime")->add(new \Middleware\JWTverify());
    $app->get('/getRoom', \Controller\Support::class . ":getRoom")->add(new \Middleware\JWTverify());
    $app->get('/getStudentQuestion', \Controller\Support::class . ":getStudentQuestion");
    $app->post('/studentQuestion', \Controller\Support::class . ":studentQuestion");
    $app->post('/adminAnswer', \Controller\Support::class . ":adminAnswer");
    $app->get('/getAdminType', \Controller\Support::class . ":getAdminType");
    $app->get('/getAdminUsers', \Controller\Support::class . ":getAdminUsers");
});

$app->group('/admin', function ($app) {
    $app->post('/setCurrentMeter', \Controller\Admin::class . ":setCurrentMeter")->add(new \Middleware\JWTverify());
    $app->get('/getCurrentMeter/{month}/{year}', \Controller\Admin::class . ":getCurrentMeter")->add(new \Middleware\JWTverify());
    $app->get('/getAllMeter', \Controller\Admin::class . ":getAllMeter")->add(new \Middleware\JWTverify());
    $app->get('/searchStudent/{studentId}', \Controller\Admin::class . ":searchStudent")->add(new \Middleware\JWTverify());
    $app->get('/searchRoom/{roomNumber}', \Controller\Admin::class . ":searchRoom")->add(new \Middleware\JWTverify());
    $app->get('/getCostValue', \Controller\Admin::class . ":getCostValue")->add(new \Middleware\JWTverify());
    $app->post('/setCostValue', \Controller\Admin::class . ":setCostValue")->add(new \Middleware\JWTverify());
    $app->get('/getStudentCost/{studentId}', \Controller\Admin::class . ":getStudentCost")->add(new \Middleware\JWTverify());
    $app->post('/setStudentCost', \Controller\Admin::class . ":setStudentCost")->add(new \Middleware\JWTverify());
    $app->get('/delStCost/{receiptNumber}', \Controller\Admin::class . ":delStudentCost")->add(new \Middleware\JWTverify());
    $app->post('/setElectricBill', \Controller\Admin::class . ":setElectricBill")->add(new \Middleware\JWTverify());
    $app->get('/getAllStudentCost', \Controller\Admin::class . ":getAllStudentCost")->add(new \Middleware\JWTverify());
    $app->get('/getAllElectricCost', \Controller\Admin::class . ":getAllElectricCost")->add(new \Middleware\JWTverify());
});
