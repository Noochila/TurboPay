
import { useEffect, useState } from "react"
import styles from './balance.module.css'
import axios from "axios"
import { useNavigate } from "react-router-dom"

export function Balance() {

    const [bal, setBal] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBalance = async () => {
            const username = localStorage.getItem('username')
            if (username == null) {
                navigate('/signin')
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3100/balance/${username}`)
                setBal(response.data.balance)
            } catch (error) {
                console.error('Failed to fetch balance:', error)
            }
        }

        fetchBalance()
    })

    return (
        <div className={styles.balCont}>
            <h1> Balance Is : INR. {bal} </h1>
        </div>
    )
}