<?php
namespace Controller;

use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

class Admin
{
    public function setCurrentMeter(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "INSERT INTO `electric_bill` (`room_number`, `value_meter`, `month_read`, `user_edit`)
            VALUES(
                '" . $rawdata->room_number . "',
                '" . $rawdata->value_meter . "',
                '" . $rawdata->month_read . "',
                '" . $rawdata->user_edit . "'
                )
            ON DUPLICATE KEY UPDATE
            value_meter='" . $rawdata->value_meter . "',
            month_read='" . $rawdata->month_read . "',
            user_edit='" . $rawdata->user_edit . "'
            "
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getCurrentMeter(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `electric_bill`
            WHERE `month_read` IN (SELECT * FROM
                (SELECT DISTINCT `month_read`
                FROM `electric_bill`
                WHERE `month_read` <= '" . $args["month"] . "/" . $args["year"] . "'
                ORDER BY `month_read` DESC LIMIT 2)
                AS month
            )"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getAllMeter(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT `electric_bill`.*, `user`.`fname`, `user`.`lname`  FROM `electric_bill`
            LEFT JOIN `user`
            ON `user`.`username` = `electric_bill`.`user_edit`
            "
        );

        $response->getBody()->write(\json_encode($query));
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
