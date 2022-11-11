import https from "https";
import { parse } from "node-html-parser";
import util from "util";

const TAI_SAFKA_URL = "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli";

type DayName = "maanantai" | "tiistai" | "keksiviikko" | "torstai" | "perjantai" | "lauantai" | "sunnuntai";


enum Diet {
    L = "L",
    M = "M",
    G = "G",
}

async function getMenu() {
    https.get(TAI_SAFKA_URL, (resp) => {
        let data = "";
      
        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          const root = parse(data);
          if (!root) return;
      
          const dayContainers = root.querySelectorAll("tr");
          if (!dayContainers) return;
      
          for (const dayHTML of dayContainers) {
              const [dayNameHTML, foodsHTML] = dayHTML.getElementsByTagName("td");
      
              const dayName = dayNameHTML.firstChild.innerText;
              const foods = foodsHTML.getElementsByTagName("p").map(e => parseFood(e.innerText)).filter(e => e.name);
              
              const daysMenu = {
                  day: parseDay(dayName),
                  menu: foods
              }
              console.log(util.inspect(daysMenu, false, 4, true))
          }
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
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