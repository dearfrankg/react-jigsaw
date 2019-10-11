import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import originalImage from "./images/ny_original.jpg";
import "./App.css";

const getPieces = () =>
  [...Array(40)].map((_, i) => ({
    img: `ny_${("0" + (i + 1)).substr(-2)}.jpg`,
    order: i,
    board: "shuffled"
  }));

const shufflePieces = pieces => {
  const shuffled = [...pieces];
  let i = shuffled.length - 1;
  while (i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const pieces = getPieces();
const initialState = {
  pieces,
  shuffled: shufflePieces(pieces),
  solved: [...Array(40)]
};
const JigsawContext = React.createContext();

const JigsawProvider = props => {
  const jigsawInfo = {
    ...initialState,
    update: (obj1, obj2) => {
      setState({ ...state, ...obj1, ...obj2 });
    }
  };
  const [state, setState] = useState(jigsawInfo);

  return <JigsawContext.Provider value={jigsawInfo}>{props.children}</JigsawContext.Provider>;
};

const Jigsaw = () => (
  <div className="jigsaw">
    <Shuffled />
    <Solved />
  </div>
);

const Shuffled = () => {
  const context = useContext(JigsawContext);

  return (
    <ul className="jigsaw__shuffled-board">
      {context.shuffled.map((piece, i) => (
        <Piece {...{ key: i, piece, index: i, boardName: "shuffled" }} />
      ))}
    </ul>
  );
};

const Solved = () => {
  const context = useContext(JigsawContext);

  return (
    <ol className="jigsaw__solved-board" style={{ backgroundImage: `url(${originalImage})` }}>
      {context.solved.map((piece, i) => (
        <Piece {...{ key: i, piece, index: i, boardName: "solved" }} />
      ))}
    </ol>
  );
};

const Piece = ({ piece, index, boardName }) => {
  const context = useContext(JigsawContext);

  return (
    <li onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, index, boardName, context)}>
      {piece && (
        <img
          draggable
          onDragStart={e => handleDragStart(e, piece.order)}
          src={require(`./images/${piece.img}`)}
          alt="puzzle piece"
        />
      )}
    </li>
  );
};

const handleDragStart = (e, order) => {
  const dt = e.dataTransfer;
  dt.setData("text/plain", order);
  dt.effectAllowed = "move";
};

const handleDrop = (e, index, targetName, context) => {
  let target = context[targetName];
  if (target[index]) return;

  const pieceOrder = e.dataTransfer.getData("text");
  const pieceData = context.pieces.find(p => p.order === +pieceOrder);
  const origin = context[pieceData.board];

  if (targetName === pieceData.board) target = origin;
  origin[origin.indexOf(pieceData)] = undefined;
  target[index] = pieceData;
  pieceData.board = targetName;

  context.update({ [pieceData.board]: origin }, { [targetName]: target });
};

const App = () => (
  <JigsawProvider>
    <Jigsaw />
  </JigsawProvider>
);

ReactDOM.render(<App />, document.querySelector("#root"));
