/* jshint esversion:6 */
/* globals jQuery, Audio, console, document, setTimeout */

var Game = (function ($) {

    'use strict';

    var DOM = {},
        
        gameState = {},
        
        sounds = [
            new Audio('assets/simonSound1.mp3'),
            new Audio('assets/simonSound2.mp3'),
            new Audio('assets/simonSound3.mp3'),
            new Audio('assets/simonSound4.mp3')
        ];
        

    /* ========================== private methods ========================== */

    // cache DOM elements
    function cacheDom() {
        
        /* game framework elements */
        DOM.$game        = $('#game');
        DOM.$board       = DOM.$game.find('.board');
        DOM.$strictBtn   = DOM.$board.find('#strict-btn');
        DOM.$resetBtn    = DOM.$board.find('#reset-btn');
        DOM.$score       = DOM.$game.find('#score');

        /* game buttons */
        DOM.$btn1        = DOM.$board.find('#btn1');
        DOM.$btn2        = DOM.$board.find('#btn2');
        DOM.$btn3        = DOM.$board.find('#btn3');
        DOM.$btn4        = DOM.$board.find('#btn4');

        /* modals */
        DOM.$readyModal  = $(document.createElement('div'));
        DOM.$errorModal  = $(document.createElement('div'));
        DOM.$victorModal = $(document.createElement('div'));
        DOM.$readyBtn    = $(document.createElement('button'));
    }


    // bind events
    function bindEvents() {
        DOM.$game.on('click', '#ready-btn', startGame);
        DOM.$game.on('click', '#play-again-btn', resetGame);
        DOM.$resetBtn.on('click', resetGame);
        DOM.$strictBtn.on('click', toggleStrict);
        DOM.$board.on('click', gameBtnClick);
    }
    
    
    /** start game
     *
     * @params   [object]   e   [click event]
    */
    function startGame(e) {
        DOM.$readyModal.hide();
        advanceTurn();
        e.stopPropagation();
    }
    
    
    /** toggle strict mode
     *
     * @params   [object]   e   [click event]
    */
    function toggleStrict(e) {
        console.log('strict clicked. ' + gameState.strict);
        gameState.strict = !gameState.strict;
        DOM.$strictBtn
            .toggleClass('red', gameState.strict);
        e.stopPropagation();
    }
    
    
    /** handle main game button click events
     *
     * @params   [object]   e   [click event]
    */
    function gameBtnClick(e) {
        
        var id  = (e.target.id).slice(3),
            num = parseInt(id, 10);
        
        // only take action on the numbered buttons
        if (/\d/.test(num)) {
            
            playOne(num);
            gameState.playerSequence.push(num);
            evalPlayerTurn(num);
                        
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
    
        
    /** play one element of the computer sequence
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
    
    
    // computer play sequence
    function playSequence() {
        
        if (gameState.step === gameState.turn) {

            gameState.playerTurn = true;
            advanceTurn();
            gameState.step = 0;
            return;

        } else {
            
            playOne(gameState.sequence[gameState.step]);
            gameState.step += 1;
            setTimeout(playSequence, 750);
            
        }
    }
    
    
    /** check if sequences have same length
     *
     * @params   [array]   seqA   [sequence A]
     * @params   [array]   seqB   [sequence B]
     * @returns  [boolean]
    */
    function sameLength(seqA, seqB) {
        return seqA.length === seqB.length;
    }
    
    
    /** evaluate player's current play
     *
     * @params   [number]   play   [integer representing the clicked button]
    */
    function evalPlayerTurn(play) {
        
        var index = gameState.playerSequence.length - 1;

        // if player's move matches computer's move
        if (play === gameState.sequence[index]) {
            
            evalPlayerSequence();
            
        } else {
            
            // otherwise, failure mode depends on strict mode
            if (gameState.strict) {
                
                errorModal('YOU LOSE');
                setTimeout(resetGame, 1500);
                
            } else {
                
                errorModal('Try Again');
                gameState.playerSequence.length = 0;
                gameState.playerTurn = false;
                setTimeout(playSequence, 1500);
                
            }
            
        }
        
    }
    
    
    // evaluate player sequence for win or turn advance
    function evalPlayerSequence() {
        
        // get current turn's subset of full sequence
        var computerSequence = gameState.sequence.slice(0, gameState.turn);
        
        // check for win
        if (sameLength(gameState.playerSequence, gameState.sequence)) {
            
            victoryModal();
            
        } else {
            
            // advance turn if sequences are the same length
            if (sameLength(gameState.playerSequence, computerSequence)) {

                gameState.turn += 1;
                gameState.playerSequence.length = 0;
                gameState.playerTurn = false;
                setTimeout(advanceTurn, 750);

            }

        }
                
    }
    
    
    // advance game one turn at a time
    function advanceTurn() {
        
        // if it's the computer's turn
        if (gameState.playerTurn === false) {
            playSequence();
        }
                
        // update score
        DOM.$score.html('Level: ' + gameState.turn);
        
    }
    
    
    // reset game
    function resetGame() {
        
        // hide victory modal
        DOM.$victorModal
            .hide();

        // reset game state
        gameState = {
            len            : 20,
            strict         : false,
            playerTurn     : false,
            sequence       : [],
            playerSequence : [],
            turn           : 1,
            step           : 0
        };
        
        gameState.sequence = generateSequence(gameState.len);
        
        // show ready modal
        readyModal();
    }
    
    
    // error modal
    function errorModal(error) {
        
        DOM.$errorModal
            .addClass('modal')
            .appendTo(DOM.$game)
            .html(`<p>${error}</p>`)
            .show();
        
        setTimeout(function () {
            DOM.$errorModal
                .hide();
        }, 1500);
        
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
    
    
    // victory modal
    function victoryModal() {
        
        var group = $(document.createElement('div'));
        
        DOM.$readyBtn
            .addClass('ready-btn')
            .attr('id', 'play-again-btn')
            .attr('type', 'button')
            .text('Play Again!')
            .appendTo(group);
        
        DOM.$readyModal
            .addClass('modal')
            .appendTo(DOM.$game)
            .html(`<p>YOU WIN</p>`)
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
