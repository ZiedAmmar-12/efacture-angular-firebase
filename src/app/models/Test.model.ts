export interface SubTask {
    name: string;
    description: string;
    completed: boolean;
  }
  
  export interface Task {
    name: string;
    description: string;
    subTasks: SubTask[];
  }