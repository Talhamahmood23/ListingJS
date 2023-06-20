<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $serverName = "";
    $userName = "";
    $password = "";
    $databaseName = "";

    $sId = $_POST["id"];

    $conn = mysqli_connect($serverName, $userName, $password, $databaseName);
    
    // Check connection
    if (!$conn) 
    {
        $data = array("response" => "Connection Unsuccessful", "success" => 0);
        echo json_encode($data);
    }
    else
    {
        $conn->query("SET NAMES 'utf8'");
        
        $userExistsQuery = "SELECT * FROM `store_reviews` WHERE `sId` = '$sId'";
        $res = $conn->query($userExistsQuery);
        
        if ($res->num_rows > 0)
        {
            $row = mysqli_fetch_assoc($res);
            
            
            $data = new stdClass(); // create a new object
            $data->authors = json_decode($row['authorNames']);
            $data->photos = json_decode($row['photos']);
            $data->ratings = json_decode($row['ratings']);
    
            // Get Reviews
            $_reviews = $row['reviews'];
            $separator = "\",\"";
            $splittedReviews = explode($separator, $_reviews);
            
            for ($x = 0; $x < count($splittedReviews); $x++) 
            {
                $splittedReviews[$x] = str_replace("[\"","", $splittedReviews[$x]);
                $splittedReviews[$x] = str_replace("\"]","", $splittedReviews[$x]);
            }
            
            $splittedReviews = array_map('utf8_encode', $splittedReviews);
            $jsonReviews = json_encode($splittedReviews);
            
            $data->reviews = json_decode($jsonReviews);
            
            // Get Weekdays
            $_weekDays = $row['weekDays'];
            $separator = "\",\"";
            $splittedWeekDays = explode($separator, $_weekDays);
            
            for ($x = 0; $x < count($splittedWeekDays); $x++) 
            {
                $splittedWeekDays[$x] = str_replace("[\"","", $splittedWeekDays[$x]);
                $splittedWeekDays[$x] = str_replace("\"]","", $splittedWeekDays[$x]);
            }
            
            $splittedWeekDays = array_map('utf8_encode', $splittedWeekDays);
            $jsonWeekdays = json_encode($splittedWeekDays);
            
            $data->weekdays = json_decode($jsonWeekdays);
    
            // This returns final data
            echo json_encode($data);
        }

        mysqli_close($conn);
    }
}
?>