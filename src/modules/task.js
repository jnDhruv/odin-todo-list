import { differenceInCalendarDays } from 'date-fns';

export default function Task(taskTitle, taskDesc, taskPriority, taskDueDate) {
    let title = taskTitle;
    let desc = taskDesc;
    let priority;
    let dueDate;
    const creationDate = new Date();
    
    const setPriority = (taskPriority) => {
        if (taskPriority === 'high' || taskPriority === 'medium' || taskPriority === 'low') {
            priority = taskPriority;
        }
    }

    const setDueDate = (date) => {
        const newDate = new Date(date);
        // duedate can only either be ahead or equal to creation date
        if (differenceInCalendarDays(newDate, creationDate) > -1) {
            dueDate = newDate;
        }
    };

    const getPriority = () => priority;
    const getDueDate = () => dueDate;

    setPriority(taskPriority)
    setDueDate(taskDueDate);

    function report() {
        return {title, desc, priority, creationDate, dueDate};
    }

    return {
        title,
        desc,
        creationDate,
        setPriority,
        getPriority,
        setDueDate,
        getDueDate,
        report,
    };
};