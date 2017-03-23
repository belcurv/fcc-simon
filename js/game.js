/* jshint esversion:6 */
/* globals jQuery, Audio, console, document, setTimeout */

var Game = (function ($) {

    'use strict';

    var DOM = {},        // populated by cacheDom()
        gameState = {},  // populated by reset()
        
        len = 20,        // number of turns to win        
        sequence = generateSequence(len),
        
        turn = 0,
        step = 0,
        
        sounds = [
            new Audio('assets/simonSound1.mp3'),
            new Audio('assets/simonSound2.mp3'),
            new Audio('assets/simonSound3.mp3'),
            new Audio('assets/simonSound4.mp3')
        ];
        

    /* ========================== private methods ========================== */

    // cache DOM elements
    function cacheDom() {
        DOM.$game      = $('#game');
        DOM.$board     = DOM.$game.find('.board');
        DOM.$strictBtn = DOM.$board.find('#strict-btn');
        DOM.$resetBtn  = DOM.$board.find('#reset-btn');
                
        DOM.$btn1      = DOM.$board.find('#btn1');
        DOM.$btn2      = DOM.$board.find('#btn2');
        DOM.$btn3      = DOM.$board.find('#btn3');
        DOM.$btn4      = DOM.$board.find('#btn4');
        
        DOM.$score     = DOM.$game.find('#score');
    }


    // bind events
    function bindEvents() {
        DOM.$board.on('click', gameBtnClick);
    }
    
    
    // handle main game button click events
    function gameBtnClick(e) {
        
        if (e.target !== e.currentTarget) {
            console.log(e.target.id);
        }
        
        e.stopPropagation();
        
    }
    
    
    /** create array of random 1-4 numbers
     * 
     * @params   [number]   length   [number of elements needed]
     * @returns  [array]             [sequence of random integers]
    */
    function generateSequence(length) {
        return Array(...new Array(length))
            .map( (n) => Math.ceil(Math.random() * 4) );
    }
    
    
    // disable all buttons
    function disableButtons() {
        
        for (let i = 1; i < 5; i += 1) {
            let btn = '$btn' + i;
            DOM[btn].removeClass('lit');
        }
    }
    
    
    /** play one element of the sequence
     *
     * @params   [number]   step   [value of the button and tone to pla]
    */
    function playOne(step) {
        disableButtons();
        sounds[step - 1].play();
        
        // light button
        DOM['$btn' + step]
            .addClass('lit');
        
        // un-light button
        setTimeout(function() {
            DOM['$btn' + step]
                .removeClass('lit');
        }, 400);
        
    }
    
    
    // play sequence
    function playSequence() {
        
        // temp display sequence on screen
        DOM.$score.html('sequence: ' + JSON.stringify(sequence, null, 2));
        
        if (step === len) {
            console.log('done');
            return;
        } else {
            
            playOne(sequence[step]);
            step += 1;
            
            setTimeout(playSequence, 750);
            
        }
    
    }



    /* ========================== public methods =========================== */

    // autoexec on page load
    function init() {

        cacheDom();
        bindEvents();
        playSequence();

    }


    /* ====================== export  public methods ======================= */

    return {
        init: init
    };

}(jQuery));
