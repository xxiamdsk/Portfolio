<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php

        
                            
        if(isset($_POST['submit']))
        $name = $_POST['contact-name'];
        $phone = $_POST['contact-phone'];
        $email = $_POST['contact-email'];
        $subject = $_POST['subject'];
        $message = $_POST['contact-message'];


        $to = "ds2390521@gmail.com";
        $subject = "Mail From Website";        
        $headers = "From: $name<$email>";
        $message = "Name: $name \n\n Phone: $phone \n\n Email: $email \n\n Subject: $subject \n\n Message: $message";
        $sent = mail($to, $subject, $message, $headers);
        if($sent)
        {
            echo "Success";
        }
        else
        {
            echo "Error";
            
        }
        
    ?>

        



</body>
</html>