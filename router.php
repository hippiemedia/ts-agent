<?php

header('Link: <http://schema.org/Person>; rel="profile", Link: <http://alps.io/schema.org/Article.xml>; rel="profile"');
if (false !== strpos(@$_SERVER['HTTP_ACCEPT'], 'collection+json')) {
    header('Content-Type: application/vnd.collection+json');
    return readfile($_SERVER['SCRIPT_FILENAME']);
}
if (false !== strpos(@$_SERVER['HTTP_ACCEPT'], 'hal+json')) {
    header('Content-Type: application/hal+json');
    return readfile($_SERVER['SCRIPT_FILENAME']);
}
return false;
