import Card from "react-bootstrap/Card";
import "./Card.css";
interface CardProps {
  description: string;
  isComplete?: boolean;
  elementId: number;
  handleDeleteOnClick: (id:number) => void;
  onClickHandler: (id:number) => void;
}

function TaskCard(props: CardProps) {
  const { description, isComplete, handleDeleteOnClick, elementId, onClickHandler} = props;
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete button
    console.log("Delete button clicked for elementId:", elementId);
    handleDeleteOnClick(elementId);
  };

  const handleCardClick = () => {
    console.log("Card clicked for elementId:", elementId);
    onClickHandler(elementId);
  };

  return (
    <>
      <Card className={`card ${isComplete ? 'completed' : ''}`} onClick={handleCardClick} body>
        <p className={`card-description ${isComplete ? "completed" : ""}`}>
          {description}
        </p>
        <button className="button delete-button" onClick={handleDeleteClick}>
          <img src="./images/trash.png" alt="trashcan" />
        </button>
      </Card>
    </>
  );
}

export default TaskCard;
