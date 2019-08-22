import React, { Component } from "react";
import ReactDOM from "react-dom";
import originalImage from "./images/ny_original.jpg";
import "./App.css";

class Jigsaw extends Component {
  constructor() {
    super();

    const pieces = [...Array(40)].map((_, i) => ({
      img: `ny_${("0" + (i + 1)).substr(-2)}.jpg`,
      order: i,
      board: "shuffled"
    }));

    this.state = {
      pieces,
      shuffled: this.shufflePieces(pieces),
      solved: [...Array(40)]
    };
  }

  handleDrop(e, index, targetName) {
    let target = this.state[targetName];
    if (target[index]) return;

    const pieceOrder = e.dataTransfer.getData("text");
    const pieceData = this.state.pieces.find(p => p.order === +pieceOrder);
    const origin = this.state[pieceData.board];

    if (targetName === pieceData.board) target = origin;
    origin[origin.indexOf(pieceData)] = undefined;
    target[index] = pieceData;
    pieceData.board = targetName;

    this.setState({ [pieceData.board]: origin, [targetName]: target });
  }

  handleDragStart(e, order) {
    const dt = e.dataTransfer;
    dt.setData("text/plain", order);
    dt.effectAllowed = "move";
  }

  renderShuffled() {
    return (
      <ul className="jigsaw__shuffled-board">
        {this.state.shuffled.map((piece, i) => this.renderPieceContainer(piece, i, "shuffled"))}
      </ul>
    );
  }

  renderSolved() {
    return (
      <ol className="jigsaw__solved-board" style={{ backgroundImage: `url(${originalImage})` }}>
        {this.state.solved.map((piece, i) => this.renderPieceContainer(piece, i, "solved"))}
      </ol>
    );
  }

  render() {
    return (
      <div className="jigsaw">
        {this.renderShuffled()}
        {this.renderSolved()}
      </div>
    );
  }

  renderPieceContainer(piece, index, boardName) {
    return (
      <li
        key={index}
        onDragOver={e => e.preventDefault()}
        onDrop={e => this.handleDrop(e, index, boardName)}
      >
        {piece && (
          <img
            draggable
            onDragStart={e => this.handleDragStart(e, piece.order)}
            src={require(`./images/${piece.img}`)}
            alt="puzzle piece"
          />
        )}
      </li>
    );
  }

  shufflePieces(pieces) {
    const shuffled = [...pieces];

    let i = shuffled.length - 1;
    while (i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
}

ReactDOM.render(<Jigsaw />, document.querySelector("#root"));
