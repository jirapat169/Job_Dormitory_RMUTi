<?php
namespace Middleware;

use \Exception;
use \Firebase\JWT\JWT;

class JWTverify
{
    public function __invoke($request, $response, $next)
    {
        try {
            $data = JWT::decode($_REQUEST["token"], JWT_KEY, array('HS256'));
            $ip_address = $request->getAttribute('ip_address');
            $time = time();

            if ($data->time_end <= $time || $data->ip_address != $ip_address) {
                $response->getBody()->write(\json_encode(
                    array(
                        "success" => false,
                        "isLogin" => false,
                        "message" => "เซสชั่นหมดอายุ",
                    )
                ));
            } else {
                $request = $request->withAttribute('isLogin', true);
                $response = $next($request, $response);
            }
        } catch (\Exception $e) {
            $response->getBody()->write(\json_encode(
                array(
                    "success" => false,
                    "isLogin" => false,
                    "message" => "การยืนยันตัวตนผิดพลาด",
                    "token" => $_REQUEST["token"],
                )
            ));
        }

        // $response->getBody()->write('AFTER');

        return $response;
    }
}
