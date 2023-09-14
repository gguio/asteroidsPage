import Link from "next/link";

import utilStyles from "../../styles/utils.module.css";

export async function getServerSideProps({ params }) {
    const res = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${params.asteroidID}?api_key=dnYKNt8UvBCMcqNs5cnCIFwnCwfhP2on5OPN3VnH`
    );
    const asteroidData = await res.json();

    return {
        props: {
            asteroidData,
        },
    };
}

export default function AsteroidData({ asteroidData }) {
    return (
        <div className={utilStyles.container}>
            <h1>{asteroidData.name.replace("(", "").replace(")", "")}</h1>
            <Link href="/">Обратно</Link>
        </div>
    );
}
