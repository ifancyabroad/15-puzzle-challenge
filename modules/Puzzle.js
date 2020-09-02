class Puzzle {

  constructor(id, size) {
    this.puzzleContainer = document.querySelector(`#${id}`);
    this.size = size;
    this.solution = this.createSolution();
    this.createModal();
    this.start();
    this.events();
  }

  events() {
    this.puzzleContainer.addEventListener('click', this.moveTile.bind(this));
    this.restartButton.addEventListener('click', this.start.bind(this));
  }

  start() {
    this.overlay.style.display = 'none';
    this.grid = this.createGrid();
    this.renderGrid();
  }

  createModal() {
    // Create the modal to appear once the puzzle is solved
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    this.overlay.style.display = 'none';
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const title = document.createElement('h1');
    title.textContent = 'Congratulations!';
    this.restartButton = document.createElement('button');
    this.restartButton.textContent = 'Try Again';

    document.body.appendChild(this.overlay);
    this.overlay.appendChild(modal);
    modal.appendChild(title);
    modal.appendChild(this.restartButton);
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

  getTilePosition(tile) {
    // Get the row and column of a tile / number
    let position = {};
    for (let row of this.grid) {
      if (row.findIndex(t => t === tile) > -1) {
        position.row = this.grid.indexOf(row);
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
      this.overlay.style.display = 'block';
    }
  }

}

export default Puzzle;