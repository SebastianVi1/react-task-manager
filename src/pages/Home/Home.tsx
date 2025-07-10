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
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

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
      .delete(`http://localhost:8085/api/delete-task/${selectedId}`)
          .then((response) => {
      console.log(response);
      // Remover la tarea del estado
      setTaskList(prevTasks => prevTasks.filter(task => task.id !== selectedId));
      setIsOpen(false);
      setSelectedId(null);
    })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }
  function handleDeleteOnClick(id:number) {
    setSelectedId(id);
    setIsOpen(true);
  }

  function addTask(){
    if (inputValue.trim() == '') {
      alert('Add some text to the input');
      return;
    }
    
    axios.post("http://localhost:8085/api/add-task", {
      description: inputValue,
      isComplete: false,
    })
    .then((response) => {
      console.log("TaskCreated:", response.data);
      console.log("Response structure:", JSON.stringify(response.data, null, 2));
      
      const newTask: Task = {
        id: response.data.id,
        description: response.data.description,
        isComplete: Boolean(response.data.isComplete)
      };
      
      console.log("New task object:", newTask);
      setTaskList(prevTasks => [...prevTasks, newTask]);
      setInputValue("");
    })
    .catch((error) => {
      console.error("Error creating task:", error);
    });
  }

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  }

    function deleteAll(){
    axios.post('http://localhost:8085/api/delete-all')
    .then((response) => {
      console.log("Deleted successfully");
      console.log(response.status);
      setTaskList([]);
      setIsDeleteAllOpen(false);
    })
    .catch((error) => {
      console.error("Error deleting tasks:", error);
    })
  }

  function handleDeleteAllClick() {
    setIsDeleteAllOpen(true);
  }

  const footerStyle = {
    "display": "flex",
    "justifyContent": "space-between",
    "alignItems": "center",
    "padding": "15px 20px",
    "height": "50px",
    
    "borderTop": "1px solid #e9ecef",
    "borderRadius": "0 0 8px 8px",
    "marginTop": "10px"
  }


  return (

   
    <div className="main-wrapper">
      <div className="main-container">
        <h2 className="title">Todo App</h2>
        
        <div className="add-input-container">
          <input
            value={inputValue}
            onChange={handleInputChanges}
            onKeyPress={handleKeyPress}
            type="text"
            name="add-task-input"
            id="add-task-input"
            placeholder="Add your new task..."
          />
          <button onClick={addTask}>
            <img src="./images/add.png" alt="add" />
          </button>
        </div>
        <ul className="task-list-container">
          {taskList.map((element) => {
            console.log("Rendering element:", element);
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

        {taskList.length > 0 && (
          <div className="footer-container" style={footerStyle}>
            <p style={{ 
              margin: 0, 
              color: "#6c757d", 
              fontSize: "14px",
              fontWeight: "500"
            }}>
              You have {taskList.length} pending item{taskList.length !== 1 ? 's' : ''}
            </p>
            <button 
              onClick={handleDeleteAllClick}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "0px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500"
              }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      <ConfirmModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onConfirm={deleteTask}
      >
        ¿Estás seguro de que quieres eliminar esta tarea?
      </ConfirmModal>
      
      <ConfirmModal 
        isOpen={isDeleteAllOpen} 
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={deleteAll}
      >
        ¿Estás seguro de que quieres eliminar todas las tareas? Esta acción no se puede deshacer.
      </ConfirmModal>
    </div>
  );
}

export default Home;
