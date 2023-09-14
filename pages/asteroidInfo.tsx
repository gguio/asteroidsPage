import Link from "next/link";

import { useContext } from "react";
import { AppContext } from "../lib/context";

import utilStyles from "../styles/utils.module.css";

export default function AsteroidInfo() {
    const { asteroidInfo } = useContext(AppContext);

    const getDateDescription = (currDate: string) => {
        const currentDate = new Date(currDate);
        const day = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();

        let monthName = "";
        switch (month) {
            case 0:
                monthName = "января";
                break;
            case 1:
                monthName = "февраля";
                break;
            case 2:
                monthName = "марта";
                break;
            case 3:
                monthName = "апреля";
                break;
            case 4:
                monthName = "мая";
                break;
            case 5:
                monthName = "июня";
                break;
            case 6:
                monthName = "июля";
                break;
            case 7:
                monthName = "августа";
                break;
            case 8:
                monthName = "сентября";
                break;
            case 9:
                monthName = "октября";
                break;
            case 10:
                monthName = "ноября";
                break;
            case 11:
                monthName = "декабря";
                break;
        }

        return `${day} ${monthName} ${year} ${hours}:${minutes}`;
    };

    return (
        <div className={utilStyles.container}>
            {asteroidInfo && (
                <div className={utilStyles.containerInner}>
                    <div>
                        <h1>
                            {asteroidInfo.name
                                .replace("(", "")
                                .replace(")", "")}
                        </h1>

                        <p>
                            <b>Относительная скорость</b> :{" "}
                            {Math.floor(
                                asteroidInfo.close_approach_data[0]
                                    .relative_velocity.kilometers_per_hour
                            )}{" "}
                            км/ч
                        </p>

                        <p>
                            <b>Время наибольшего сближения</b> :{" "}
                            {getDateDescription(
                                asteroidInfo.close_approach_data[0]
                                    .epoch_date_close_approach
                            )}
                        </p>

                        <p>
                            <b>Наименьшее растояние до Земли</b> :{" "}
                            {Math.floor(
                                asteroidInfo.close_approach_data[0]
                                    .miss_distance.kilometers
                            )
                                .toLocaleString("ru-RU")
                                .replace(/,/g, " ")}{" "}
                            км
                        </p>

                        <p>
                            <b>Центр орбиты</b> :{" "}
                            {asteroidInfo.close_approach_data[0]
                                .orbiting_body == "Earth"
                                ? "Земля"
                                : asteroidInfo.close_approach_data[0]
                                      .orbiting_body}
                        </p>

                        <p>
                            <b>Размер</b> :{" "}
                            {asteroidInfo.estimated_diameter.meters
                                .estimated_diameter_max > 100
                                ? "большой"
                                : asteroidInfo.estimated_diameter.meters
                                      .estimated_diameter_max > 25
                                ? "средний"
                                : "маленький"}
                        </p>

                        <p>
                            {asteroidInfo.is_potentially_hazardous_asteroid ? (
                                <b>Потенциально опасен ⚠️</b>
                            ) : (
                                "Не опасен"
                            )}
                        </p>
                    </div>
                    <div>
                        <img
                            src="/images/asteroid.svg"
                            width={
                                asteroidInfo.estimated_diameter.meters
                                    .estimated_diameter_max
                            }
                            alt=""
                        />
                    </div>
                </div>
            )}

            <Link
                className={utilStyles.buttonSend + " " + utilStyles.buttonBack}
                href="/"
            >
                Обратно
            </Link>
        </div>
    );
}
