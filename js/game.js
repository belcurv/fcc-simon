/* jshint esversion:6 */
/* globals jQuery, Audio, console, document, setTimeout */

var Game = (function ($) {

    'use strict';

    var DOM = {},        // populated by cacheDom()
        
        len = 20,        // number of turns to win        
        sequence = [],
        
        playerTurn = false,
        playerSequence = [],
        
        turn = 1,
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
        DOM.$game       = $('#game');
        DOM.$board      = DOM.$game.find('.board');
        DOM.$strictBtn  = DOM.$board.find('#strict-btn');
        DOM.$resetBtn   = DOM.$board.find('#reset-btn');

        DOM.$btn1       = DOM.$board.find('#btn1');
        DOM.$btn2       = DOM.$board.find('#btn2');
        DOM.$btn3       = DOM.$board.find('#btn3');
        DOM.$btn4       = DOM.$board.find('#btn4');

        DOM.$score      = DOM.$game.find('#score');

        DOM.$readyModal = $(document.createElement('div'));
        DOM.$readyBtn   = $(document.createElement('button'));
        
        DOM.$victorModal = $(document.createElement('div'));        
        DOM.$victorBtn   = $(document.createElement('button'));
    }


    // bind events
    function bindEvents() {
        DOM.$game.on('click', '#ready-btn', startGame);
        DOM.$resetBtn.on('click', resetGame);
        DOM.$board.on('click', gameBtnClick);
    }
    
    
    // start game
    function startGame(e) {
        
        DOM.$readyModal.hide();
//        resetGame();
        advanceTurn();
        
        e.stopPropagation();
        
    }
    
    
    // handle main game button click events
    function gameBtnClick(e) {
        
        var num = (e.target.id).slice(3);
        
        if (/\d/.test(num)) {
            
            playOne(num);
            playerSequence.push(parseInt(num, 10));
            evalPlayerSequence();
                        
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
    
        
    /** play one element of the sequence
     *
     * @params   [number]   n   [value of the button and tone to play]
    */
    function playOne(n) {
        sounds[n - 1].play();
        
        // light button
        DOM['$btn' + n]
            .addClass('lit');
        
        // un-light button
        setTimeout(function() {
            DOM['$btn' + n]
                .removeClass('lit');
        }, 400);
        
    }
    
    
    // play sequence
    function playSequence() {
        
        
        if (step === turn) {
            playerTurn = !playerTurn;
            advanceTurn();
            step = 0;
            return;
        } else {
            
            playOne(sequence[step]);
            step += 1;
            
            setTimeout(playSequence, 750);
            
        }
    }
    
    
    // check if sequences have same length
    function sameLength(seqA, seqB) {
        return seqA.length === seqB.length;
    }
    
    
    // check if sequences have same content
    function sameContent(seqA, seqB) {
        
        // fail if arrays are not same length
        if (seqA.length !== seqB.length) {
            return false;
        }
        
        // fail if arrays do not contain the same elements
        for (let i = 0; i < seqA.length; i += 1) {
            if (seqA[i] !== seqB[i]) {
                return false;
            }
        }
        
        // otherwise pass
        return true;
    }
    
    
    // evaluate player's inputs
    function evalPlayerSequence() {
        
        console.log(' === Player\'s Turn === ');
        console.log('sequence: ', playerSequence);
        
        // get subset of whole sequence
        var computerSequence = sequence.slice(0, turn);
        
        // check that sequences are the same length
        if (sameLength(playerSequence, computerSequence)) {
            
            // check that sequences contain the same elements
            if (!sameContent(playerSequence, computerSequence)) {
                
                console.log(' ******* you fucked up! ******* ');
            
            }
            
            console.log('Good job!');
            turn += 1;
            playerTurn = !playerTurn;
            playerSequence.length = 0;
            
            setTimeout(advanceTurn, 750);

            
        }
        
    }
    
    
    // advance game one turn at a time
    function advanceTurn() {
        
        // check if it's the computer's turn
        if (playerTurn === false) {
            
            console.log(' === Computer\'s Turn === ');
            console.log('sequence: ', sequence.slice(0, turn));
            playSequence();
            
        } else {
            
//            evalPlayerSequence();
            
        }
                
        // temp display sequence on screen
        DOM.$score.html('turn: ' + turn +
                        ' | player turn: ' + playerTurn);
        
    }
    
    
    // reset game
    function resetGame() {
        
        // hide victory modal
        DOM.$victorModal
            .hide();

        // reset game state
        playerTurn = false;
        sequence = generateSequence(len);
        turn = 1;
        step = 0;
        
        readyModal();
    }
    
    
    // initial modal for ready player go!
    function readyModal() {
        
        var group = $(document.createElement('div'));
        
        DOM.$readyBtn
            .addClass('ready-btn')
            .attr('id', 'ready-btn')
            .attr('type', 'button')
            .text('Ready!')
            .appendTo(group);
        
        DOM.$readyModal
            .addClass('modal')
            .appendTo(DOM.$game)
            .html(`<p>I am</p>`)
            .append(group)
            .show();
    }




    /* ========================== public methods =========================== */

    // autoexec on page load
    function init() {

        cacheDom();
        bindEvents();
        resetGame();

    }


    /* ====================== export  public methods ======================= */

    return {
        init: init
    };

}(jQuery));
