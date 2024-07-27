import styles from './deposit.module.css'
import { useNavigate } from 'react-router-dom'
export function Deposit() {

    const navigate = useNavigate()

    const onDeposit = (e) => {
        e.preventDefault()

        const username = localStorage.getItem('username')
        if (username == null) {
            navigate('/signin')
        }
        const amount =Number( e.target.amount.value)
      
        fetch('http://localhost:3100/deposit', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, amount })
        }).then(res => res.json())
            .then(json => console.log(json))

        navigate('/')
    }

    return (
        <div className={styles.depCont}>
            <h1> Deposit Amount </h1>
            <form onSubmit={onDeposit}>
                <input type='number' placeholder='Amount' name='amount' />
                <input type='submit' value='Deposit' />
            </form>
        </div>
    )
}