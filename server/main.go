package main

import (
	"fmt"
	"server/boardConfig"
)

func isCannon(pieceIndex int, pieceValue string, boardConfig []string) []int {

	ctypes := []int{}
	cannonTypeOffsets := map[int]int{1: 11,
		2: 10,
		3: 9,
		4: 1} // offsets
	for key := range cannonTypeOffsets {
		ofst := cannonTypeOffsets[key]
		if boardConfig[pieceIndex+ofst] == pieceValue && boardConfig[pieceIndex-ofst] == pieceValue {
			ctypes = append(ctypes, key)
		}
	}
	return ctypes

}

func evaluate(boardConfig []string) {

	whitePawns := 0
	blackPawns := 0
	whiteCannons := 0
	blackCannons := 0

	for i, piece := range boardConfig {
		if piece == "w" {
			whitePawns++
			whiteCannonTypes := isCannon(i, piece, boardConfig)
			whiteCannons += len(whiteCannonTypes)

		} else if piece == "b" {
			blackPawns++
			blackCannonTypes := isCannon(i, piece, boardConfig)
			blackCannons += len(blackCannonTypes)
		}
	}

	fmt.Println(whitePawns, blackPawns, whiteCannons, blackCannons)
}

func sliceRange(min int, max int) []int {
	slice_ := make([]int, max-min)
	for i := range slice_ {
		slice_[i] = min + i
	}
	return slice_
}

func getStepCells(item int, backwards bool, double bool, board []string) []int {

	var depth int
	var reverse int
	if double {
		depth = 2
	} else {
		depth = 1
	}

	correction := (depth - 1) * 4

	if backwards {
		reverse = -1 * depth
	} else {
		reverse = 1
	}

	fromItem := item
	itemValue := board[item]

	if itemValue == "w" {
		if fromItem <= 9 {
			return []int{}
		} // Off board
		if fromItem%10 == 0 {
			return []int{fromItem - (10 * reverse), fromItem - (9*reverse - correction)}
		} // First in row
		if (fromItem+1)%10 == 0 {
			return []int{fromItem - (11*reverse + correction), fromItem - (10 * reverse)}
		} // Last in row
		return []int{fromItem - (11*reverse + correction), fromItem - (10 * reverse), fromItem - (9*reverse - correction)}
	} else {
		if fromItem >= 90 {
			return []int{}
		} // Off board
		if fromItem%10 == 0 {
			return []int{fromItem + (10 * reverse), fromItem + (11*reverse + correction)}
		} // First in row
		if (fromItem+(1*reverse))%10 == 0 {
			return []int{fromItem + (9*reverse - correction), fromItem + (10 * reverse)}
		} // Last in row
		return []int{fromItem + (9*reverse - correction), fromItem + (10 * reverse), fromItem + (11*reverse + correction)}
	}
}

func checkStepMove(positions []int, board []string, item int) []int {
	var filteredPositions []int
	for _, p := range positions {
		if p <= 99 || p >= 0 {
			if board[item] != board[p] {
				filteredPositions = append(filteredPositions, p)
			}
		}
	}
	return filteredPositions
}

func getAllowedStepCells(item int, board []string) []int {
	stepCells := getStepCells(item, false, false, board)

	allowedMoves := checkStepMove(stepCells, board, item)

	return allowedMoves
}

func isCellOpponent(item int, toCell int, board []string) bool {
	opponent := map[string][]string{"w": {"b", "tb"},
		"b": {"w", "tw"}}
	toCellValue := board[toCell]

	for _, op := range opponent[board[item]] {
		if op == toCellValue {
			return true
		}
	}

	return false
}

func checkSideCell(item int, board []string, side string) []int {
	fromItem := item
	cellSide := map[string]int{"left": -1,
		"right": 1}
	sideItem := fromItem + cellSide[side]

	if isCellOpponent(item, sideItem, board) {
		return []int{sideItem}
	} else {
		return []int{}
	}

}

func getOccupiedSideCells(item int, board []string) []int {
	var allowedMoves []int
	fromItem := item

	if fromItem%10 == 0 {
		righItem := checkSideCell(item, board, "right")
		allowedMoves = append(allowedMoves, righItem...)
		return allowedMoves
	} else if (fromItem+1)%10 == 0 {
		leftItem := checkSideCell(item, board, "left")
		allowedMoves = append(allowedMoves, leftItem...)
		return allowedMoves
	} else {
		righItem := checkSideCell(item, board, "right")
		leftItem := checkSideCell(item, board, "left")
		allowedMoves = append(allowedMoves, righItem...)
		allowedMoves = append(allowedMoves, leftItem...)
		return allowedMoves
	}

}

func getNextMoves(item int, board []string, turnType string) []int {

	var allowedMoves []int

	if turnType == "placement_p1" {
		return sliceRange(90, 100)

	} else if turnType == "placement_p2" {
		return sliceRange(0, 10)

	} else if turnType == "start_game" {
		return allowedMoves

	} else {

		allowedMoves = append(allowedMoves, getAllowedStepCells(item, board)...)
		allowedMoves = append(allowedMoves, getOccupiedSideCells(item, board)...)
		return allowedMoves

	}
}

// func getNextStates(board []string, turnType string){
// 	var nextStates [][]string
// 	for i, piece := range board {
// 		// get piece's next positions
// 		// move piece
// 	}
// }

func main() {
	// evaluate(boardConfig.BoardConfig)
	turnType := "p1"
	// getNextStates(boardConfig.BoardConfig, turnType)
	position := 31
	board := boardConfig.BoardConfig
	// board[32] = "w"
	fmt.Println(getNextMoves(position, board, turnType))
}

// ------------------------------------------------------

// import (
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"net/http"
// )

// func homePage(w http.ResponseWriter, r *http.Request) {
// 	// fmt.Fprintf(w, "Welcome to the HomePage!")
// 	json.NewEncoder(w).Encode([]string{"one", "two", "three"})
// 	fmt.Println("Endpoint Hit: homePage")
// }

// func setup() {
// 	http.HandleFunc("/", homePage)
// 	log.Fatal(http.ListenAndServe(":10000", nil))
// }

// func main() {
// 	setup()
// }

// -------------------
