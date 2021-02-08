<?php
namespace Controller;

use \Firebase\JWT\JWT;
use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

class User
{
    public function login(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $loginUser = $db->query(
            "SELECT * FROM `user`
            LEFT JOIN `admin_type`
            ON `admin_type`.`type_id` = `user`.`type`
            WHERE `username` = '" . $rawdata->username . "'
            LIMIT 1
            "
        );

        if ($loginUser['rowCount'] > 0) {
            if ($loginUser['result'][0]['password'] == md5($rawdata->password)) {
                $payload = array(
                    "username" => $rawdata->username,
                    "ip_address" => $request->getAttribute('ip_address'),
                    "time_end" => time() + ((60 * 60) * 6),
                );

                if ($loginUser['result'][0]['role'] == 'student') {
                    $userData = $db->query(
                        "SELECT *,
                        `branch`.`acronym` as `b_acronym`,
                        `branch`.`name` as `b_name`
                        FROM `student`
                        LEFT JOIN `room_student`
                        ON `student`.`std_code` = `room_student`.`std_code`
                        LEFT JOIN `branch`
                        ON `student`.`branch_code` = `branch`.`branch_code`
                        LEFT JOIN `level`
                        ON `level`.`noLevel` = `branch`.`levels`
                        LEFT JOIN `admin_type`
                        ON `admin_type`.`type_id` = '" . $loginUser['result'][0]['type'] . "'
                        WHERE `student`.`std_code` = '" . $rawdata->username . "'
                        AND  `student`.`status` = '1'
                        LIMIT 1
                        "
                    );
                    if ($userData['rowCount'] > 0) {
                        $loginUser = array(
                            "success" => true,
                            "result" => array_merge(
                                $userData['result'][0],
                                array(
                                    "token" => JWT::encode($payload, JWT_KEY),
                                    "role" => "student",
                                )
                            ),
                            "message" => "เข้าสู่ระบบสำเร็จ",
                        );
                    } else {
                        $loginUser = array(
                            "success" => false,
                            "message" => "สามารถเข้าใช้งานระบบได้เฉพาะนักศึกษาหอพักเท่านั้น",
                        );
                    }
                } else if ($loginUser['result'][0]['role'] == 'admin') {
                    $loginUser = array(
                        "success" => true,
                        "result" => array_merge(
                            $loginUser['result'][0],
                            array(
                                "token" => JWT::encode($payload, JWT_KEY),
                            )
                        ),
                        "message" => "เข้าสู่ระบบสำเร็จ",
                    );
                } else {
                    $loginUser = array(
                        "success" => false,
                        "message" => "ข้อมูลผู้ใช้งานไม่ถูกต้อง",
                    );
                }
            } else {
                $loginUser = array(
                    "success" => false,
                    "message" => "รหัสผ่านไม่ถูกต้อง",
                );
            }
        } else {
            $loginUser = array(
                "success" => false,
                "message" => "ข้อมูลผู้ใช้งานไม่ถูกต้อง",
            );
        }

        $response->getBody()->write(\json_encode($loginUser));
        return $response;
    }

    public function register(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $selectStudent = $db->query(
            "SELECT * FROM `student`
            WHERE `std_code` = '" . $rawdata->std_code . "'
            AND `fname`= '" . $rawdata->fname . "'
            AND `lname`= '" . $rawdata->lname . "'
            AND `status`= '1'
            LIMIT 1"
        );

        if ($selectStudent['rowCount'] > 0) {
            $insertUser = $db->query(
                "INSERT INTO `user`
                (`username`, `password`, `role`, `type`)
                VALUES
                ('" . $rawdata->std_code . "', '" . md5($rawdata->password) . "', 'student', '0')
                "
            );

            if ($insertUser['success'] == false) {
                $insertUser = array(
                    "success" => false,
                    "message" => "รหัสนักศึกษา " . $rawdata->std_code . "\n ถูกใช้งานแล้ว",
                );
            } else {
                $insertUser = array(
                    "success" => true,
                    "message" => "สร้างบัญชีสำเร็จ",
                );
            }
        } else {
            $insertUser = array(
                "success" => false,
                "message" => "ข้อมูลนักศึกษาไม่ถูกต้อง \nโปรดติดต่อเจ้าหน้าที่หอพัก",
            );
        }

        $response->getBody()->write(\json_encode($insertUser));
        return $response;
    }

    public function getSSO(Request $request, Response $response, $args)
    {
        $SSO = json_decode(\file_get_contents('../../../QR_Student/sso/catchJson/' . $_REQUEST["perid"] . '.json'));
        \unlink('../../../QR_Student/sso/catchJson/' . $_REQUEST["perid"] . '.json');
        $db = new \Tools\Database();
        $loginUser = null;

        if ($SSO) {
            if ($SSO->gidNumber[0] == "4500") {
                $userData = $db->query(
                    "SELECT *,
                    `branch`.`acronym` as `b_acronym`,
                    `branch`.`name` as `b_name`,
                    `student`.`fname` as `fname`,
                    `student`.`lname` as `lname`,
                    `student`.`nameTitle` as `nameTitle`,
                    '" . $SSO->personalId[0] . "' as `personalId`
                    FROM `student`
                    LEFT JOIN `room_student`
                    ON `student`.`std_code` = `room_student`.`std_code`
                    LEFT JOIN `faculty`
                    ON `student`.`faculty_code` = `faculty`.`faculty_code`
                    LEFT JOIN `branch`
                    ON `student`.`branch_code` = `branch`.`branch_code`
                    LEFT JOIN `level`
                    ON `level`.`noLevel` = `branch`.`levels`
                    LEFT JOIN `user`
                    ON `user`.`username` = '" . $SSO->studentId[0] . "'
                    LEFT JOIN `admin_type`
                    ON `admin_type`.`type_id` = `user`.`type`
                    WHERE `student`.`std_code` = '" . $SSO->studentId[0] . "'
                    AND  `student`.`status` = '1'
                    LIMIT 1"
                );

                if ($userData['rowCount'] > 0) {
                    $payload = array(
                        "username" => $userData['result'][0]["std_code"],
                        "ip_address" => $request->getAttribute('ip_address'),
                        "time_end" => time() + ((60 * 60) * 6),
                    );

                    $loginUser = array(
                        "success" => true,
                        "result" => array_merge(
                            $userData['result'][0],
                            array(
                                "token" => JWT::encode($payload, JWT_KEY),
                                "role" => "student",
                            )
                        ),
                        "message" => "เข้าสู่ระบบสำเร็จ",
                    );
                } else {
                    $loginUser = array(
                        "success" => false,
                        "message" => "สามารถเข้าใช้งานระบบได้เฉพาะนักศึกษาหอพักเท่านั้น",
                    );
                }
            } else {
                // Other User
                $loginUser = array(
                    "success" => false,
                    "message" => "สามารถเข้าใช้งานระบบได้เฉพาะเจ้าหน้าที่หอพักเท่านั้น",
                );
            }
        } else {
            $loginUser = array(
                "success" => false,
                "message" => "ไม่ได้รับอนุญาติให้เข้าใช้งานระบบ",
            );
        }

        $response->getBody()->write(\json_encode($loginUser));
        return $response;
    }

    public function resetPassword(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $selectStudent = $db->query(
            "SELECT * FROM `student`
            WHERE `std_code` = '" . $rawdata->std_code . "'
            AND `fname`= '" . $rawdata->fname . "'
            AND `lname`= '" . $rawdata->lname . "'
            AND `status`= '1'
            LIMIT 1"
        );

        if ($selectStudent['rowCount'] > 0) {
            $updateUser = $db->query(
                "UPDATE `user`
                SET `password` = '" . md5($rawdata->password) . "'
                WHERE `username`  = '" . $rawdata->std_code . "'"
            );

            if ($updateUser['success'] == false) {
                $updateUser = array(
                    "success" => false,
                    "message" => "ไม่สามารถรีเซ็ตรหัสผ่านได้ \nโปรดติดต่อเจ้าหน้าที่หอพัก",
                );
            } else {
                $updateUser = array(
                    "success" => true,
                    "message" => "รีเซ็ตรหัสผ่านสำเร็จ",
                );
            }
        } else {
            $updateUser = array(
                "success" => false,
                "message" => "ข้อมูลนักศึกษาไม่ถูกต้อง \nโปรดติดต่อเจ้าหน้าที่หอพัก",
            );
        }

        $response->getBody()->write(\json_encode($updateUser));
        return $response;
    }

    public function setElectricBillSeen(Request $request, Response $response, $args)
    {
        $rawdata = \json_decode(file_get_contents("php://input"));
        $db = new \Tools\Database();
        $query = $db->query(
            "UPDATE `electric_bill`
            SET isSeen='1'
            WHERE room_number='" . $rawdata->room_number . "'
            AND month_read='" . $rawdata->month_read . "'");

        $response->getBody()->write(\json_encode($query));
        return $response;
    }
}
