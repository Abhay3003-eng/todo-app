import React, { useEffect, useState } from 'react'
import axios from "axios";

const ApiFetch = () => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos',{
                method:'GET'
            });
            const data = await res.json();

            console.log(data);

            setData(data);
        } catch (error) {
            console.log("error->>>>", error.message);
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div>
            <div className="constainer">
                {
                    data.map((row) => {
                        return <div key={row.id} className="card">
                            {row.title}
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default ApiFetch
