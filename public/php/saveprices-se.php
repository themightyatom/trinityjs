<?php
$file_se = 'https://vinlagring.se/feeds/prisjakt-vinlagring.csv';
$newfile_se = '/home/customsh/vinlagringse.customshop.online/csv/prices.csv';
copy($file_se, $newfile_se);

?>