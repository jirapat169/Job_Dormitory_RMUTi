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

    public function getRoom(Request $request, Response $response, $args)
    {

        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT DISTINCT SUBSTRING(room_number, 1, 4) as room_number FROM `room` ORDER BY `room_number`"
        );
        $response->getBody()->write(\json_encode(array(
            "ip_address" => $request->getAttribute('ip_address'),
            "isLogin" => $request->getAttribute('isLogin'),
            "result" => $query,
        )));
        return $response;
    }
}
