package main

import (
	"fmt"
	"math"
	"server/boardConfig"
	"sort"
)

func isCannon(pieceIndex int, boardConfig []string) []int {

	ctypes := []int{}
	cannonTypeOffsets := map[int]int{1: 11,
		2: 10,
		3: 9,
		4: 1} // offsets
	for key := range cannonTypeOffsets {
		ofst := cannonTypeOffsets[key]
		if boardConfig[pieceIndex+ofst] == boardConfig[pieceIndex] && boardConfig[pieceIndex-ofst] == boardConfig[pieceIndex] {
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
			whiteCannonTypes := isCannon(i, boardConfig)
			whiteCannons += len(whiteCannonTypes)

		} else if piece == "b" {
			blackPawns++
			blackCannonTypes := isCannon(i, boardConfig)
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
		if (fromItem+1)%10 == 0 {
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

func getOccupiedStepCells(
	item int,
	board []string,
	backwards bool,
	double bool,
	byOpponent bool) []int {

	occupiedStepCells := getStepCells(item, backwards, double, board)
	var filteredOccupiedStepCells []int
	for _, stepCell := range occupiedStepCells {
		if byOpponent {
			if isCellOpponent(item, stepCell, board) {
				filteredOccupiedStepCells = append(filteredOccupiedStepCells, stepCell)
			}
		} else {
			if board[stepCell] != "none" {
				filteredOccupiedStepCells = append(filteredOccupiedStepCells, stepCell)
			}
		}
	}

	return filteredOccupiedStepCells
}

func getRetreatCells(item int, board []string) []int {

	occupiedStepCellsByOpponent := getOccupiedStepCells(item, board, false, false, true)
	occupiedSideCellsByOpponent := getOccupiedSideCells(item, board)

	var occupiedAdjCellsByOpponent []int
	occupiedAdjCellsByOpponent = append(occupiedAdjCellsByOpponent, occupiedStepCellsByOpponent...)
	occupiedAdjCellsByOpponent = append(occupiedAdjCellsByOpponent, occupiedSideCellsByOpponent...)

	if len(occupiedAdjCellsByOpponent) > 0 {
		retreatCandidates := getStepCells(item, true, true, board)
		stepBackCells := getStepCells(item, true, false, board)

		sort.Ints(stepBackCells)
		var mappedFreeMapping []bool

		for _, cell := range stepBackCells {
			if board[cell] != "none" || cell%10 == 0 || cell%9 == 0 {
				mappedFreeMapping = append(mappedFreeMapping, false)
			} else {
				mappedFreeMapping = append(mappedFreeMapping, true)
			}
		}

		var filteredRetreatCandidates []int
		for i, cell := range retreatCandidates {
			if mappedFreeMapping[i] && board[cell] != board[item] {
				filteredRetreatCandidates = append(filteredRetreatCandidates, cell)
			}
		}

		return filteredRetreatCandidates
	} else {
		return []int{}
	}
}

func calculateSide(fromItem int, newPosition int) string {
	delta := (newPosition % 10) - (fromItem % 10)

	var side string
	if delta == 0 {
		side = "center"
	} else if delta > 0 {
		side = "right"
	} else {
		side = "left"
	}

	return side
}

func filterOffsetPositions(
	positions []int,
	diagMap map[string]string,
	coordinateRef []string,
	fromItem int) []int {

	var allowedPositions []int
	for i, position := range positions {
		vertical := coordinateRef[i]
		horizontal := calculateSide(fromItem, position)
		correct := diagMap[vertical]

		if correct == horizontal && position >= 0 && position < 100 {
			allowedPositions = append(allowedPositions, position)
		}
	}

	return allowedPositions
}

func validateOffset(item int, ofst int, ctype int, board []string) []int {
	fromItem := item
	var newPositions []int

	if !isCellOpponent(item, fromItem+ofst*-2, board) {
		newPositions = append(newPositions, []int{fromItem + ofst*-3, fromItem + ofst*-4}...)
	}

	if !isCellOpponent(item, fromItem+ofst*2, board) {
		newPositions = append(newPositions, []int{fromItem + ofst*3, fromItem + ofst*4}...)
	}

	var coordinateRef []string

	for _, np := range newPositions {
		if np < fromItem {
			coordinateRef = append(coordinateRef, "top")
		} else {
			coordinateRef = append(coordinateRef, "bottom")
		}
	}

	diagMap := make(map[string]string)
	var allowedPositions []int

	if ctype == 1 {
		diagMap["bottom"] = "right"
		diagMap["top"] = "left"

		allowedPositions = filterOffsetPositions(newPositions, diagMap, coordinateRef, fromItem)

		return allowedPositions
	} else if ctype == 2 {

		for _, position := range newPositions {
			if position >= 0 && position <= 99 {
				allowedPositions = append(allowedPositions, position)
			}
		}

		return allowedPositions
	} else if ctype == 3 {
		diagMap["bottom"] = "left"
		diagMap["top"] = "right"

		allowedPositions = filterOffsetPositions(newPositions, diagMap, coordinateRef, fromItem)

		return allowedPositions
	} else {
		itemRow := math.Floor(float64(fromItem) / 10.)

		for _, position := range newPositions {
			positionRow := math.Floor(float64(position) / 10.)
			if positionRow == itemRow {
				allowedPositions = append(allowedPositions, position)
			}
		}

		return allowedPositions
	}
}

func getCannonShootCells(item int, board []string, turnType string) []int {

	if turnType == "placement_p1" || turnType == "placement_p2" || turnType == "start_game" {
		return []int{}
	}

	cannonTypeOffsets := map[int]int{1: 11,
		2: 10,
		3: 9,
		4: 1}

	typesFound := isCannon(item, board)
	if len(typesFound) > 0 {
		var allowedMoves []int
		for _, ctype := range typesFound {
			ofst := cannonTypeOffsets[ctype]
			allowedMoves = append(allowedMoves, validateOffset(item, ofst, ctype, board)...)
		}

		var filteredAllowedMoves []int

		for _, position := range allowedMoves {
			if isCellOpponent(item, position, board) {
				filteredAllowedMoves = append(filteredAllowedMoves, position)
			}
		}

		return filteredAllowedMoves
	} else {
		return []int{}
	}
}

func getCannonMoveCells(item int, board []string) []int {
	var allowedMoves []int

	cannonEdgeOffsets := map[int]int{1: 11,
		2: 10,
		3: 9,
		4: 1}

	fromItem := item
	for _, v := range cannonEdgeOffsets {
		ofst := v
		if board[fromItem+ofst*-1] == board[item] && board[fromItem+ofst*-2] == board[item] {
			if board[fromItem+ofst*-3] == "none" {
				allowedMoves = append(allowedMoves, fromItem+ofst*-3)
			}
		}

		if board[fromItem+ofst*1] == board[item] && board[fromItem+ofst*2] == board[item] {
			if board[fromItem+ofst*3] == "none" {
				allowedMoves = append(allowedMoves, fromItem+ofst*3)
			}
		}
	}

	return allowedMoves
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
		allowedMoves = append(allowedMoves, getRetreatCells(item, board)...)
		allowedMoves = append(allowedMoves, getCannonShootCells(item, board, turnType)...)
		allowedMoves = append(allowedMoves, getCannonMoveCells(item, board)...)
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
	position := 88
	board := boardConfig.BoardConfig

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
