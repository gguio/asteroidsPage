import { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../lib/context";

import { useRouter } from "next/router";
import Link from "next/link";

import useSWR from "swr";

import { Waypoint } from "react-waypoint";

import utilStyles from "../styles/utils.module.css";

function Header({ title }) {
    return <h1>{title ? title : "Default title"}</h1>;
}

const List = ({ isBacket }: { isBacket?: boolean }) => {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [data, setData] = useState<any>(null);
    const [isKm, setIsKm] = useState(true);

    const ref = useRef(null);

    const { asteroidsInBacket, setAsteroidsInBacket, setAsteroidInfo } =
        useContext(AppContext);

    useEffect(() => {
        if (isBacket) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isBacket]);

    const getPreviousDate = (back: number = 1) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - back);
        return currentDate.toISOString().split("T")[0];
    };

    const getDateDescription = (currDate: string) => {
        const currentDate = new Date(currDate);
        const day = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

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

        return `${day} ${monthName} ${year}`;
    };

    const getDiameter = (asteroid: any) => {
        const diameter =
            asteroid.estimated_diameter.meters.estimated_diameter_max -
            asteroid.estimated_diameter.meters.estimated_diameter_min;
        return diameter.toFixed(0);
    };

    const updateData = (loadData: any) => {
        setData((prev) => {
            if (prev) {
                return {
                    ...prev,
                    near_earth_objects: {
                        ...prev.near_earth_objects,
                        ...loadData.near_earth_objects,
                    },
                };
            } else {
                return loadData;
            }
        });
    };

    const loadData = useSWR(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=dnYKNt8UvBCMcqNs5cnCIFwnCwfhP2on5OPN3VnH`,
        (url) =>
            fetch(url)
                .then((res) => res.json())
                .then((data) => updateData(data))
    );

    return (
        <div className={utilStyles.right}>
            {!isBacket ? (
                <div>
                    <h2>Ближайшие подлеты астероидов</h2>
                    <button
                        className={
                            isKm ? utilStyles.buttonActive : utilStyles.button
                        }
                        onClick={() => {
                            setIsKm(true);
                        }}
                    >
                        в километрах
                    </button>
                    |
                    <button
                        className={
                            !isKm ? utilStyles.buttonActive : utilStyles.button
                        }
                        onClick={() => {
                            setIsKm(false);
                        }}
                    >
                        в лунных орбитах
                    </button>
                </div>
            ) : (
                <h2 ref={ref}>Заказ отправлен!</h2>
            )}

            {!isBacket ? (
                <ul className={utilStyles.list}>
                    {data &&
                        Object.keys(data.near_earth_objects).map((key) => (
                            <div>
                                {data.near_earth_objects[key].map(
                                    (asteroid: any) => (
                                        <li key={asteroid.id}>
                                            <div
                                                className={
                                                    utilStyles.approachDate
                                                }
                                            >
                                                {getDateDescription(
                                                    asteroid
                                                        .close_approach_data[0]
                                                        .close_approach_date
                                                )}
                                            </div>
                                            <div className={utilStyles.row1}>
                                                <div
                                                    className={
                                                        utilStyles.distance
                                                    }
                                                >
                                                    <div>
                                                        {isKm
                                                            ? Math.floor(
                                                                  asteroid
                                                                      .close_approach_data[0]
                                                                      .miss_distance
                                                                      .kilometers
                                                              )
                                                                  .toLocaleString(
                                                                      "ru-RU"
                                                                  )
                                                                  .replace(
                                                                      /,/g,
                                                                      " "
                                                                  )
                                                            : Math.floor(
                                                                  asteroid
                                                                      .close_approach_data[0]
                                                                      .miss_distance
                                                                      .lunar
                                                              )
                                                                  .toLocaleString(
                                                                      "ru-RU"
                                                                  )
                                                                  .replace(
                                                                      /,/g,
                                                                      " "
                                                                  )}
                                                        {isKm
                                                            ? " км"
                                                            : " лунных орбит"}
                                                    </div>
                                                    <img
                                                        src="/images/arrow.svg"
                                                        alt=""
                                                    />
                                                </div>

                                                <img
                                                    src="/images/asteroid.svg"
                                                    className={
                                                        utilStyles.imgAsteroid
                                                    }
                                                    width={
                                                        Number(
                                                            getDiameter(
                                                                asteroid
                                                            )
                                                        ) / 5
                                                    }
                                                    alt=""
                                                />

                                                <div
                                                    className={
                                                        utilStyles.asteroidName
                                                    }
                                                >
                                                    <Link
                                                        href={`/asteroidInfo`}
                                                        onClick={() => {
                                                            setAsteroidInfo(
                                                                asteroid
                                                            );
                                                        }}
                                                    >
                                                        <div>
                                                            {asteroid.name
                                                                .replace(
                                                                    "(",
                                                                    ""
                                                                )
                                                                .replace(
                                                                    ")",
                                                                    ""
                                                                )}
                                                        </div>
                                                    </Link>
                                                    <div>
                                                        ⌀{" "}
                                                        {getDiameter(asteroid)}{" "}
                                                        м
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={utilStyles.row1}>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            !asteroidsInBacket.includes(
                                                                asteroid
                                                            )
                                                        ) {
                                                            setAsteroidsInBacket(
                                                                (prev) => {
                                                                    return [
                                                                        ...prev,
                                                                        asteroid,
                                                                    ];
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    className={
                                                        utilStyles.buttonGet
                                                    }
                                                >
                                                    Заказать
                                                </button>
                                                <div>
                                                    {asteroid.is_potentially_hazardous_asteroid
                                                        ? "⚠️ Опасен"
                                                        : "Не опасен"}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                )}
                            </div>
                        ))}
                </ul>
            ) : (
                <ul className={utilStyles.list}>
                    {asteroidsInBacket.map((asteroid: any) => (
                        <li key={asteroid.id}>
                            <div className={utilStyles.approachDate}>
                                {getDateDescription(
                                    asteroid.close_approach_data[0]
                                        .close_approach_date
                                )}
                            </div>
                            <div className={utilStyles.row1}>
                                <div className={utilStyles.distance}>
                                    <div>
                                        {isKm
                                            ? Math.floor(
                                                  asteroid
                                                      .close_approach_data[0]
                                                      .miss_distance.kilometers
                                              )
                                                  .toLocaleString("ru-RU")
                                                  .replace(/,/g, " ")
                                            : Math.floor(
                                                  asteroid
                                                      .close_approach_data[0]
                                                      .miss_distance.lunar
                                              )
                                                  .toLocaleString("ru-RU")
                                                  .replace(/,/g, " ")}
                                        {isKm ? " км" : " лунных орбит"}
                                    </div>
                                    <img src="/images/arrow.svg" alt="" />
                                </div>

                                <img
                                    src="/images/asteroid.svg"
                                    className={utilStyles.imgAsteroid}
                                    width={Number(getDiameter(asteroid)) / 5}
                                    alt=""
                                />

                                <div className="asteroidName">
                                    <div>
                                        {asteroid.name
                                            .replace("(", "")
                                            .replace(")", "")}
                                    </div>
                                    <div>⌀ {getDiameter(asteroid)} м</div>
                                </div>
                            </div>

                            <div className={utilStyles.row1}>
                                <div>
                                    {asteroid.is_potentially_hazardous_asteroid
                                        ? "⚠️ Опасен"
                                        : "Не опасен"}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className={utilStyles.waypoint}>
                <Waypoint
                    onEnter={() => {
                        setDate(getPreviousDate());
                    }}
                />
            </div>
        </div>
    );
};

export default function HomePage() {
    const [isBacket, setIsBacket] = useState(false);

    const router = useRouter();

    const { asteroidsInBacket, setAsteroidsInBacket } = useContext(AppContext);

    return (
        <div className={utilStyles.container}>
            {!isBacket ? (
                <div className={utilStyles.backet}>
                    <div>
                        <div>Корзина</div>
                        <div>Астероидов : {asteroidsInBacket.length}</div>
                    </div>

                    <button
                        onClick={() => {
                            setIsBacket((prev) => !prev);
                        }}
                        className={utilStyles.buttonSend}
                    >
                        Отправить
                    </button>
                </div>
            ) : (
                <div className={utilStyles.backet}>
                    <button
                        onClick={() => {
                            setIsBacket((prev) => !prev);
                            setAsteroidsInBacket([]);
                        }}
                        className={utilStyles.buttonSend}
                    >
                        Вернуться к списку
                    </button>
                </div>
            )}

            <div className={utilStyles.left}>
                <p className={utilStyles.armageddon}>armageddon 2023</p>
                <p>ООО "Команда имени Б. Уиллиса"</p>
                <p>Взрываем астероиды с 1998 года</p>
                <img
                    className={utilStyles.earth}
                    src="/images/earth.svg"
                    alt=""
                />
            </div>

            <List isBacket={isBacket} />
        </div>
    );
}
