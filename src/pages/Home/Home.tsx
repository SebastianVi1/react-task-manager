import { useEffect, useState } from "react";
import TaskCard from "../../components/Card/Card";
import "./Home.css";

function Home() {
  const [description, setDescription] = useState<string>("");
  const [isComplete, setIsCompleate] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<object[]>([]);
  const compleateTask = () => {
    setIsCompleate(true);
  };

  const cardStyle = {};
  return (
    <div className="main-wrapper">
      <div className="main-container">
        <h2 className="title">Todo App</h2>

        <div className="add-input-container">
          <input type="text" name="add-task-input" id="add-task-input" />
          <button>Add</button>
        </div>
        <div className="task-list-container">
          <TaskCard description={"hola que tal"} isComplete={false} />
        </div>
        <div className="footer-container">
          <p>You have 3 pendig items</p>
          <button>Clear all</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
