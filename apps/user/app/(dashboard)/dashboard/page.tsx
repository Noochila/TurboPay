'use client'
import React, { useEffect, useState } from "react"
import UtilityCard from "../../../components/UtilityCard"
import axios from "axios"
import { useRouter } from 'next/navigation';

async function getUtilityData() {
    const response = await axios.get('http://localhost:1337/api/phone-bills?populate=*', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer c86403c1452c45b25eae554f81e52259260feaeb50ec43cf8a84b995a4bbc7ff41d903f23d85af7b95ddfd4cc62f160b4be9811cbe0d2cafb26c3b87f0a88634e5655e9f93fb27e910f7c20b3d2e85abcc369590710f8d87ad6ab9f68173dd78b6d0e0264b87b48fb83f73725484809753803952f1d45cd893438273b9fafee9`
        }
    })
    const data = await response.data
    return data.data
}

export default function Dashboard() {
    const [data, setData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getUtilityData().then(setData);
    }, []);

    return <div>
        {data.map((e: any) => (
            <div onClick={() => router.push('/recharge?provider='+e.attributes.provider+'&type='+e.attributes.type)} key={e.id}>
                <UtilityCard name={e.attributes.provider} imageUrl={e.attributes.Image.data && "http://localhost:1337" + e.attributes.Image.data[0].attributes.url} />
            </div>
        ))}
    </div>
}