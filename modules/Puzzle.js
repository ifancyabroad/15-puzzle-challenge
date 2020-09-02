class Puzzle {

  constructor(id, size) {
    this.puzzleContainer = document.querySelector(`#${id}`)
    this.size = size;
    this.completed = false;
    this.grid = this.createGrid();
    this.renderGrid();
  }

  events() {

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
        grid[i].push(tile);
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

}

export default Puzzle;