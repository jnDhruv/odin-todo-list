import { differenceInCalendarDays } from "date-fns";

export default {
    validDueDate(date) {
        if (differenceInCalendarDays(date, new Date()) > -1) {
            return true;
        }
        return false;
    }
}