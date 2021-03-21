import { ChatCommand } from "./types";

interface ticTacToeState {
    cells: Array<' '|'X'|'O'>;
    turn?: 'X'|'O';
}

function newBoard() {
    return ({
        cells: Array.from({ length: 9 }).fill(' '),
        turn: 'X',
    });
}

function display({ cells }) {
    return (''
        + ' ' + cells[0] + ' | ' + cells[1] + ' | ' + cells[2] + ' \n'
        + '---+---+---\n'
        + ' ' + cells[3] + ' | ' + cells[4] + ' | ' + cells[5] + ' \n'
        + '---+---+---\n'
        + ' ' + cells[6] + ' | ' + cells[7] + ' | ' + cells[8] + ' \n'
    );
}

function move(
    { cells, turn }: ticTacToeState,
    position: number,
): { 
    newState?: ticTacToeState, error?: string 
} {
    if (cells[position-1] !== ' ') return { error: "Can't go there!" };
    const newCells = [...cells];
    newCells[position-1] = turn;
    const newTurn = (turn === 'X' ? 'O' : 'X');
    return {
        newState: {
            cells: newCells,
            turn: newTurn,
        }
    };
}

const command: ChatCommand = ({
    state, user, channel, args,
}: { 
    state: ticTacToeState, 
    user: string, 
    channel: string, 
    args: string[],
}) => {
    if (args.length == 2 && args[1] === 'start') {
        const newState = newBoard();
        return {
            newState,
            replies: [{ 
                channel, 
                user,
                message: display(newState),
            }],
        };
    } else if (args.length == 3 && args[1] === 'move') {
        const position = parseInt(args[2]);
        const { newState, error } = move(state as ticTacToeState, position);
        return {
            newState,
            replies: [{
                channel,
                user,
                message: error || display(newState),
            }]
        }
    }

    return { 
        newState: state, 
        replies: [{
            channel,
            user,
            message: "Commands: start, move",
        }]
    }
};
export default command;
