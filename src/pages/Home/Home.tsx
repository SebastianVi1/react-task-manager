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
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    //Fetch data from server
    axios
      .get("http://localhost:8085/api/get-tasks")
      .then((response) => {
        // Ensure proper boolean conversion from server response
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
    console.log("deleteTask called with selectedId:", selectedId);
    
    if (!selectedId) {
      console.error("No task ID selected for deletion");
      alert("Error: No task selected for deletion");
      return;
    }

    console.log(`Attempting to delete task with ID: ${selectedId}`);
    
    axios
      .delete(`http://localhost:8085/api/delete-task/${selectedId}`)
      .then((response) => {

        
        // Update local state
        setTaskList(prevTasks => prevTasks.filter(task => task.id !== selectedId));
        setIsOpen(false);
        setSelectedId(null);
        
        console.log("Task deleted successfully from local state");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        // Keep modal open if there's an error
        alert("Error deleting task. Please try again.");
      });
  }

  function handleDeleteOnClick(id:number) {
    console.log("handleDeleteOnClick called with id:", id);
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
      
      // Ensure proper boolean conversion from server response
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
  
  function clickCard(id: number){
    // Find the current task
    const currentTask = taskList.find((task) => task.id === id);
    if (!currentTask) return;

    // Toggle the completion status
    const newIsComplete = !currentTask.isComplete;
    
    axios.put(`http://localhost:8085/api/complete-task/${id}`, {
      description: currentTask.description,
      isComplete: newIsComplete
    })
    .then((response) => {
      console.log(`Task ${id} updated to ${newIsComplete ? 'completed' : 'pending'}`);
      
      // Update the task in local state
      setTaskList(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? { ...task, isComplete: newIsComplete }
            : task
        )
      );
      
      setSelectedId(null);
    }).catch((error) => {
      console.error("Error updating task:", error);
    })
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

                {/*  Card */}
                <TaskCard 
                  onClickHandler={clickCard}
                  elementId={element.id}
                  handleDeleteOnClick={handleDeleteOnClick}
                  description={element.description}
                  isComplete={element.isComplete}
                />
              </li>
            );
          })}
        </ul>

        {taskList.length > 0 && (
          <div className="footer-container">
            <p className="footer-text">
              You have {taskList.length} pending item{taskList.length !== 1 ? 's' : ''}
            </p>
            <button 
              onClick={handleDeleteAllClick}
              className="clear-all-button"
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
       Are you sure you want to delete the task?
      </ConfirmModal>
    </div>
  );
}

export default Home;
