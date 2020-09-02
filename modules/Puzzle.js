class Puzzle {

  constructor(id, size) {
    this.puzzleContainer = document.querySelector(`#${id}`);
    this.overlay = document.querySelector('#overlay');
    this.restartButton = document.querySelector('#restart');
    this.size = size;
    this.solution = this.createSolution();
    this.start();
    this.events();
  }

  events() {
    this.puzzleContainer.addEventListener('click', this.moveTile.bind(this));
    this.restartButton.addEventListener('click', this.start.bind(this));
  }

  start() {
    this.solved = false;
    this.toggleModal();

    // Predefined grid for testing
    // let grid = [
    //   [1, 2, 3, 4],
    //   [5, 6, 7, 8],
    //   [9, 10, 11, 12],
    //   [13, 14, 0, 15],
    // ]

    let grid = this.createGrid();
    while(!this.checkGrid(grid)) {
      grid = this.createGrid();
    }
    this.grid = grid;
    this.renderGrid();
  }

  createSolution() {
    // Create solved puzzle grid
    const grid = [];
    let tile = 1;
    for (let i = 0; i < this.size; i++) {
      grid.push([]);
      for (let ii = 0; ii < this.size; ii++) {
        if (tile === (this.size * this.size)) {
          tile = 0;
        }
        grid[i].push(tile);
        tile++;
      }
    }
    return grid;
  }

  createGrid() {
    // Create an array of unused tiles
    const noOfTiles = this.size * this.size;
    const unusedTiles = [];
    for (let i = 0; i < noOfTiles; i++) {
      unusedTiles.push(i);
    }

    // Create puzzle grid
    const grid = [];
    for (let i = 0; i < this.size; i++) {
      grid.push([]);
      for (let ii = 0; ii < this.size; ii++) {
        const tileIndex = Math.floor(Math.random() * unusedTiles.length);
        const tile = unusedTiles.splice(tileIndex, 1);
        grid[i].push(tile[0]);
      }
    }
    return grid;
  }

  checkGrid(grid) {
    // Check the grid is solvable
    const evenGrid = this.size % 2 === 0;

    // Get the row number FROM THE TOP for the open space
    const openPosition = this.getTilePosition(0, grid);
    const evenRow = (this.size - openPosition.row) % 2 === 0;
    
    // Get number of inversions
    const tileList = [];
    for (let row of grid) {
      tileList.push(...row);
    }

    let inversions = 0;
    for (let i = 0; i < tileList.length; i++) {
      if (tileList[i] > 0 && tileList[i + 1] && tileList[i] > tileList[i + 1]) {
        inversions++;
      }
    }
    const evenInversions = inversions % 2 === 0;

    // Grid is solvable in the following circumstances
    // Even sized grid:
    // The blank is on an even row counting from the bottom (second-last, fourth-last, etc.) and number of inversions is odd.
    // The blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.) and number of inversions is even.
    // Odd sized grid:
    // Number of inversions is even.
    if (evenGrid && (evenRow && !evenInversions || !evenRow && evenInversions) ||
      (!evenGrid && evenInversions)) {
      return true;
    }
  }

  renderGrid() {
    // Remove any existing tiles
    while (this.puzzleContainer.firstChild) {
      this.puzzleContainer.firstChild.remove()
    }

    // Loop through the grid to render a node to the DOM for each tile
    for (let row of this.grid) {
      for (let tile of row) {
        const tileNode = document.createElement('div');
        tileNode.setAttribute('data-id', tile);
        tileNode.style.height = `calc(100% / ${this.size})`;
        tileNode.style.width = `calc(100% / ${this.size})`;
        if (tile > 0) {
          tileNode.classList.add('tile');
          tileNode.textContent = tile;
        }
        this.puzzleContainer.appendChild(tileNode);
      }
    }
  }

  moveTile(event) {
    // Find the tile that has been selected
    const tile = event.target.closest('.tile');
    if (tile) {
      const tileNumber = +tile.getAttribute('data-id');
      const move = this.findMove(tileNumber);

      // Update the grid and re-render
      if (move) {
        this.grid[move.oldPosition.row][move.oldPosition.col] = 0;
        this.grid[move.newPosition.row][move.newPosition.col] = tileNumber;
        this.renderGrid();
        this.checkSolved();
      }
    }
  }

  getTilePosition(tile, grid = this.grid) {
    // Get the row and column of a tile / number
    let position = {};
    for (let row of grid) {
      if (row.findIndex(t => t === tile) > -1) {
        position.row = grid.indexOf(row);
        position.col = row.indexOf(tile);
        break;
      }
    }
    return position;
  }

  findMove(tile) {
    const tilePosition = this.getTilePosition(tile);
    const openPosition = this.getTilePosition(0);
    
    // Check if adjacent to the blank space
    if ((tilePosition.row === openPosition.row &&
      tilePosition.col - openPosition.col < 2 &&
      tilePosition.col - openPosition.col > -2) ||
      (tilePosition.row - openPosition.row < 2 &&
      tilePosition.row - openPosition.row > -2 &&
      tilePosition.col === openPosition.col)) {
      return { oldPosition: tilePosition, newPosition: openPosition }
    }
  }

  checkSolved() {
    if (this.grid.toString() === this.solution.toString()) {
      this.solved = true;
      this.toggleModal();
    }
  }

  toggleModal() {
    // Toggle modal visibility
    if (this.solved) {
      this.overlay.classList.remove('hidden');
    } else {
      this.overlay.classList.add('hidden');
    }
  }

}

export default Puzzle;