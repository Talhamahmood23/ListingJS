<?php

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    $serverName = "";
    $userName = "";
    $password = "";
    $databaseName = "";
    
    $conn = mysqli_connect($serverName, $userName, $password, $databaseName);
    
    // Check connection
    if (!$conn) 
    {
        $data = array("response" => "Connection Unsuccessful", "success" => 0);
        echo json_encode($data);
    }
    else
    {
        $conn->query("SET names utf8");
        
        // $userExistsQuery = "SELECT * FROM `store_details`";
        $userExistsQuery =  "SELECT * FROM `store_details` ORDER BY `sCat` DESC";
        $res = $conn->query($userExistsQuery);
    
        if ($res->num_rows > 0)
        {
            $resArray = array();
            while($row = mysqli_fetch_assoc($res))
            {
                array_push($resArray, $row);
            }
            
            echo json_encode($resArray);
        }
        else
        {
            $message = "Unable to fetch rows";
            $data = array($message);
            echo json_encode($data);
        }
        mysqli_close($conn);
    }
}
?>