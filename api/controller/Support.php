<?php
namespace Controller;

use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

class Support
{
    public function getServerTime(Request $request, Response $response, $args)
    {
        $response->getBody()->write(\json_encode(array(
            "success" => true,
            "isLogin" => $request->getAttribute('isLogin'),
            "result" => time() * 1000,
        )));
        return $response;
    }
}
