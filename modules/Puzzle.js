class Puzzle {

  constructor(id, size) {
    this.puzzleContainer = document.querySelector(`#${id}`)
    this.size = size;
    this.completed = false;
    this.grid = this.createGrid();
    this.renderGrid();
    this.events();
  }

  events() {
    this.puzzleContainer.addEventListener('click', this.moveTile.bind(this));
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
    const tile = event.target.closest('.tile');
    if (tile) {
      const tileNumber = +tile.getAttribute('data-id');
      const move = this.findMove(tileNumber);
      if (move) {
        this.grid[move.oldPosition.row][move.oldPosition.col] = 0;
        this.grid[move.newPosition.row][move.newPosition.col] = tileNumber;
        this.renderGrid();
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

}

export default Puzzle;