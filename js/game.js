/* jshint esversion:6 */
/* globals jQuery, console, document, setTimeout */

var Game = (function ($) {

    'use strict';

    var DOM = {},        // populated by cacheDom()

        gameState = {};  // populated by reset()
        

    /* ========================== private methods ========================== */

    // cache DOM elements
    function cacheDom() {
        DOM.$game     = $('#game');
    }


    // bind events
    function bindEvents() {

    }



    /* ========================== public methods =========================== */

    // autoexec on page load
    function init() {

        cacheDom();
        bindEvents();

    }


    /* ====================== export  public methods ======================= */

    return {
        init: init
    };

}(jQuery));
