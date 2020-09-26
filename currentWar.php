
<?php
    // $ip_server = $_SERVER['SERVER_ADDR']; 
    // echo "Server IP Address is: $ip_server";
    header('Content-Type: text/html; charset=utf-8');
 

    $cctoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjBiZGM0N2RkLTlkYWYtNGUyMy04ODNjLTkzOWZmZjc1YjVhMyIsImlhdCI6MTYwMDkwMTQwOSwic3ViIjoiZGV2ZWxvcGVyL2MwMTEzMjZmLTY2NDUtMWFjZC1lYjg3LWZlM2IzOTJjNzYwNCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjE4LjQuODYuMCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.EZS3-Bk9ZqDwn3PyQw0p6lwbAvHSauSXyO0jHiG2yGwMdGhLt9SDTNrreH3r-SA9-kcLBK4nkvgUKdDE6s6kGg
    ";
    $url = "https://api.clashofclans.com/v1/clans/%2329GYJ90UQ/currentwar";
    $command = `curl -X GET --header 'Accept: application/json' --header "authorization: Bearer $cctoken" $url`;

    echo $command;
?>

