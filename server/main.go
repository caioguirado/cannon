package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"sort"
	"strings"
	"time"
)

func isCannon(pieceIndex int, boardConfig []string) []int {

	ctypes := []int{}
	cannonTypeOffsets := map[int]int{1: 11,
		2: 10,
		3: 9,
		4: 1} // offsets
	for key := range cannonTypeOffsets {
		ofst := cannonTypeOffsets[key]
		newPlusOfst := pieceIndex + ofst
		newMinusOfst := pieceIndex - ofst
		if (newPlusOfst >= 0 && newPlusOfst < 100) && (newMinusOfst >= 0 && newMinusOfst < 100) {
			if boardConfig[newPlusOfst] == boardConfig[pieceIndex] && boardConfig[newMinusOfst] == boardConfig[pieceIndex] {
				ctypes = append(ctypes, key)
			}
		}
	}
	return ctypes
}

func evaluate(boardConfig []string) int {

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

	featureValues := []int{whitePawns, blackPawns, whiteCannons, blackCannons}

	score := 0
	for _, fv := range featureValues {
		score += fv
	}

	score = whitePawns - blackPawns
	// fmt.Println(score)
	return score
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
			if cell >= 0 && cell < 100 {
				if mappedFreeMapping[i] && board[cell] != board[item] {
					filteredRetreatCandidates = append(filteredRetreatCandidates, cell)
				}
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

	ofstMinus2 := fromItem + ofst*-2
	ofstMinus3 := fromItem + ofst*-3
	ofstMinus4 := fromItem + ofst*-4
	if ofstMinus2 >= 0 && ofstMinus2 < 100 {
		if !isCellOpponent(item, ofstMinus2, board) {
			if ofstMinus3 >= 0 && ofstMinus3 < 100 {
				newPositions = append(newPositions, []int{ofstMinus3}...)
			}
			if ofstMinus4 >= 0 && ofstMinus4 < 100 {
				newPositions = append(newPositions, []int{ofstMinus4}...)
			}
		}
	}

	ofstPlus2 := fromItem + ofst*2
	ofstPlus3 := fromItem + ofst*3
	ofstPlus4 := fromItem + ofst*4
	if ofstPlus2 >= 0 && ofstPlus2 < 100 {
		if !isCellOpponent(item, ofstPlus2, board) {
			if ofstPlus3 >= 0 && ofstPlus3 < 100 {
				newPositions = append(newPositions, []int{ofstPlus3}...)
			}
			if ofstPlus4 >= 0 && ofstPlus4 < 100 {
				newPositions = append(newPositions, []int{ofstPlus4}...)
			}
		}
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
		newPlusOfst1 := fromItem + ofst*1
		newPlusOfst2 := fromItem + ofst*2
		newPlusOfst3 := fromItem + ofst*3
		newMinusOfst1 := fromItem + ofst*-1
		newMinusOfst2 := fromItem + ofst*-2
		newMinusOfst3 := fromItem + ofst*-3

		if (newMinusOfst1 >= 0 && newMinusOfst1 < 100) && (newMinusOfst2 >= 0 && newMinusOfst2 < 100) {
			if board[newMinusOfst1] == board[item] && board[newMinusOfst2] == board[item] {
				if (newMinusOfst3 >= 0 && newMinusOfst3 < 100) && board[newMinusOfst3] == "none" {
					allowedMoves = append(allowedMoves, fromItem+ofst*-3)
				}
			}
		}

		if (newPlusOfst1 >= 0 && newPlusOfst1 < 100) && (newPlusOfst2 >= 0 && newPlusOfst2 < 100) {
			if board[newPlusOfst1] == board[item] && board[newPlusOfst2] == board[item] {
				if (newPlusOfst3 >= 0 && newPlusOfst3 < 100) && board[newPlusOfst3] == "none" {
					allowedMoves = append(allowedMoves, fromItem+ofst*3)
				}
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
		if board[item] == "none" || strings.Contains(board[item], "t") {
			return allowedMoves
		}
		if strings.Contains(board[item], "w") && !strings.Contains(turnType, "p1") {
			return allowedMoves
		}
		if strings.Contains(board[item], "b") && !strings.Contains(turnType, "p2") {
			return allowedMoves
		}
		allowedMoves = append(allowedMoves, getAllowedStepCells(item, board)...)
		allowedMoves = append(allowedMoves, getOccupiedSideCells(item, board)...)
		allowedMoves = append(allowedMoves, getRetreatCells(item, board)...)
		allowedMoves = append(allowedMoves, getCannonShootCells(item, board, turnType)...)
		allowedMoves = append(allowedMoves, getCannonMoveCells(item, board)...)
		return allowedMoves

	}
}

func isIn(item int, iterable []int) bool {
	for _, it := range iterable {
		if it == item {
			return true
		}
	}
	return false
}

func isInString(item string, iterable []string) bool {
	for _, it := range iterable {
		if it == item {
			return true
		}
	}
	return false
}

func movePiece(item int,
	board []string,
	toPosition int,
	allowedPositions []int,
	allowedShots []int) []string {

	boardCopy := make([]string, len(board))
	copy(boardCopy, board)

	if isIn(toPosition, allowedShots) {
		// Shoot cell
		boardCopy[toPosition] = "none"
	} else if isIn(toPosition, allowedPositions) {
		// Move cell
		itemValue := board[item]
		boardCopy[toPosition] = itemValue
		boardCopy[item] = "none"
	}

	return boardCopy
}

type state struct {
	Board    []string `json:"board"`
	TurnType string   `json:"turnType"`
}

type move struct {
	FromPosition int    `json:"fromPosition"`
	ToPosition   int    `json:"toPosition"`
	MoveType     string `json:"moveType"`
}

type stateTransition struct {
	fromState state
	move      move
	toState   state
}

func getMoveType(toPosition int, possibleShots []int, turnType string) string {

	if strings.Contains(turnType, "placement") {
		return "placement"
	} else if isIn(toPosition, possibleShots) {
		return "shot"
	} else {
		return "move"
	}

}

func getNextStates(s state) []stateTransition {
	var nextStates []stateTransition

	nextTurnType := ""
	nextTurnTypeMap := map[string]string{"start_game": "placement_p1",
		"placement_p1": "placement_p2",
		"placement_p2": "p1",
		"p1":           "p2",
		"p2":           "p1",
	}

	if strings.Contains(s.TurnType, "placement") {
		plc2piece := map[string]string{"placement_p1": "tw", "placement_p2": "tb"}
		possibleMoves := getNextMoves(0, s.Board, s.TurnType)

		for _, toPosition := range possibleMoves {
			boardCopy := make([]string, len(s.Board))
			copy(boardCopy, s.Board)
			boardCopy[toPosition] = plc2piece[s.TurnType]
			nextTurnType = nextTurnTypeMap[s.TurnType]
			nextState := state{Board: boardCopy, TurnType: nextTurnType}
			move := move{FromPosition: -1, ToPosition: toPosition, MoveType: "placement"}
			nextStateTransition := stateTransition{fromState: s,
				move:    move,
				toState: nextState}
			nextStates = append(nextStates, nextStateTransition)
		}
		return nextStates
	}

	for i, _ := range s.Board {

		// get piece's next positions
		possibleMoves := getNextMoves(i, s.Board, s.TurnType)
		possibleShots := getCannonShootCells(i, s.Board, s.TurnType)

		for _, toPosition := range possibleMoves {
			// move piece
			newBoard := movePiece(i, s.Board, toPosition, possibleMoves, possibleShots)
			if (!isInString("tw", newBoard) || !isInString("tb", newBoard)) && !strings.Contains(s.TurnType, "placement") {
				nextTurnType = "terminal"
			} else {
				nextTurnType = nextTurnTypeMap[s.TurnType]
			}
			nextState := state{Board: newBoard, TurnType: nextTurnType}
			moveType := getMoveType(toPosition, possibleShots, s.TurnType)
			move := move{FromPosition: i, ToPosition: toPosition, MoveType: moveType}
			nextStateTransition := stateTransition{fromState: s,
				move:    move,
				toState: nextState}
			nextStates = append(nextStates, nextStateTransition)
		}
	}

	return nextStates
}

func zobristHash(board []string) int {
	n := 1000 // rand range
	cells := 100
	// positions vs. piecetype
	// rows = tw, tb, w, b
	table := [][]int{rand.Perm(n)[:cells],
		rand.Perm(n)[:cells],
		rand.Perm(n)[:cells],
		rand.Perm(n)[:cells]}

	piece2row := map[string]int{"tw": 0, "tb": 1, "w": 2, "b": 3}

	hash := 0
	for i, piece := range board {
		if piece != "none" {
			hash ^= table[piece2row[piece]][i]
		}
	}
	return hash
}

type ttEntry struct {
	depth    int
	flag     string
	value    int
	bestMove move
}

func moveOrder(transitions []stateTransition) []stateTransition {

	// insert other strategies. Capture moves first, etc
	sort.SliceStable(transitions, func(i, j int) bool {
		return evaluate(transitions[i].toState.Board) < evaluate(transitions[j].toState.Board)
	})

	return transitions
}

type searchResult struct {
	value    int
	bestMove move
}

func alphaBeta(s state, alpha int, beta int, depth int, tt *map[int]ttEntry) searchResult {
	stateCount += 1
	olda := alpha
	// fmt.Println("Depth: ", depth, *tt)
	// check value in tt
	var n ttEntry
	stateHash := zobristHash(s.Board)
	if val, ok := (*tt)[stateHash]; ok {
		n = val
		// fmt.Println("FOUND IN TT")
	} else {
		n = ttEntry{depth: -1, flag: "", value: int(math.Inf(-1)), bestMove: move{}}
	}

	if n.depth >= depth {
		if n.flag == "exact" {
			// return n.value
			return searchResult{value: n.value, bestMove: n.bestMove}
		} else if n.flag == "lower_bound" {
			alpha = int(math.Max(float64(alpha), float64(n.value)))
		} else if n.flag == "upper_bound" {
			beta = int(math.Min(float64(beta), float64(n.value)))
		}

		if alpha >= beta {
			// return n.value
			return searchResult{value: n.value, bestMove: n.bestMove}
		}
	}

	if s.TurnType == "terminal" || depth == 0 {
		// return evaluate(s.Board)
		fmt.Println(s.TurnType)
		return searchResult{value: evaluate(s.Board), bestMove: move{}}
	}

	stateTransitions := getNextStates(s)
	orderedStateTransitions := moveOrder(stateTransitions)

	score := int(-math.Inf(-1))
	var bestMove move
	for _, stateTransition := range orderedStateTransitions {
		value := -alphaBeta(stateTransition.toState, -beta, -alpha, depth-1, tt).value
		if value > score {
			score = value
			bestMove = stateTransition.move
		}
		if score > alpha {
			alpha = score
		}
		if score > beta {
			break
		}
	}

	flag := ""
	if score <= olda {
		flag = "upper_bound"
	} else if score >= beta {
		flag = "lower_bound"
	} else {
		flag = "exact"
	}

	newTTEntry := ttEntry{depth: -1,
		flag:     flag,
		value:    score,
		bestMove: bestMove}
	(*tt)[stateHash] = newTTEntry

	return searchResult{value: alpha, bestMove: bestMove}
}

var stateCount int = 0

func chooseMove(s state, maxDepth int) move {

	if strings.Contains(s.TurnType, "placement") {
		stateTransitions := getNextStates(s)
		s := rand.NewSource(time.Now().Unix())
		r := rand.New(s) // initialize local pseudorandom generator
		randomInt := r.Intn(len(stateTransitions))
		return stateTransitions[randomInt].move
	}

	maxTime := 5 // 15s (milliseconds)
	startTime := time.Now().UnixMilli()
	outOfTime := false
	tt := map[int]ttEntry{}
	bestMove := move{}
	for i := 0; i <= maxDepth && !outOfTime; i += 1 {
		bestMove = alphaBeta(s, int(math.Inf(-1)), int(math.Inf(1)), i, &tt).bestMove
		outOfTime = int(time.Now().UnixMilli()-startTime) > maxTime
		if outOfTime {
			fmt.Println("Out of Time: depth = ", i, stateCount)
		}
	}

	return bestMove
}

func sendMove(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "text/html; charset=ascii")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")

	var receivedState state
	if r.Method == "POST" {
		err := json.NewDecoder(r.Body).Decode(&receivedState)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		move := chooseMove(receivedState, 20)
		// move := move{FromPosition: 31, ToPosition: 41, MoveType: "move"}
		json.NewEncoder(w).Encode(move)
		fmt.Println("Endpoint Hit: sendMove")
	}
}

func setup() {
	http.HandleFunc("/move", sendMove)
	fmt.Println("Serving...")
	log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
	// initialBoard := boardConfig.BoardConfig
	// // initialBoard[4] = "tb"
	// // initialBoard[93] = "tw"
	// initialState := state{initialBoard, "placement_p1"}

	// fmt.Println(chooseMove(initialState, 1000))

	setup()
}

// ------------------------------------------------------

// import (

// )

// func main() {
//
// }

// -------------------
