const express = require('express');

function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 10000);
    });
}


async function f1() {
    var x = await resolveAfter2Seconds(10);
    console.log(x); // 10
}


const homeGet = (req, res, next) => {
    if (req.isAuthenticated()) {
        f1();
        res.render("home");
    } else {
        res.redirect("/");
    }
}


module.exports = { homeGet };