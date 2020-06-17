<?php
namespace Controller;

use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

class Admin
{
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

// INSERT INTO `electric_bill` (`room_number`, `value_meter`, `month_read`)
// VALUES('1202', '100', '6/2020')
// ON DUPLICATE KEY UPDATE
// value_meter='100', month_read='6/2020'

// SELECT * FROM `electric_bill`
// WHERE `month_read` IN (SELECT * FROM
//     (SELECT DISTINCT `month_read`
//     FROM `electric_bill`
//     WHERE `month_read` <= '07/2020'
//     ORDER BY `month_read` DESC LIMIT 2)
//     AS month
// )
