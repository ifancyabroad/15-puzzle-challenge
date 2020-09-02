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
    if (tile && this.findMove(tile)) {
      console.log(tile);
    }
  }

  findMove(tile) {
    // Find the tile and the open space in the grid
    const tileNumber = +tile.getAttribute('data-id');
    let tileGridIndex;
    let tileRowIndex;
    let openGridIndex;
    let openRowIndex;
    for (let row of this.grid) {
      if (row.findIndex(t => t === 0) > -1) {
        openGridIndex = this.grid.indexOf(row);
        openRowIndex = row.indexOf(0);
      }
      if (row.findIndex(t => t === tileNumber) > -1) {
        tileGridIndex = this.grid.indexOf(row);
        tileRowIndex = row.indexOf(tileNumber);
      }
    }

    // Check if adjacent to the blank space
    if (tileGridIndex === openGridIndex &&
      tileRowIndex - openRowIndex < 2 &&
      tileRowIndex - openRowIndex > -2) {
      console.log('0 is left or right')
    } else if (tileGridIndex - openGridIndex < 2 &&
      tileGridIndex - openGridIndex > -2 &&
      tileRowIndex === openRowIndex) {
      console.log('0 i up or down');
    }
  }

}

export default Puzzle;