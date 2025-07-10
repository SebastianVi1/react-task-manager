import Card from "react-bootstrap/Card";
import "./Card.css";
interface CardProps {
  description: string;
  isComplete?: boolean;
}

function TaskCard(props: CardProps) {
  const { description, isComplete } = props;
  return (
    <>
      <Card className="card" body>
        <p className={`card-description ${isComplete ? "completed" : ""}`}>
          {description}
        </p>
        <div className="buttons-container">
          <button className="button complete-button"></button>
          <button className="button delete-button"></button>
        </div>
      </Card>
    </>
  );
}

export default TaskCard;
