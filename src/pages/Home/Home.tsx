import { useEffect, useState } from "react";
import TaskCard from "../../components/Card/Card";
import "./Home.css";
import axios from "axios";
import ConfirmModal from "../../components/ConfirmModal/Modal";

interface Task {
  id: number;
  description: string;
  isComplete: boolean;
}
function Home() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    //Fetch data from server
    axios
      .get("http://localhost:8085/api/get-tasks")
      .then((response) => {
        const tasks: Task[] = response.data.map((item: Task) => ({
          id: item.id,
          description: item.description,
          isComplete: Boolean(item.isComplete),
        }));
        setTaskList(tasks);
      })
      .catch((error) => {
        console.error("Error obtaining the messages:", error);
      });
  }, []);

  function deleteTask() {
    axios
      .post(`http://localhost:8085/api/delete-task/${selectedId}`)
      .then((response) => {
        console.log(response);
        setIsOpen(false);
        setSelectedId(null);
        
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }
  function handleDeleteOnClick(id:number) {
    setSelectedId(id);
    setIsOpen(true);
  }

  return (
    <div className="main-wrapper">
      <div className="main-container">
        <h2 className="title">Todo App</h2>

        <div className="add-input-container">
          <input
            type="text"
            name="add-task-input"
            id="add-task-input"
            placeholder="Add your new task..."
          />
          <button>
            <img src="./images/add.png" alt="add" />
          </button>
        </div>
        <ul className="task-list-container">
          {taskList.map((element) => {
            return (
              <li className="list-item" key={element.id}>
                <TaskCard 
                  elementId={element.id}
                  handleDeleteOnClick={handleDeleteOnClick}
                  description={element.description}
                />
              </li>
            );
          })}
        </ul>

        <div className="footer-container" style={{ display: "none" }}>
          <p>You have {taskList.length} pending items</p>
          <button>Clear all</button>
        </div>
      </div>
      <ConfirmModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onConfirm={deleteTask}
      >
        ¿Estás seguro de que quieres eliminar esta tarea?
      </ConfirmModal>
    </div>
  );
}

export default Home;
