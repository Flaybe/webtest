
let startNode = null;
let endNode = null;
const START = 'start';
const END = 'end';
const OBSTACLE = 'obstacle';
const grid = [];
const rows = 10;
const cols = 10;

        document.addEventListener("DOMContentLoaded", () => {




            const gridElement = document.getElementById('grid');
        
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.addEventListener('click', () => handleCellClick(r, c, cell));
                    grid[r] = grid[r] || [];
                    grid[r][c] = { element: cell, type: null }; 
                    gridElement.appendChild(cell);
                }
            }
        });
        

        function handleCellClick(row, col, cell) {
            if (!startNode) {
                cell.classList.add(START);
                grid[row][col].type = START;
                startNode = { row, col };
            } else if (!endNode && grid[row][col].type !== START) {
                cell.classList.add(END);
                grid[row][col].type = END;
                endNode = { row, col };
            } else if (grid[row][col].type !== START && grid[row][col].type !== END) {
                cell.classList.toggle(OBSTACLE);
                grid[row][col].type = grid[row][col].type === OBSTACLE ? null : OBSTACLE;
            }
        }

        function resetGrid() {
            startNode = null;
            endNode = null;
            grid.forEach(row => row.forEach(cell => {
                cell.type = null;
                cell.element.className = 'cell';
            }));
        }

        function startBFS() {
            if (!startNode || !endNode) {
                alert('Please select both a start and an end point.');
                return;
            }

            const queue = [startNode];
            const visited = new Set();
            const parent = new Map();
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0] // Right, Down, Left, Up
            ];

            const key = (r, c) => `${r},${c}`;

            while (queue.length > 0) {
                const { row, col } = queue.shift();

                if (key(row, col) === key(endNode.row, endNode.col)) {
                    highlightPath(parent);
                    return;
                }

                for (const [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (
                        newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols &&
                        !visited.has(key(newRow, newCol)) &&
                        grid[newRow][newCol].type !== OBSTACLE
                    ) {
                        visited.add(key(newRow, newCol));
                        parent.set(key(newRow, newCol), { row, col });
                        queue.push({ row: newRow, col: newCol });
                        grid[newRow][newCol].element.classList.add('visited');
                    }
                }
            }

            alert('No path found!');
        }
        function highlightPath(parent) {
            let currentKey = `${endNode.row},${endNode.col}`;
            while (currentKey !== `${startNode.row},${startNode.col}`) {
            const [row, col] = currentKey.split(',').map(Number);
            grid[row][col].element.classList.add('path');
            currentKey = `${parent.get(currentKey).row},${parent.get(currentKey).col}`;
            }
            grid[startNode.row][startNode.col].element.classList.add('path'); // Highlight the start node as well
        }