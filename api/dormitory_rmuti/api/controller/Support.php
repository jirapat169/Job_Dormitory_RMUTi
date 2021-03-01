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

    public function getStudentUsers(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `user`
            INNER JOIN `student` ON `user`.`username` = `student`.`std_code`
            WHERE `user`.`type` = '0' AND `student`.`status` = '1'"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function addUserData(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "INSERT INTO `user`
            (`username`,
             `password`,
             `nameTitle`,
             `fname`,
             `lname`,
             `personalId`,
             `role`,
             `type`)
             VALUES
             ('" . $rawdata->username . "',
             '" . md5($rawdata->password) . "',
             '" . $rawdata->nameTitle . "',
             '" . $rawdata->fname . "',
             '" . $rawdata->lname . "',
             '" . $rawdata->personalId . "',
             '" . $rawdata->role . "',
             '" . $rawdata->type . "')"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function updateUserData(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "UPDATE `user` SET
            `nameTitle` = '" . $rawdata->nameTitle . "',
            `fname` = '" . $rawdata->fname . "',
            `lname` = '" . $rawdata->lname . "',
            `personalId` = '" . $rawdata->personalId . "',
            `type` = '" . $rawdata->type . "'
            WHERE `user`.`username` = '" . $rawdata->username . "'"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function updateUserDataWithPassword(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "UPDATE `user` SET
            `password` = '" . md5($rawdata->password) . "',
            `nameTitle` = '" . $rawdata->nameTitle . "',
            `fname` = '" . $rawdata->fname . "',
            `lname` = '" . $rawdata->lname . "',
            `personalId` = '" . $rawdata->personalId . "',
            `type` = '" . $rawdata->type . "'
            WHERE `user`.`username` = '" . $rawdata->username . "'"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function updateStudentData(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "UPDATE `student` SET
            `nameTitle` = '" . $rawdata->nameTitle . "',
            `fname` = '" . $rawdata->fname . "',
            `lname` = '" . $rawdata->lname . "'
            WHERE `student`.`std_code` = '" . $rawdata->username . "'"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function updateStudentPassword(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $output = null;
        $updatePassword = $db->query(
            "UPDATE `user` SET
            `password` = '" . md5($rawdata->password) . "'
            WHERE `user`.`username` = '" . $rawdata->username . "'"
        );
        $updateData = $db->query(
            "UPDATE `student` SET
            `nameTitle` = '" . $rawdata->nameTitle . "',
            `fname` = '" . $rawdata->fname . "',
            `lname` = '" . $rawdata->lname . "',
            `type` = '" . $rawdata->type . "'
            WHERE `student`.`std_code ` = '" . $rawdata->username . "'"
        );

        $output = array(
            "updatePassword" => $updatePassword,
            "updateData" => $updateData,
        );

        $response->getBody()->write(\json_encode($output));
        return $response;
    }
}
