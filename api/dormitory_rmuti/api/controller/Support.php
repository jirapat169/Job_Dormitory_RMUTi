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

    public function getStudentQuestion(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT* FROM qa_student ORDER BY create_at DESC"
        );
        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function studentQuestion(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "INSERT INTO qa_student (question, student)
            VALUES ('" . $rawdata->question . "', '" . $rawdata->student . "')"
        );
        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function adminAnswer(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "UPDATE qa_student
            SET answer='" . $rawdata->answer . "',
            admin='" . $rawdata->admin . "'
            WHERE id='" . $rawdata->id . "'"
        );
        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getAdminType(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `admin_type`"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getAdminUsers(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `user`
            WHERE `user`.`type` != '0'
            AND `user`.`personalId`
            "
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }
}
