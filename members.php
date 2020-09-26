
<?php
    // $ip_server = $_SERVER['SERVER_ADDR']; 
    // echo "Server IP Address is: $ip_server";
    header('Content-Type: text/html; charset=utf-8');
 

    $cctoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVkOTJmNjJhLWQyZGQtNDhlMy1hOWY3LTgwZjEyNGMyZjVlYyIsImlhdCI6MTYwMDkwMTA5NCwic3ViIjoiZGV2ZWxvcGVyL2MwMTEzMjZmLTY2NDUtMWFjZC1lYjg3LWZlM2IzOTJjNzYwNCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjE4LjQuODYuMjM0Il0sInR5cGUiOiJjbGllbnQifV19.IKymg8Gy-puku0ajTXQp0B_4xToXB4l92C43TdOcKhM9gg86Ywkgov3nFRHi7nzHs-WSryZBwNSFVNKKkP34wA";
    $url = "https://api.clashofclans.com/v1/clans/%2329GYJ90UQ/members";
    $command = `curl -X GET --header 'Accept: application/json' --header "authorization: Bearer $cctoken" $url`;

    echo $command;
?>

