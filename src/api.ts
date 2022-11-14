import axios from "axios";
import { parse } from "node-html-parser";
import util from "util";
import { DayMenu, DayName, Diet, WeekdayId, WeekMenu } from "./types";

const TAI_SAFKA_URL = "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli";

const dayList = [
    "mon", "tues", "wed", "thurs", "fri", "sat", "sun"
]

export function parseMenu(pageBody: string) {
    const root = parse(pageBody);
    if (!root) return;

    const dayContainers = root.querySelectorAll("tr");
    if (!dayContainers) return;

    let fullMenu: WeekMenu = new Map();

    for (let i = 0; i < 7; i++) {
        const dayHTML = dayContainers.at(i);

        if (dayHTML) {
            const [dayNameHTML, foodsHTML] = dayHTML.getElementsByTagName("td");

            const dayName = dayNameHTML.firstChild.innerText;
            const foods = foodsHTML.getElementsByTagName("p").map(e => parseFood(e.innerText)).filter(e => e.name);

            const daysMenu = {
                menu: foods
            }
            fullMenu.set(dayList[i] as WeekdayId, daysMenu);
        }else {
            fullMenu.set(dayList[i] as WeekdayId,  {menu: []});
        }
    }

    for (const dayHTML of dayContainers) {
        
        // console.log(util.inspect(daysMenu, false, 4, true))
    }
    return fullMenu;
}

function numberToWeekdayId() {
    
}

export async function pollMenu() {
    const resp = await axios.get(TAI_SAFKA_URL);

    let lastModified = resp.headers["last-modified"];

    if (typeof lastModified != "string") throw new Error("Invalid Date");


    return { currentPage: resp.data, lastModified: new Date(lastModified) };
}




function parseDay(dayName: string): DayName {
    const parsedDayName = dayName.trim().toLowerCase() as DayName;
    return parsedDayName;
}


function parseFood(foodName: string) {
    const trimmed = foodName.trim();

    let name = trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    const diets: Diet[] = [];

    const match = foodName.match(/\(?(L|G|M| |,){1,}\)?$/);
    if (match) {
        name = name.replace(match[0], "").trim();
        const dietUnparsed = match[0].trim()

        const dietParsed = dietUnparsed.replaceAll(/\(|,| |\.|\)/g, "").split("");

        for (const diet of dietParsed) {
            if (!Object.hasOwn(Diet, diet)) continue;
            diets.push(diet as Diet);
        }
    }

    const result = {
        name,
        diets
    }
    return result;
}