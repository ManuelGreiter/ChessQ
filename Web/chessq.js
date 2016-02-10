/*
	ChessQ - Early Alpha V0.0001
	Manuel Greiter
	February 2016

	Chess pieces svg from
	By jurgenwesterhof (adapted from work of Cburnett)
	CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0)
	via Wikimedia Commons

*/

var cfg = {
	orientation: 'black',
	containerID: 'board',
	//startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	//startPos: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
	startPos: 'rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/3B1N2/PPPP1PPP/RNBQK2R b KQkq - 1 4',
	//startPos: '2kr1b1r/1pp3p1/p2p2qp/3Ppb2/2P5/4BN1P/PP3PP1/2RQR1K1 w - - 2 16',
	//startPos: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
};


$(document).ready(function() {

	// create board
	drawBoard();

	$('.square .piece_img').on('click', function() {
		selectPiece($(this));
	});
});


// test
$(window).resize(function() {
	
	$('#' + cfg.containerID).html('');
	drawBoard();

});


function drawBoard() {

	// draws the board, sets the right data attributes
	// and calls the function to create the description

	var rows = 8;
	var tileCount = 8;

	var container = $('#' + cfg.containerID);

	// set the orientation/color
	// fetch from the cfg obj
	var orientation = 0; // white by default
	if ( cfg.orientation === 'black' ) { orientation = 1; }

	// get container width - @todo
	var boardsize = $(container).width() - 1;


	// calc square width @todo better handling
	var squaresize = boardsize / tileCount;
	console.table({boardsize, squaresize});


	// loop for each rank
	for (var index = 0; index < rows; index++ ){

		// create the rank info on the right (1-8)
		var rowNumber = createLegend(orientation, "number", index);

		var row = '<div class="row row_' + index + '" data-row=' + index +' data-after=' + rowNumber +'></div>';
		var $row = $(row);

		$(container).append($row);


		// loop for each square
		for (var i = 0; i < tileCount; i++ ) {

			var square = '<div class="square square_' + i + '" data-y=' + index + ' data-x=' + i +'></div>';

			var $square = $(square);
			$square.width(squaresize).height(squaresize);


			// check if the square is occupied
			// @todo - there might be a better way
			var piece = parseFen(index, i);
			if ( piece ) { $square.append(piece); }

			$('.row_' + index).append($square);


			// add info to the square (A-H)
			// (only in the last row)
			if ( rows == ( index + 1 ) ) {
				var letter = createLegend(orientation, "letter", i);
				$square.attr('data-before', letter);
			} 

		}

		$row.append('<div class="clear"></div>');
	}

	$(container).append('<div class="clear"></div>');

}


function createLegend(orientation, wantedresult, index) {

	// creates the chessboard legend
	// names the ranks (A-H), squares (1-8)

	// orientation 0 => white, 1 => black
	// wantedresult => letter
	// index => loop index when drawing the board


	// @todo - could be done with reverse
	var letterorder = [
		["A", "B", "C", "D", "E", "F", "G", "H"],
		["H", "G", "F", "E", "D", "C", "B", "A"]
	];

	var columnindex = [
		[8,7,6,5,4,3,2,1],
		[1,2,3,4,5,6,7,8]
	];

	if ( wantedresult === "number" ) {
		var column = columnindex[orientation][index];
		return column;
	} else {
		var letter = letterorder[orientation][index];
		return letter;
	}
}


function parseFen(row, index) {

	var fen = cfg.startPos;
	fen = fenSpacer(fen);

	var parts = fen.split('/');
	var piece;

	// console.log(parts);

	var currentRank = parts[row];
	//console.log(currentRank);

	// if the row is empty - skip it
	if ( currentRank == '8' ) {
		return;
	} else {
		piece = currentRank.substr(index, 1);
		if ( row === 0 ) {
			//console.log(piece);
		}
	}

	// skip empty squares (placeholders)
	if ( piece === '1' ) { return; }

	// returns the right piece for the given shortcut
	piece = fenPieceFullName(piece);

	// @todo images should be 100% height & width off the square
	var piece_obj = "<img src='Material/Pieces/" + piece + ".svg' class='piece_img " + piece + "'></img>";
	return piece_obj;

}


function fenSpacer(fen) {

	// translates the fen placeholders into skipable
	// placeholders
	// /4P3/ => /1111P111/

	var fen = fen.replace(/2/g, '11');
	var fen = fen.replace(/3/g, '111');
	var fen = fen.replace(/4/g, '1111');
	var fen = fen.replace(/5/g, '11111');
	var fen = fen.replace(/6/g, '111111');
	var fen = fen.replace(/7/g, '1111111');

	return fen;

}


function fenPieceFullName(fenpiece) {

	// returns the full piecename + version
	// needed to get the right image path

	if ( fenpiece === 'r' ) { return 'brook'; }
	if ( fenpiece === 'R' ) { return 'rook'; }

	if ( fenpiece === 'k' ) { return 'bking'; }
	if ( fenpiece === 'K' ) { return 'king'; }

	if ( fenpiece === 'q' ) { return 'bqueen'; }
	if ( fenpiece === 'Q' ) { return 'queen'; }

	if ( fenpiece === 'b' ) { return 'bbishop'; }
	if ( fenpiece === 'B' ) { return 'bishop'; }

	if ( fenpiece === 'n' ) { return 'bknight'; }
	if ( fenpiece === 'N' ) { return 'knight'; }

	if ( fenpiece === 'p' ) { return 'bpawn'; }
	if ( fenpiece === 'P' ) { return 'pawn'; }
}


function selectPiece(piece) {

	// highlight the selected piece
	// @todo
	$('.square').removeClass('selected'); // test
	$(piece).parent().toggleClass('selected'); // test

	// piece actions
	// -> dropped on valid square
	// -> droped on non valid square
	// -> dropped outside of the board
	// -> dropped on square that is occupied

}
