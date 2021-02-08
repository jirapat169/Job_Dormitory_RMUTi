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
            "INSERT INTO `electric_bill`
            (   `room_number`,
                `value_meter`,
                `month_read`,
                `user_edit`,
                `electric_cost_unit`,
                `electric_cost_old`,
                `electric_cost_month`,
                `electric_cost_left`,
                `electric_cost_add`,
                `isPay`
            )
            VALUES(
                '" . $rawdata->room_number . "',
                '" . $rawdata->value_meter . "',
                '" . $rawdata->month_read . "',
                '" . $rawdata->user_edit . "',
                '" . $rawdata->electric_cost_unit . "',
                '" . $rawdata->electric_cost_old . "',
                '" . $rawdata->electric_cost_month . "',
                '" . $rawdata->electric_cost_left . "',
                '" . $rawdata->electric_cost_add . "',
                '" . $rawdata->isPay . "'
                )
            ON DUPLICATE KEY UPDATE
            value_meter='" . $rawdata->value_meter . "',
            month_read='" . $rawdata->month_read . "',
            user_edit='" . $rawdata->user_edit . "',
            electric_cost_unit='" . $rawdata->electric_cost_unit . "',
            electric_cost_old='" . $rawdata->electric_cost_old . "',
            electric_cost_month='" . $rawdata->electric_cost_month . "',
            electric_cost_left='" . $rawdata->electric_cost_left . "',
            electric_cost_add='" . $rawdata->electric_cost_add . "',
            isPay='" . $rawdata->isPay . "'
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

    public function searchStudent(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `student`
            LEFT JOIN `room_student`
            ON `student`.`std_code` = `room_student`.`std_code`
            WHERE `student`.`std_code` = '" . $args["studentId"] . "'
            AND `student`.`status` = '1'
            LIMIT 1
            "
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function searchRoom(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT `electric_bill`.*,
            GROUP_CONCAT(DISTINCT `student`.`std_code` SEPARATOR ',') as std_codeStd,
            GROUP_CONCAT(DISTINCT `student`.`nameTitle`, `student`.`fname`, ' ', `student`.`lname`  SEPARATOR ',') as std_name,
            `user`.`nameTitle` as admin_prename,
            `user`.`fname` as admin_fname,
            `user`.`lname` as admin_lname
            FROM `electric_bill`
            LEFT JOIN `room_student`
            ON `room_student`.`room_number` LIKE '" . $args["roomNumber"] . "%'
            LEFT JOIN `student`
            ON `student`.`std_code` = `room_student`.`std_code`
            LEFT JOIN `user`
            ON `electric_bill`.`user_edit` = `user`.`username`
            WHERE `electric_bill`.`room_number` = '" . $args["roomNumber"] . "'
            GROUP BY `electric_bill`.`month_read`
            ORDER BY `electric_bill`.`month_read` DESC, `std_codeStd` ASC
            "
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getCostValue(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `cost_value`"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function setCostValue(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "INSERT INTO `cost_value`
            (   `dormitory`,
                `electric_first`,
                `electric_unit`,
                `id`,
                `insurance`,
                `room_type`,
                `term`,
                `water_first`
            )
            VALUES(
                '" . $rawdata->dormitory . "',
                '" . $rawdata->electric_first . "',
                '" . $rawdata->electric_unit . "',
                '" . $rawdata->id . "',
                '" . $rawdata->insurance . "',
                '" . $rawdata->room_type . "',
                '" . $rawdata->term . "',
                '" . $rawdata->water_first . "'
                )
            ON DUPLICATE KEY UPDATE
            dormitory='" . $rawdata->dormitory . "',
            electric_first='" . $rawdata->electric_first . "',
            electric_unit='" . $rawdata->electric_unit . "',
            insurance='" . $rawdata->insurance . "',
            room_type='" . $rawdata->room_type . "',
            term='" . $rawdata->term . "',
            water_first='" . $rawdata->water_first . "'");

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getStudentCost(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `student_cost` WHERE studentId = '" . $args['studentId'] . "'"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function setStudentCost(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "INSERT INTO `student_cost`
            (   `receiptNumber`,
                `studentId`,
                `dorimitory`,
                `electric_first`,
                `water_first`,
                `insurance`,
                `cashier`,
                `term`
            )
            VALUES(
                '" . $rawdata->receiptNumber . "',
                '" . $rawdata->studentId . "',
                '" . $rawdata->dorimitory . "',
                '" . $rawdata->electric_first . "',
                '" . $rawdata->water_first . "',
                '" . $rawdata->insurance . "',
                '" . $rawdata->cashier . "',
                '" . $rawdata->term . "'
                )
            ON DUPLICATE KEY UPDATE
            studentId='" . $rawdata->studentId . "',
            dorimitory='" . $rawdata->dorimitory . "',
            electric_first='" . $rawdata->electric_first . "',
            water_first='" . $rawdata->water_first . "',
            insurance='" . $rawdata->insurance . "',
            cashier='" . $rawdata->cashier . "',
            term='" . $rawdata->term . "'");

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function delStudentCost(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        if (!empty($args["receiptNumber"])) {
            $query = $db->query("DELETE FROM student_cost WHERE `receiptNumber`='" . $args["receiptNumber"] . "'");
        } else {
            $query = array(
                "isQuery" => false,
                "message" => "ไม่พบ data",
            );
        }
        $response->getBody()->write(\json_encode($query));
        return $response;

        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `student_cost` WHERE studentId = '" . $args['studentId'] . "'"
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function setElectricBill(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "UPDATE `electric_bill`
            SET isPay='1',
            receiptNumber='" . $rawdata->receiptNumber . "'
            WHERE room_number='" . $rawdata->room_number . "'
            AND month_read='" . $rawdata->month_read . "'");

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getAllStudentCost(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `student_cost`
            LEFT JOIN  `student`
            ON `student_cost`.`studentId` = `student`.`std_code`
            LEFT JOIN `room_student`
            ON `student_cost`.`studentId` = `room_student`.`std_code`
            "
        );

        $response->getBody()->write(\json_encode($query));
        return $response;
    }

    public function getAllElectricCost(Request $request, Response $response, $args)
    {
        $db = new \Tools\Database();
        $query = $db->query(
            "SELECT * FROM `electric_bill`"
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

// SELECT `room_student`.* FROM `room_student`
//             WHERE `room_student`.`room_number` LIKE '" . $args["roomNumber"] . "%'
