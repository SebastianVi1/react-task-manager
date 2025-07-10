import Card from "react-bootstrap/Card";
import "./Card.css";
interface CardProps {
  description: string;
  isComplete?: boolean;
  elementId: number;
  handleDeleteOnClick: (id:number) => void;
}

function TaskCard(props: CardProps) {
  const { description, isComplete, handleDeleteOnClick, elementId} = props;
  

  return (
    <>
      <Card className="card" body>
        <p className={`card-description ${isComplete ? "completed" : ""}`}>
          {description}
        </p>
        <button className="button delete-button" onClick={()=> handleDeleteOnClick(elementId)}>
          <img src="./images/trash.png" alt="trashcan" />
        </button>
      </Card>
    </>
  );
}

export default TaskCard;
