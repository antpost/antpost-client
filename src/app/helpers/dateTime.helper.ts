import { AgeRange } from '../models/enums';

export class DateTimeHelper {
    public static getAge(birthDate: Date) {
        var now = new Date();

        function isLeap(year) {
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        }

        // days since the birthdate
        var days = Math.floor((now.getTime() - birthDate.getTime())/1000/60/60/24);
        var age = 0;
        // iterate the years
        for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++){
            var daysInYear = isLeap(y) ? 366 : 365;
            if (days >= daysInYear){
                days -= daysInYear;
                age++;
                // increment the age only if there are available enough days for the year.
            }
        }
        return age;
    }

    public static inAgeRange(ageRange: number, age) {
        switch (ageRange) {
            case AgeRange.Under15:
                return age < 15;
            case AgeRange.From15To24:
                return age >= 15 && age <= 24;
            case AgeRange.From25To34:
                return age >= 25 && age <= 34;
            case AgeRange.From35To44:
                return age >= 35 && age <= 44;
            case AgeRange.Above45:
                return age >= 45;
            default:
                return false;
        }
    }
}
